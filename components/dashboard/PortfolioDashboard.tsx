import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import PortfolioGrid from "@/components/portfolio-grid"
import { InvestorPersonality } from "@/components/dashboard/InvestorPersonality"
import { PortfolioInsights } from "@/components/dashboard/PortfolioInsights"

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
   "#53515C", // muted indigo
   "#6B5F7F", // dusty violet
   "#C98A9E", // muted pink
   "#B06C72", // mauve-rose
   "#C2564F", // soft red
   "#D08A4A", // burnt orange
   "#8A9F4D", // earthy lime
]

interface PortfolioDashboardProps {}

// Custom tooltip formatter
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm">{data.name}</p>
        <p className="text-muted-foreground text-sm">{data.ticker}</p>
        <p className="font-semibold text-lg mt-1">{data.allocation}%</p>
        <p className="text-muted-foreground text-sm">${data.value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// Custom legend formatter
const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-col gap-2">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium">{entry.value}</span>
          <span className="text-sm text-muted-foreground">
            ({MOCK_PORTFOLIO_DATA[index].allocation}%)
          </span>
        </div>
      ))}
    </div>
  );
};

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

      {/* Investor Profile */}
      <InvestorPersonality 
        portfolioData={{
          symbols: MOCK_PORTFOLIO_DATA.map(d => d.ticker),
          weights: MOCK_PORTFOLIO_DATA.map(d => d.allocation)
        }} 
      />

      {/* Portfolio Insights */}
      <PortfolioInsights
        analysis="Your portfolio shows confidence in disruptive tech giants with strong brand loyalty and innovation potential (Apple's 97% customer satisfaction[3], Tesla's autonomous driving ambitions[1]). However, it lacks diversification, exposing you to sector-specific risks (EV competition[1], cognitive biases toward popular stocks[2]) and reliance on Elon Musk's strategic decisions[4]."
        citations={[
          {
            title: "Tesla Stock vs Apple Stock: Best Buy Right Now According Wall Street",
            url: "https://www.nasdaq.com/articles/tesla-stock-vs-apple-stock-best-buy-right-now-according-wall-street"
          },
          {
            title: "Attachment to NVIDIA and Apple Stocks",
            url: "https://www.investopedia.com/attachment-to-nvidia-and-apple-stocks-11706448"
          },
          {
            title: "Apple Customer Satisfaction Analysis",
            url: "https://www.youtube.com/watch?v=Is17flHfEzA"
          },
          {
            title: "Tesla Stock vs Apple Stock: Billionaires Buy One and Sell Other",
            url: "https://www.nasdaq.com/articles/tesla-stock-vs-apple-stock-billionaires-buy-one-and-sell-other"
          }
        ]}
        diversificationPicks={["VTI", "BND", "JNJ"]}
      />

      {/* Portfolio Grid */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle>Your Holdings</CardTitle>
          <p className="text-sm text-muted-foreground">This is the good stuff - Click on a stock for your AI insights :)</p>
        </CardHeader>
        <CardContent className="pt-6">
          <PortfolioGrid positions={positions} />
        </CardContent>
      </Card>

      {/* Allocation Chart and Top Performers */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Allocation Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_PORTFOLIO_DATA}
                    cx="45%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="allocation"
                    nameKey="ticker"
                  >
                    {MOCK_PORTFOLIO_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="var(--background)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    content={<CustomLegend />}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{
                      paddingLeft: "20px"
                    }}
                  />
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