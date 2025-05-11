import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import PortfolioGrid from "@/components/PortfolioGrid"

// Mock portfolio data
const MOCK_PORTFOLIO_DATA = [
  { ticker: "AAPL", name: "Apple Inc.", allocation: 25, shares: 42, value: 7350, gainLoss: 1250, percentChange: 20.5, costBasis: 6100 },
  { ticker: "MSFT", name: "Microsoft Corp.", allocation: 20, shares: 30, value: 5880, gainLoss: 980, percentChange: 20, costBasis: 4900 },
  { ticker: "GOOGL", name: "Alphabet Inc.", allocation: 15, shares: 12, value: 4410, gainLoss: -320, percentChange: -6.8, costBasis: 4730 },
  { ticker: "AMZN", name: "Amazon.com Inc.", allocation: 15, shares: 24, value: 4410, gainLoss: 680, percentChange: 18.2, costBasis: 3730 },
  { ticker: "META", name: "Meta Platforms Inc.", allocation: 10, shares: 35, value: 2940, gainLoss: -150, percentChange: -4.9, costBasis: 3090 },
  { ticker: "TSLA", name: "Tesla Inc.", allocation: 10, shares: 15, value: 2940, gainLoss: 420, percentChange: 16.7, costBasis: 2520 },
  { ticker: "NVDA", name: "NVIDIA Corp.", allocation: 5, shares: 8, value: 1470, gainLoss: 350, percentChange: 31.2, costBasis: 1120 },
]

const COLORS = [
  "#4f46e5", // indigo-600
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#84cc16", // lime-500
]

interface PortfolioDashboardProps {}

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = () => {
  // Calculate overall portfolio value and gain/loss
  const portfolioValue = MOCK_PORTFOLIO_DATA.reduce((sum, holding) => sum + holding.value, 0)
  const portfolioGainLoss = MOCK_PORTFOLIO_DATA.reduce((sum, holding) => sum + holding.gainLoss, 0)
  const portfolioPercentChange = (portfolioGainLoss / (portfolioValue - portfolioGainLoss)) * 100

  // Transform the mock data to match the Position interface expected by PortfolioGrid
  const positions = MOCK_PORTFOLIO_DATA.map(holding => ({
    symbol: holding.ticker,
    name: holding.name,
    shares: holding.shares,
    costBasis: holding.costBasis,
    percentChange: holding.percentChange,
    // Include any other fields that might be needed
  }))

  return (
    <div className="space-y-8">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Value</h3>
              <p className="text-3xl font-bold">${portfolioValue.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Gain/Loss</h3>
              <div className="flex items-center">
                <p className={`text-3xl font-bold ${portfolioGainLoss >= 0 ? "text-success" : "text-danger"}`}>
                  ${Math.abs(portfolioGainLoss).toLocaleString()}
                </p>
                <span className={`ml-2 flex items-center ${portfolioGainLoss >= 0 ? "text-success" : "text-danger"}`}>
                  {portfolioGainLoss >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 mr-1" />
                  )}
                  {Math.abs(portfolioPercentChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Holdings</h3>
              <p className="text-3xl font-bold">{MOCK_PORTFOLIO_DATA.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Grid */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle>Your Holdings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <PortfolioGrid positions={positions} />
        </CardContent>
      </Card>

      {/* Allocation Chart and Top Performers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Allocation Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_PORTFOLIO_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="allocation"
                    nameKey="ticker"
                  >
                    {MOCK_PORTFOLIO_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Allocation"]}
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "0.375rem",
                      color: "var(--color-card-foreground)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_PORTFOLIO_DATA
                .sort((a, b) => b.percentChange - a.percentChange)
                .slice(0, 3)
                .map((holding) => (
                  <div
                    key={holding.ticker}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/40 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{holding.ticker}</div>
                      <div className="text-sm text-muted-foreground">{holding.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-success">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{holding.percentChange.toFixed(1)}%</span>
                      </div>
                      <div className="text-sm text-muted-foreground">${holding.value.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 