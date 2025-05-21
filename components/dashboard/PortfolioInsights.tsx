'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Citation {
  title: string
  url: string
}

interface PortfolioInsightsProps {
  analysis: string | undefined
  citations: Citation[]
  diversificationPicks: string[]
  isLoading?: boolean
}

export function PortfolioInsights({ 
  analysis = '', // Provide default empty string
  citations = [], // Provide default empty array
  diversificationPicks = [], // Provide default empty array
  isLoading = false 
}: PortfolioInsightsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Replace citation numbers [n] with linked superscripts
  const analysisWithLinks = analysis?.replace(
    /\[(\d+)\]/g,
    (_, num) => {
      const citation = citations[parseInt(num) - 1];
      return citation 
        ? `<sup><a href="${citation.url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80">[${num}]</a></sup>`
        : `[${num}]`;
    }
  ) || 'Analysis not available';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Text with Citations */}
        <div 
          className="text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: analysisWithLinks }}
        />

        {/* Diversification Recommendations */}
        {diversificationPicks.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Recommended for Diversification</h4>
            <div className="flex flex-wrap gap-2">
              {diversificationPicks.map((ticker) => (
                <Button
                  key={ticker}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => window.open(`https://finance.yahoo.com/quote/${ticker}`, '_blank')}
                >
                  {ticker}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Citations List */}
        {citations.length > 0 && (
          <div className="text-xs text-muted-foreground border-t pt-4 mt-4">
            <h4 className="font-medium mb-2">Sources</h4>
            <ol className="list-decimal list-inside space-y-1">
              {citations.map((citation, index) => (
                <li key={index}>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {citation.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
