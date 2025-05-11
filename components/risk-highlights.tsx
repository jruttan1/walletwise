import { AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface RiskHighlightsProps {
  isLoading: boolean
  ticker: string
}

export function RiskHighlights({ isLoading, ticker }: RiskHighlightsProps) {
  // Sample data - would be replaced with actual API data
  const risks = [
    "Increasing competition in the smartphone market may impact future growth.",
    "Supply chain constraints could affect production capacity.",
    "Regulatory challenges in key markets pose potential risks.",
  ]

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

  return (
    <div className="space-y-4">
      {risks.map((risk, index) => (
        <div key={index} className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{risk}</p>
        </div>
      ))}
    </div>
  )
}
