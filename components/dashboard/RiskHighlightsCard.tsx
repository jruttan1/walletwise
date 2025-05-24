import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RiskHighlights } from "@/components/risk-highlights"
import { AlertTriangle } from "lucide-react"

interface RiskHighlight {
  text: string;
  sources?: string[];
}

interface RiskHighlightsCardProps {
  isLoading: boolean
  ticker: string
  risks?: RiskHighlight[]
}

export const RiskHighlightsCard: React.FC<RiskHighlightsCardProps> = ({ 
  isLoading, 
  ticker,
  risks = []
}) => {
  const isAnalyzing = risks.length === 0 && !isLoading

  // Debug log props
  React.useEffect(() => {
    console.log('RiskHighlightsCard props:', { isLoading, ticker, risksLength: risks?.length })
  }, [isLoading, ticker, risks])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle>Risk Highlights</CardTitle>
          {isAnalyzing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : isAnalyzing ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : risks.length > 0 ? (
          <RiskHighlights isLoading={isLoading} ticker={ticker} risks={risks} />
        ) : (
          <p>No risks found.</p>
        )}
      </CardContent>
    </Card>
  )
} 