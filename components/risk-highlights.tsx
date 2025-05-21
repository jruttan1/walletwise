import { AlertTriangle, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

interface RiskHighlight {
  text: string;
  sources?: string[];
}

interface RiskHighlightsProps {
  isLoading: boolean
  ticker: string
  risks?: RiskHighlight[]
}

// Fallback data for testing
const FALLBACK_RISKS: RiskHighlight[] = [
  { text: "Increasing competition in the smartphone market may impact future growth.", sources: [] },
  { text: "Supply chain constraints could affect production capacity.", sources: [] },
  { text: "Regulatory challenges in key markets pose potential risks.", sources: [] },
]

export function RiskHighlights({ isLoading, ticker, risks }: RiskHighlightsProps) {
  // Debug log props
  React.useEffect(() => {
    console.log('RiskHighlights props:', { 
      isLoading, 
      ticker, 
      risksCount: risks?.length || 0,
      risksWithSources: risks?.filter(r => r.sources && r.sources.length > 0).length || 0,
      firstRiskSources: risks?.[0]?.sources
    })
  }, [isLoading, ticker, risks])

  // Determine which data to use
  const displayRisks = (): RiskHighlight[] | null => {
    if (risks && risks.length > 0) {
      return risks
    }
    
    // Use fallback in development
    if (process.env.NODE_ENV === 'development') {
      return FALLBACK_RISKS
    }
    
    return null
  }
  
  const risksToShow = displayRisks()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-start gap-2">
            <Skeleton className="h-5 w-5 mt-0.5" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (!risksToShow) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">No risk analysis available for {ticker}</p>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {risksToShow.map((risk, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-md">{risk.text}</p>
          </div>
          
          {risk.sources && risk.sources.length > 0 && (
            <div className="ml-7 flex flex-wrap gap-2">
              {risk.sources.map((source: string, idx: number) => (
                <a 
                  key={idx}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-primary hover:underline"
                >
                  <span>Source {idx + 1}</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
