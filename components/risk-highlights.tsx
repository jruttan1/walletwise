import { AlertTriangle } from "lucide-react"
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
const FALLBACK_RISKS = [
  { text: "Increasing competition in the smartphone market may impact future growth." },
  { text: "Supply chain constraints could affect production capacity." },
  { text: "Regulatory challenges in key markets pose potential risks." },
]

export function RiskHighlights({ isLoading, ticker, risks }: RiskHighlightsProps) {
  // Debug log props
  React.useEffect(() => {
    console.log('RiskHighlights props:', { isLoading, ticker, risks })
  }, [isLoading, ticker, risks])

  // Determine which data to use
  const displayRisks = () => {
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
    <div className="space-y-4">
      {risksToShow.map((risk, index) => (
        <div key={index} className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{risk.text}</p>
        </div>
      ))}
    </div>
  )
}
