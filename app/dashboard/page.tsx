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
  const [portfolioPositions, setPortfolioPositions] = useState<any[]>([])

  // Update selectedTicker whenever symbolParam changes
  useEffect(() => {
    if (symbolParam) {
      setSelectedTicker(symbolParam)
    }
  }, [symbolParam])

  useEffect(() => {
    if (viewMode === "single") {
      fetchTickerData(selectedTicker)
    } else {
      // Reset loading state for portfolio mode
      setIsLoading(false)
    }
  }, [selectedTicker, viewMode])

  const fetchTickerData = async (ticker: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/ticker/${ticker}`)
      // const data = await response.json()

      // For demo purposes, we'll simulate a delay and use mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const priceHistory = generateMockPriceHistory(ticker)
      const fundamentals = getMockFundamentals(ticker)

      setTickerData({
        priceHistory,
        fundamentals,
        movementExplanation: getMockMovementExplanation(ticker),
        riskHighlights: getMockRiskHighlights(ticker),
        similarStocks: getMockSimilarStocks(ticker),
      })
    } catch (err) {
      setError("Failed to fetch data. Please try again.")
      console.error("Error fetching ticker data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMetricExpansion = (metric: string) => {
    if (expandedMetric === metric) {
      setExpandedMetric(null)
    } else {
      setExpandedMetric(metric)
    }
  }

  // Mock data generators
  const generateMockPriceHistory = (ticker: string) => {
    const seed = ticker.charCodeAt(0) + ticker.charCodeAt(1)
    const basePrice = (seed % 10) * 100 + 100

    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (30 - i))

      // Create a somewhat realistic price pattern with some randomness
      const dayFactor = Math.sin(i / 5) * 10
      const randomFactor = Math.random() * 10 - 5
      const price = basePrice + dayFactor + randomFactor + i / 2

      return {
        date: date.toISOString().split("T")[0],
        close: Number.parseFloat(price.toFixed(2)),
      }
    })
  }

  const getMockFundamentals = (ticker: string) => {
    const fundamentalsMap: Record<string, any> = {
      AAPL: { marketCap: "$2.8T", peRatio: "32.4", revenueTTM: "$394.3B", epsTTM: "$6.14", dividendYield: "0.5%" },
      MSFT: { marketCap: "$2.7T", peRatio: "36.2", revenueTTM: "$211.9B", epsTTM: "$9.21", dividendYield: "0.8%" },
      GOOGL: { marketCap: "$1.7T", peRatio: "25.1", revenueTTM: "$307.4B", epsTTM: "$5.80", dividendYield: "0%" },
      AMZN: { marketCap: "$1.6T", peRatio: "59.3", revenueTTM: "$574.8B", epsTTM: "$2.90", dividendYield: "0%" },
      NVDA: { marketCap: "$1.2T", peRatio: "74.2", revenueTTM: "$44.9B", epsTTM: "$4.44", dividendYield: "0.1%" },
      TSLA: { marketCap: "$752.3B", peRatio: "47.8", revenueTTM: "$96.8B", epsTTM: "$4.30", dividendYield: "0%" },
    }

    return fundamentalsMap[ticker] || fundamentalsMap["AAPL"]
  }

  const getMockMovementExplanation = (ticker: string) => {
    const explanations = [
      `${ticker} is up today primarily due to the announcement of a new product line and better-than-expected quarterly earnings. Analysts have responded positively to the news, with several upgrading their price targets.`,
      `${ticker} is down today following reports of supply chain constraints affecting production capacity. The company also faces increased competition in key markets, which may impact future growth prospects.`,
      `${ticker} is showing mixed movement as investors digest recent regulatory developments. While the company reported strong revenue growth, concerns about margin pressure in the coming quarters have tempered enthusiasm.`,
    ]

    return explanations[Math.floor(Math.random() * explanations.length)]
  }

  const getMockRiskHighlights = (ticker: string) => {
    const risks = [
      [
        {
          text: "Increasing competition in the smartphone market may impact future growth.",
          sources: ["Analyst Report", "Industry Analysis"],
        },
        { text: "Supply chain constraints could affect production capacity.", sources: ["Quarterly Report"] },
        {
          text: "Regulatory challenges in key markets pose potential risks.",
          sources: ["Legal Analysis", "Regulatory Filing"],
        },
      ],
      [
        {
          text: "Dependency on cloud services revenue creates concentration risk.",
          sources: ["Earnings Call", "Sector Analysis"],
        },
        { text: "Cybersecurity threats could impact customer trust and operations.", sources: ["Security Report"] },
        { text: "Antitrust scrutiny may lead to business model changes.", sources: ["Legal Analysis", "News Reports"] },
      ],
      [
        {
          text: "Ad revenue fluctuations due to market conditions and privacy changes.",
          sources: ["Industry Trends", "Quarterly Report"],
        },
        {
          text: "Regulatory pressure regarding data practices and content moderation.",
          sources: ["Regulatory Filing", "Legal Analysis"],
        },
        {
          text: "Increasing R&D costs for emerging technologies may pressure margins.",
          sources: ["Financial Analysis", "Earnings Call"],
        },
      ],
    ]

    return risks[Math.floor(Math.random() * risks.length)]
  }

  const getMockSimilarStocks = (ticker: string) => {
    const similarStocksMap: Record<string, any> = {
      AAPL: [
        { ticker: "MSFT", reason: "Tech giant with diversified product portfolio", sources: ["Sector Analysis"] },
        { ticker: "GOOGL", reason: "Tech company with strong market position", sources: ["Industry Report"] },
        { ticker: "META", reason: "Tech company focused on digital products", sources: ["Comparative Analysis"] },
      ],
      MSFT: [
        { ticker: "AAPL", reason: "Tech giant with hardware and software integration", sources: ["Sector Analysis"] },
        { ticker: "GOOGL", reason: "Cloud services and enterprise solutions competitor", sources: ["Industry Report"] },
        { ticker: "AMZN", reason: "Major cloud services competitor", sources: ["Comparative Analysis"] },
      ],
      GOOGL: [
        { ticker: "META", reason: "Digital advertising market competitor", sources: ["Sector Analysis"] },
        { ticker: "MSFT", reason: "Cloud and AI technology competitor", sources: ["Industry Report"] },
        { ticker: "AMZN", reason: "Tech giant with diverse revenue streams", sources: ["Comparative Analysis"] },
      ],
      AMZN: [
        { ticker: "MSFT", reason: "Cloud services competitor with enterprise focus", sources: ["Sector Analysis"] },
        { ticker: "WMT", reason: "Retail market competitor", sources: ["Industry Report"] },
        { ticker: "GOOGL", reason: "Tech company with diverse business model", sources: ["Comparative Analysis"] },
      ],
      NVDA: [
        { ticker: "AMD", reason: "Semiconductor competitor in GPU market", sources: ["Sector Analysis"] },
        { ticker: "INTC", reason: "Semiconductor industry peer", sources: ["Industry Report"] },
        { ticker: "TSM", reason: "Semiconductor manufacturing partner", sources: ["Comparative Analysis"] },
      ],
      TSLA: [
        { ticker: "F", reason: "Electric vehicle market competitor", sources: ["Sector Analysis"] },
        { ticker: "GM", reason: "Auto manufacturer with EV initiatives", sources: ["Industry Report"] },
        { ticker: "RIVN", reason: "Pure-play electric vehicle manufacturer", sources: ["Comparative Analysis"] },
      ],
    }

    return similarStocksMap[ticker] || similarStocksMap["AAPL"]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-6">
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
              />

              {/* Today's Movement Explanation */}
              <MovementExplanationCard 
                isLoading={isLoading} 
                ticker={selectedTicker} 
                movementExplanation={tickerData?.movementExplanation}
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
            {portfolioUploaded ? (
              <PortfolioDashboard />
            ) : (
              <PortfolioUpload onPortfolioLoaded={() => setPortfolioUploaded(true)} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
