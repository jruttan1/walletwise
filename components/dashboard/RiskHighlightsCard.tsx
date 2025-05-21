import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RiskHighlights } from "@/components/risk-highlights"

interface RiskHighlight {
  text: string;
  sources?: string[];
}

interface RiskHighlightsCardProps {
  isLoading: boolean
  ticker: string
  risks?: RiskHighlight[]
}

export const RiskHighlightsCard: React.FC<RiskHighlightsCardProps> = ({ isLoading, ticker, risks }) => {
  // Debug log props
  React.useEffect(() => {
    console.log('RiskHighlightsCard props:', { isLoading, ticker, risksLength: risks?.length })
  }, [isLoading, ticker, risks])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <RiskHighlights isLoading={isLoading} ticker={ticker} risks={risks} />
      </CardContent>
    </Card>
  )
} 