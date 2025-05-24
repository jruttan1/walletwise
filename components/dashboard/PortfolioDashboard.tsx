'use client'
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { PortfolioGrid } from "./PortfolioGrid"
import { InvestorPersonality } from "./InvestorPersonality"
import { PortfolioInsights } from "./PortfolioInsights"
import { PortfolioQnA } from "./PortfolioQnA"

// Portfolio data
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

interface PortfolioDashboardProps {
  data: {
    positions: Position[]
    overview: Overview
    allocation: Allocation[]
    topPerformers: TopPerformer[]
    aiReview: AIReview
  }
}

const COLORS = [
   "#53515C", // muted indigo
   "#6B5F7F", // dusty violet
   "#C98A9E", // muted pink
   "#B06C72", // mauve-rose
   "#C2564F", // soft red
   "#D08A4A", // burnt orange
   "#8A9F4D", // earthy lime
]

// Custom tooltip formatter
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium">{data.symbol}</p>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{data.pct.toFixed(1)}%</span> of portfolio
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">${data.value.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom legend formatter
const CustomLegend = ({ payload, allocation }: any) => {
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
            ({allocation[index].pct.toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
};

export const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({
  data: { positions, overview, allocation, topPerformers, aiReview },
}) => {
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
              <p className="text-3xl font-bold">${overview.totalValue.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Today's Change</h3>
              <div className="flex items-center">
                <p className={`text-3xl font-bold ${overview.totalGainLoss >= 0 ? "text-success" : "text-danger"}`}>
                  ${Math.abs(overview.totalGainLoss).toLocaleString()}
                </p>
                <span className={`ml-2 flex items-center ${overview.totalGainLoss >= 0 ? "text-success" : "text-danger"}`}>
                  {overview.totalGainLoss >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 mr-1" />
                  )}
                  {Math.abs(overview.totalGainPct).toFixed(1)}%
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Holdings</h3>
              <p className="text-3xl font-bold">{overview.holdingsCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investor Profile */}
      <InvestorPersonality 
        portfolioData={{
          symbols: allocation.map(d => d.symbol),
          weights: allocation.map(d => d.pct)
        }}
        personality={aiReview.personality}
      />

      {/* Portfolio Insights */}
      <PortfolioInsights
        analysis={aiReview.review}
        citations={aiReview.citations}
        diversificationPicks={aiReview.diversify}
      />

      {/* Portfolio Grid */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle>Your Holdings</CardTitle>
          <p className="text-sm text-muted-foreground">Click on a stock for your AI insights :)</p>
        </CardHeader>
        <CardContent className="pt-6">
          <PortfolioGrid positions={positions} />
        </CardContent>
      </Card>

      {/* Portfolio Q&A */}
      <PortfolioQnA portfolioData={{ positions, overview }} />

      {/* Allocation Chart and Biggest Movers */}
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
                    data={allocation}
                    cx="45%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="pct"
                    nameKey="symbol"
                  >
                    {allocation.map((entry, index) => (
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
                    content={<CustomLegend allocation={allocation} />}
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

        {/* Biggest Movers */}
        <Card>
          <CardHeader>
            <CardTitle>Biggest Movers</CardTitle>
            <p className="text-sm text-muted-foreground">Today's largest price changes</p>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {[...(positions || [])]
                .map(position => ({
                  symbol: position.symbol,
                  dailyPct: position.dailyPct,
                  absDailyPct: Math.abs(position.dailyPct)
                }))
                .sort((a, b) => b.absDailyPct - a.absDailyPct)
                .slice(0, 3)
                .map((position, index) => (
                  <div 
                    key={position.symbol} 
                    className="py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb- gap-y-3">
                      <div>
                        <span className="font-medium text-lg">{position.symbol}</span>
                        <span className="ml-2 text-sm text-muted-foreground">#{index + 1}</span>
                      </div>
                      <span className={`flex items-center font-semibold ${position.dailyPct >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {position.dailyPct >= 0 ? (
                          <ArrowUpRight className="h-5 w-5 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 mr-1" />
                        )}
                        {Math.abs(position.dailyPct).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              {(!positions || positions.length === 0) && (
                <div className="py-3 text-sm text-muted-foreground text-center">
                  No performance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <p className="text-muted-foreground text-center">
              This is not financial advice. This is an educational tool to help you understand investing. Insights are AI-generated and may not be accurate nor should be used for financial decisions.
      </p>
    </div>
  )
} 