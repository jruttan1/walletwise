import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface FundamentalsCardProps {
  isLoading: boolean
  fundamentals?: {
    marketCap: string
    peRatio: string
    revenueTTM: string
    epsTTM: string
    dividendYield: string
  }
  expandedMetric: string | null
  toggleMetricExpansion: (metric: string) => void
}

export const FundamentalsCard: React.FC<FundamentalsCardProps> = ({
  isLoading,
  fundamentals,
  expandedMetric,
  toggleMetricExpansion,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Fundamentals</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">Click on a metric to learn more</p>
      <div className="space-y-4">
        {/* Market Cap */}
        <div
          className={`rounded-lg border border-border p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
            expandedMetric === "marketCap" ? "bg-accent/50 border-primary/30" : ""
          }`}
          onClick={() => toggleMetricExpansion("marketCap")}
        >
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Market Cap</span>
            <span className="font-semibold text-card-foreground">
              {isLoading ? "--" : fundamentals?.marketCap || "--"}
            </span>
          </div>
          {expandedMetric === "marketCap" && (
            <div className="mt-2 border-t border-border pt-2 text-sm">
              <p className="text-muted-foreground">
                The total value of a company on the public market, calculated as share price × number of outstanding shares. It shows company size: large-caps ({'>'}10 B) tend to be stable, mid-caps (2–10 B) balance growth and risk, and small-caps ({'<'}2 B) offer higher growth potential but more volatility.
              </p>
              <div className="mt-2 flex justify-between">
                <a href="#" className="text-primary text-xs hover:underline">
                  Source
                </a>
                <button
                  className="text-primary text-xs hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMetricExpansion("marketCap")
                  }}
                >
                  Show less
                </button>
              </div>
            </div>
          )}
        </div>

        {/* P/E Ratio */}
        <div
          className={`rounded-lg border border-border p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
            expandedMetric === "peRatio" ? "bg-accent/50 border-primary/30" : ""
          }`}
          onClick={() => toggleMetricExpansion("peRatio")}
        >
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">P/E Ratio</span>
            <span className="font-semibold text-card-foreground">
              {isLoading ? "--" : fundamentals?.peRatio || "--"}
            </span>
          </div>
          {expandedMetric === "peRatio" && (
            <div className="mt-2 border-t border-border pt-2 text-sm">
              <p className="text-muted-foreground">
              Share price ÷ earnings per share: Shows how much investors pay for $1 of a company's profit. Higher P/E means greater growth expectations; lower P/E can signal value or slower growth.
              </p>
              <div className="mt-2 flex justify-between">
                <a href="#" className="text-primary text-xs hover:underline">
                  Source
                </a>
                <button
                  className="text-primary text-xs hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMetricExpansion("peRatio")
                  }}
                >
                  Show less
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Revenue TTM */}
        <div
          className={`rounded-lg border border-border p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
            expandedMetric === "revenueTTM" ? "bg-accent/50 border-primary/30" : ""
          }`}
          onClick={() => toggleMetricExpansion("revenueTTM")}
        >
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">TTM Revenue</span>
            <span className="font-semibold text-card-foreground">
              {isLoading ? "--" : fundamentals?.revenueTTM || "--"}
            </span>
          </div>
          {expandedMetric === "revenueTTM" && (
            <div className="mt-2 border-t border-border pt-2 text-sm">
              <p className="text-muted-foreground">
              Sum of the last four quarters' sales; gives a rolling 12-month snapshot of a company's revenue, smoothing seasonality and highlighting recent growth trends.
              </p>
              <div className="mt-2 flex justify-between">
                <a href="#" className="text-primary text-xs hover:underline">
                  Source
                </a>
                <button
                  className="text-primary text-xs hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMetricExpansion("revenueTTM")
                  }}
                >
                  Show less
                </button>
              </div>
            </div>
          )}
        </div>

        {/* EPS TTM */}
        <div
          className={`rounded-lg border border-border p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
            expandedMetric === "epsTTM" ? "bg-accent/50 border-primary/30" : ""
          }`}
          onClick={() => toggleMetricExpansion("epsTTM")}
        >
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">TTM EPS</span>
            <span className="font-semibold text-card-foreground">
              {isLoading ? "--" : fundamentals?.epsTTM || "--"}
            </span>
          </div>
          {expandedMetric === "epsTTM" && (
            <div className="mt-2 border-t border-border pt-2 text-sm">
              <p className="text-muted-foreground">
              Net income over the past 12 months divided by outstanding shares, showing average profit per share; higher values (e.g., $8 for Apple) indicate strong profitability, while lower values (e.g., $0.50 for a small startup) suggest weaker earnings or slower growth.
              </p>
              <div className="mt-2 flex justify-between">
                <a href="#" className="text-primary text-xs hover:underline">
                  Source
                </a>
                <button
                  className="text-primary text-xs hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMetricExpansion("epsTTM")
                  }}
                >
                  Show less
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dividend Yield */}
        <div
          className={`rounded-lg border border-border p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
            expandedMetric === "dividendYield" ? "bg-accent/50 border-primary/30" : ""
          }`}
          onClick={() => toggleMetricExpansion("dividendYield")}
        >
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">Dividend Yield</span>
            <span className="font-semibold text-card-foreground">
              {isLoading ? "--" : fundamentals?.dividendYield || "--"}
            </span>
          </div>
          {expandedMetric === "dividendYield" && (
            <div className="mt-2 border-t border-border pt-2 text-sm">
              <p className="text-muted-foreground">
              Annual dividends per share ÷ share price, shown as a percentage; a higher yield (e.g., 5%) means more income but can signal risk or slowdown, while a lower yield (e.g., 1%) often reflects a growth-oriented company.
              </p>
              <div className="mt-2 flex justify-between">
                <a href="#" className="text-primary text-xs hover:underline">
                  Source
                </a>
                <button
                  className="text-primary text-xs hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMetricExpansion("dividendYield")
                  }}
                >
                  Show less
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
) 