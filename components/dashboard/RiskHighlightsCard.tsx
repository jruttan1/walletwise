import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { RiskHighlights } from "@/components/risk-highlights"

interface RiskHighlightsCardProps {
  isLoading: boolean
  ticker: string
  risks?: { text: string; sources: string[] }[]
}

export const RiskHighlightsCard: React.FC<RiskHighlightsCardProps> = ({ isLoading, ticker, risks }) => (
  <Card>
    <CardHeader>
      <CardTitle>Risk Highlights</CardTitle>
    </CardHeader>
    <CardContent>
      <RiskHighlights isLoading={isLoading} ticker={ticker} />
    </CardContent>
  </Card>
) 