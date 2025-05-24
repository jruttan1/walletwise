import { ArrowRight, ExternalLink } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SimilarStock {
  ticker: string;
  reason: string;
  sources?: string[];
}

interface SimilarStocksProps {
  isLoading: boolean
  ticker: string
  similarStocks?: SimilarStock[]
}

// Function to process citations in text
const processCitations = (text: string, sources: string[]): string => {
  return text.replace(
    /\[(\d+)\]/g,
    (match, num) => {
      const citationIndex = parseInt(num) - 1;
      const source = sources[citationIndex];
      
      // Only create superscript link if citation actually exists
      if (source && citationIndex < sources.length) {
        return `<sup><a href="${source}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80">[${num}]</a></sup>`;
      }
      
      // Remove invalid citation references entirely
      return '';
    }
  );
};

export function SimilarStocks({ isLoading, ticker, similarStocks }: SimilarStocksProps) {
  // Fallback data if none provided
  const defaultStocks: SimilarStock[] = [
    { ticker: "MSFT", reason: "Tech giant with diversified product portfolio", sources: [] },
    { ticker: "GOOGL", reason: "Tech company with strong market position", sources: [] },
    { ticker: "META", reason: "Tech company focused on digital products", sources: [] },
  ]

  const stocksToShow = similarStocks?.length ? similarStocks : defaultStocks;

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
      {stocksToShow.map((stock) => {
        const sources = stock.sources || [];
        const processedReason = processCitations(stock.reason, sources);
        
        return (
          <div key={stock.ticker} className="space-y-2 rounded-lg border p-4">
            <h3 className="font-semibold">{stock.ticker}</h3>
            <div 
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: processedReason }}
            />
            
            {sources.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Source {idx + 1}
                  </a>
                ))}
              </div>
            )}
            
            <a
              href={`https://finance.yahoo.com/quote/${stock.ticker}`}
              target="_blank"
              rel="noopener noreferrer"
            >
            <Button variant="outline" size="sm" className="mt-2">
                View on Yahoo Finance
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </a>
          </div>
        );
      })}
    </div>
  )
}
