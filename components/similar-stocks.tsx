import { ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface SimilarStocksProps {
  isLoading: boolean
  ticker: string
}

export function SimilarStocks({ isLoading, ticker }: SimilarStocksProps) {
  // Sample data - would be replaced with actual API data
  const similarStocks = [
    { symbol: "MSFT", name: "Microsoft Corporation", reason: "Tech giant with diversified product portfolio" },
    { symbol: "GOOGL", name: "Alphabet Inc.", reason: "Tech company with strong market position" },
    { symbol: "META", name: "Meta Platforms Inc.", reason: "Tech company focused on digital products" },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-24 mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {similarStocks.map((stock) => (
        <div key={stock.symbol} className="space-y-2 rounded-lg border p-4">
          <h3 className="font-semibold">{stock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
          <p className="text-sm">{stock.reason}</p>
          <Button variant="outline" size="sm" className="mt-2">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
