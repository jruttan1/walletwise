'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, TrendingUp, Target } from "lucide-react"

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

export const PortfolioInsights: React.FC<PortfolioInsightsProps> = ({
  analysis,
  citations,
  diversificationPicks,
  isLoading = false
}) => {
  const isAnalyzing = analysis === 'AI analysis is being generated in the background.'

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
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>AI Portfolio Analysis</CardTitle>
          {isAnalyzing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overall Assessment
          </h3>
          {isAnalyzing ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ) : (
            <p className="text-muted-foreground leading-relaxed">{analysis}</p>
          )}
        </div>

        {/* Analysis Text with Citations */}
        <div 
          className="text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: analysisWithLinks }}
        />

        {/* Diversification Suggestions */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Diversification Suggestions
          </h3>
          {isAnalyzing ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
              <div className="h-8 bg-muted rounded w-20"></div>
            </div>
          ) : diversificationPicks.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {diversificationPicks.map((ticker, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {ticker}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No suggestions available</p>
          )}
        </div>

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
