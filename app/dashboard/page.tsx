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
  companyInfo: {
    name: string
    businessSummary: string | null
  }
  movementExplanation: string | null
  movementSources?: string[]
  riskHighlights: { text: string; sources: string[] }[]
  similarStocks: { ticker: string; reason: string; sources: string[] }[]
}

// Types
interface Position {
  symbol: string
  shares: number
  currentPrice: number
  previousPrice: number
  dailyPct: number
  value: number
}

interface Overview {
  totalValue: number
  totalGainLoss: number
  totalGainPct: number
  holdingsCount: number
}

interface Allocation {
  symbol: string
  pct: number
  value: number
}

interface TopPerformer {
  symbol: string
  dailyPct: number
}

interface AIReview {
  personality: string
  review: string
  citations: Array<{
    title: string
    url: string
  }>
  diversify: string[]
}

interface PortfolioData {
  positions: Position[]
  overview: Overview
  allocation: Allocation[]
  topPerformers: TopPerformer[]
  aiReview: AIReview
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
  const [isProcessingPortfolio, setIsProcessingPortfolio] = useState(false)

  // Scroll to top when portfolio is uploaded
  useEffect(() => {
    if (portfolioUploaded && portfolioData) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [portfolioUploaded, portfolioData])

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
        // Phase 1: Get basic stock data (fast - price history, fundamentals)
        const response = await fetch(`/api/ticker/${newTicker}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }

        // Show basic data immediately
        setTickerData(data)
        setIsLoading(false)

        // Phase 2: Get AI analysis in the background (slow - movement explanation, risks, similar stocks)
        try {
          const aiResponse = await fetch(`/api/ticker/${newTicker}/ai-analysis`)
          if (aiResponse.ok) {
            const aiData = await aiResponse.json()
            // Update ticker data with AI analysis
            setTickerData(prev => prev ? { ...prev, ...aiData } : null)
          }
        } catch (aiError) {
          console.warn("AI analysis failed:", aiError)
          // Keep the basic data - user still sees price charts and fundamentals
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data. Please try again.")
        console.error("Error fetching ticker data:", err)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [viewMode, symbolParam])

  const handlePortfolioData = async (uploadedData: { positions: Array<{ symbol: string, shares: number }> }) => {
    console.log('[Dashboard] handlePortfolioData called with:', uploadedData)
    
    // Prevent duplicate calls
    if (isProcessingPortfolio) {
      console.log('[Dashboard] Already processing portfolio, ignoring duplicate call')
      return
    }
    
    setIsProcessingPortfolio(true)
    
    try {
      // Phase 1: Get basic portfolio data (fast)
      console.log('[Dashboard] Phase 1: Calling /api/portfolio')
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

      console.log('[Dashboard] Phase 1 complete, setting portfolio data')
      // Show portfolio immediately with placeholder AI data
      setPortfolioData(data);
      setPortfolioUploaded(true);

      // Phase 2: Get AI analysis in the background (slow)
      console.log('[Dashboard] Phase 2: Calling /api/portfolio/ai-analysis')
      try {
        const aiResponse = await fetch("/api/portfolio/ai-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ positions: data.positions })
        });

        if (aiResponse.ok) {
          const aiReview = await aiResponse.json();
          console.log('[Dashboard] Phase 2 complete, updating portfolio with AI data')
          // Update the portfolio data with real AI analysis
          setPortfolioData(prev => prev ? { ...prev, aiReview } : null);
        }
      } catch (aiError) {
        console.warn("AI analysis failed:", aiError);
        // Keep the placeholder AI data - user still sees the portfolio
      }
    } catch (error: any) {
      console.error("Error processing portfolio:", error);
      setError(error.message || "Failed to analyze portfolio. Please try again.");
    } finally {
      setIsProcessingPortfolio(false)
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
            <TickerDisplay 
              ticker={selectedTicker} 
              error={error} 
              companyInfo={tickerData?.companyInfo}
              isLoading={isLoading}
            />

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
                movementSources={tickerData?.movementSources}
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
              <PortfolioUpload onData={handlePortfolioData} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
