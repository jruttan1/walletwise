import { TrendingDown, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MovementExplanationProps {
  isLoading: boolean
  ticker: string
}

export function MovementExplanation({ isLoading, ticker }: MovementExplanationProps) {
  // Sample data - would be replaced with actual API data
  const movement = {
    direction: "up",
    percentage: "+2.3%",
    explanation:
      "The stock is up today primarily due to the announcement of a new product line and better-than-expected quarterly earnings. Analysts have responded positively to the news, with several upgrading their price targets.",
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {movement.direction === "up" ? (
          <TrendingUp className="h-6 w-6 text-green-500" />
        ) : (
          <TrendingDown className="h-6 w-6 text-red-500" />
        )}
        <span className={`text-lg font-semibold ${movement.direction === "up" ? "text-green-500" : "text-red-500"}`}>
          {movement.percentage}
        </span>
      </div>
      <p className="text-sm">{movement.explanation}</p>
    </div>
  )
}
