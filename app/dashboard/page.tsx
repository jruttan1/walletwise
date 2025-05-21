"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

// Import dashboard components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { TickerDisplay } from "@/components/dashboard/TickerDisplay"
import { PriceTrendChart } from "@/components/dashboard/PriceTrendChart"
import { MovementExplanationCard } from "@/components/dashboard/MovementExplanationCard"
import { FundamentalsCard } from "@/components/dashboard/FundamentalsCard"
import { RiskHighlightsCard } from "@/components/dashboard/RiskHighlightsCard"
import { SimilarStocksCard } from "@/components/dashboard/SimilarStocksCard"
import { PortfolioUpload } from "@/components/dashboard/PortfolioUpload"
import { PortfolioDashboard } from "@/components/dashboard/PortfolioDashboard"

interface TickerData {
  priceHistory: { date: string; close: number }[]
  fundamentals: {
    marketCap: string
    peRatio: string
    revenueTTM: string
    epsTTM: string
    dividendYield: string
  }
  movementExplanation: string | null
  riskHighlights: { text: string; sources: string[] }[]
  similarStocks: { ticker: string; reason: string; sources: string[] }[]
}

interface PortfolioData {
  positions: Array<{
    symbol: string
    shares: number
    costBasis: number
    currentPrice: number
    previousPrice: number
    dailyPct: number
    value: number
  }>
  overview: {
    totalValue: number
    totalCost: number
    totalGainLoss: number
    totalGainPct: number
    holdingsCount: number
  }
  allocation: Array<{
    symbol: string
    pct: number
    value: number
  }>
  topPerformers: Array<{
    symbol: string
    dailyPct: number
  }>
  aiReview: {
    personality: string
    review: string
    citations: Array<{ title: string, url: string }>
    diversify: string[]
  }
}

export default function Dashboard() {
  const searchParams = useSearchParams()
  const viewMode = searchParams.get("mode") || "single"
  const symbolParam = searchParams.get("symbol")

  const [selectedTicker, setSelectedTicker] = useState(symbolParam || "AAPL")
  const [tickerData, setTickerData] = useState<TickerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)

  // For portfolio mode
  const [portfolioUploaded, setPortfolioUploaded] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)

  // Combined effect to handle both symbol changes and data fetching
  useEffect(() => {
    // Only fetch if we're in single stock mode
    if (viewMode !== "single") {
      setIsLoading(false)
      return
    }

    // Update ticker if param changed
    const newTicker = symbolParam || "AAPL"
    if (newTicker !== selectedTicker) {
      setSelectedTicker(newTicker)
    }

    // Fetch data
    const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
        const response = await fetch(`/api/ticker/${newTicker}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }

        // Debug log the API response
        console.log('API Response:', {
          ticker: newTicker,
          priceHistoryLength: data.priceHistory?.length,
          priceHistoryData: data.priceHistory,
          hasRiskHighlights: Boolean(data.riskHighlights?.length),
          riskHighlights: data.riskHighlights
        })

        setTickerData(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch data. Please try again.")
      console.error("Error fetching ticker data:", err)
    } finally {
      setIsLoading(false)
    }
  }

    fetchData()
  }, [viewMode, symbolParam])

  const handlePortfolioData = async (uploadedData: { positions: Array<{ symbol: string, shares: number, costBasis?: number }> }) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadedData)
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze portfolio: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setPortfolioData(data);
      setPortfolioUploaded(true);
    } catch (error: any) {
      console.error("Error processing portfolio:", error);
      setError(error.message || "Failed to analyze portfolio. Please try again.");
    }
  };

  const toggleMetricExpansion = (metric: string) => {
    if (expandedMetric === metric) {
      setExpandedMetric(null)
    } else {
      setExpandedMetric(metric)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        {/* Common Header */}
        <DashboardHeader viewMode={viewMode as "single" | "portfolio"} />

        {viewMode === "single" ? (
          // Single Stock Dashboard
          <>
            <TickerDisplay ticker={selectedTicker} error={error} />

            <div className="space-y-8">
              {/* Price Trend Chart */}
              <PriceTrendChart 
                isLoading={isLoading} 
                error={error} 
                priceHistory={tickerData?.priceHistory}
                ticker={selectedTicker}
              />

              {/* Today's Movement Explanation */}
              <MovementExplanationCard 
                isLoading={isLoading} 
                ticker={selectedTicker} 
                movementExplanation={tickerData?.movementExplanation}
                priceHistory={tickerData?.priceHistory}
              />

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Fundamentals Card */}
                <FundamentalsCard 
                  isLoading={isLoading} 
                  fundamentals={tickerData?.fundamentals}
                  expandedMetric={expandedMetric}
                  toggleMetricExpansion={toggleMetricExpansion}
                />

                {/* Risk Highlights Card */}
                <RiskHighlightsCard 
                  isLoading={isLoading} 
                  ticker={selectedTicker}
                  risks={tickerData?.riskHighlights}
                />
              </div>

              {/* Similar Stocks Card */}
              <SimilarStocksCard 
                isLoading={isLoading} 
                ticker={selectedTicker}
                similarStocks={tickerData?.similarStocks}
              />
            </div>
          </>
        ) : (
          // Portfolio Dashboard
          <>
            {portfolioUploaded && portfolioData ? (
              <PortfolioDashboard data={portfolioData} />
            ) : (
              <PortfolioUpload onPortfolioLoaded={handlePortfolioData} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
