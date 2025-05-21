import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SimilarStocks } from "@/components/similar-stocks"

interface SimilarStocksCardProps {
  isLoading: boolean
  ticker: string
  similarStocks?: { ticker: string; reason: string; sources: string[] }[]
}

export const SimilarStocksCard: React.FC<SimilarStocksCardProps> = ({ isLoading, ticker, similarStocks }) => (
  <Card>
    <CardHeader>
      <CardTitle>Similar Stocks You Might Like</CardTitle>
    </CardHeader>
    <CardContent>
      <SimilarStocks isLoading={isLoading} ticker={ticker} similarStocks={similarStocks} />
    </CardContent>
  </Card>
) 