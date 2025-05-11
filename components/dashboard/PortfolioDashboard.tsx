import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"

// Mock portfolio data
const MOCK_PORTFOLIO_DATA = [
  { ticker: "AAPL", name: "Apple Inc.", allocation: 25, shares: 42, value: 7350, gainLoss: 1250, percentChange: 20.5 },
  { ticker: "MSFT", name: "Microsoft Corp.", allocation: 20, shares: 30, value: 5880, gainLoss: 980, percentChange: 20 },
  { ticker: "GOOGL", name: "Alphabet Inc.", allocation: 15, shares: 12, value: 4410, gainLoss: -320, percentChange: -6.8 },
  { ticker: "AMZN", name: "Amazon.com Inc.", allocation: 15, shares: 24, value: 4410, gainLoss: 680, percentChange: 18.2 },
  { ticker: "META", name: "Meta Platforms Inc.", allocation: 10, shares: 35, value: 2940, gainLoss: -150, percentChange: -4.9 },
  { ticker: "TSLA", name: "Tesla Inc.", allocation: 10, shares: 15, value: 2940, gainLoss: 420, percentChange: 16.7 },
  { ticker: "NVDA", name: "NVIDIA Corp.", allocation: 5, shares: 8, value: 1470, gainLoss: 350, percentChange: 31.2 },
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

      {/* Allocation Chart and Holdings */}
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

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Ticker</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-right py-3 px-4 font-medium">Shares</th>
                  <th className="text-right py-3 px-4 font-medium">Value</th>
                  <th className="text-right py-3 px-4 font-medium">Gain/Loss</th>
                  <th className="text-right py-3 px-4 font-medium">% Change</th>
                  <th className="text-right py-3 px-4 font-medium">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PORTFOLIO_DATA.map((holding) => (
                  <tr key={holding.ticker} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{holding.ticker}</td>
                    <td className="py-3 px-4">{holding.name}</td>
                    <td className="py-3 px-4 text-right">{holding.shares}</td>
                    <td className="py-3 px-4 text-right">${holding.value.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={holding.gainLoss >= 0 ? "text-success" : "text-danger"}>
                        ${Math.abs(holding.gainLoss).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end">
                        {holding.gainLoss >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1 text-success" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1 text-danger" />
                        )}
                        <span className={holding.gainLoss >= 0 ? "text-success" : "text-danger"}>
                          {Math.abs(holding.percentChange).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">{holding.allocation}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 