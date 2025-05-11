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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                Market capitalization represents the total value of a company's outstanding shares.
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
                The price-to-earnings ratio measures a company's current share price relative to its earnings per share.
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
                Trailing twelve months revenue represents the company's total revenue over the past 12 months.
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
                Earnings per share (TTM) represents a company's profit divided by its outstanding shares over the past 12 months.
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
                Dividend yield shows how much a company pays in dividends each year relative to its stock price.
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