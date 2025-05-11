import { Skeleton } from "@/components/ui/skeleton"

interface FundamentalsGridProps {
  isLoading: boolean
  ticker: string
}

export function FundamentalsGrid({ isLoading, ticker }: FundamentalsGridProps) {
  // Sample data - would be replaced with actual API data
  const fundamentals = {
    marketCap: "$2.8T",
    peRatio: "32.4",
    ttmRevenue: "$394.3B",
    ttmEps: "$6.14",
    dividendYield: "0.5%",
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
        <p className="text-lg font-semibold">{fundamentals.marketCap}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">P/E Ratio</p>
        <p className="text-lg font-semibold">{fundamentals.peRatio}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">TTM Revenue</p>
        <p className="text-lg font-semibold">{fundamentals.ttmRevenue}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">TTM EPS</p>
        <p className="text-lg font-semibold">{fundamentals.ttmEps}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Dividend Yield</p>
        <p className="text-lg font-semibold">{fundamentals.dividendYield}</p>
      </div>
    </div>
  )
}
