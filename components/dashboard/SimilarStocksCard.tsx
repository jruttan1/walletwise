import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SimilarStocks } from "@/components/similar-stocks"
import { BarChart3 } from "lucide-react"

interface SimilarStocksCardProps {
  isLoading: boolean
  ticker: string
  similarStocks?: { ticker: string; reason: string; sources: string[] }[]
}

export const SimilarStocksCard: React.FC<SimilarStocksCardProps> = ({ 
  isLoading, 
  ticker,
  similarStocks = []
}) => {
  const isAnalyzing = similarStocks.length === 0 && !isLoading

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle>Similar Stocks</CardTitle>
          {isAnalyzing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : isAnalyzing ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : similarStocks.length > 0 ? (
          <SimilarStocks isLoading={isLoading} ticker={ticker} similarStocks={similarStocks} />
        ) : (
          <p>No similar stocks found.</p>
        )}
      </CardContent>
    </Card>
  )
} 