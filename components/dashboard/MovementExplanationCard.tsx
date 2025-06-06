import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


interface MovementExplanationCardProps {
  isLoading: boolean
  ticker: string
  movementExplanation?: string | null
  movementSources?: string[]
  movement?: {
    direction: 'up' | 'down'
    percentage: string
  }
  priceHistory?: Array<{ date: string, close: number }> 
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

export const MovementExplanationCard: React.FC<MovementExplanationCardProps> = ({ 
  isLoading, 
  ticker, 
  movementExplanation,
  movementSources,
  priceHistory,
  movement
}) => {
  const isAnalyzing = movementExplanation === null && !isLoading

  // Calculate real movement data from the price history if available
  const calculatedMovement = React.useMemo(() => {
    if (!priceHistory || priceHistory.length < 2) return null;
    
    // Get just the last week's worth of data (last 5 trading days)
    const last7Days = priceHistory.slice(-5);
    
    if (last7Days.length < 2) return null;
    
    // Get first and last price points from the last week
    const startOfWeek = last7Days[0];
    const endOfWeek = last7Days[last7Days.length - 1];
    
    // Calculate percentage change for the week
    const change = endOfWeek.close - startOfWeek.close;
    const percentChange = (change / startOfWeek.close) * 100;
    
    return {
      direction: percentChange >= 0 ? 'up' : 'down',
      percentage: `${Math.abs(percentChange).toFixed(2)}%`
    };
  }, [priceHistory]);
  
  // Use provided movement or calculated one
  const displayMovement = movement || calculatedMovement;

  // Calculate percentage change for display
  let changePercent = 0;
  if (priceHistory && priceHistory.length >= 2) {
    const latest = priceHistory[priceHistory.length - 1].close;
    const previous = priceHistory[priceHistory.length - 2].close;
    changePercent = ((latest - previous) / previous) * 100;
  }

  // Process citations in movement explanation
  const sources = movementSources || [];
  const processedExplanation = movementExplanation ? processCitations(movementExplanation, sources) : '';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>What moved {ticker} this week?</CardTitle>
            {isAnalyzing && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </div>
          {changePercent !== 0 && (
            <span className={`text-sm font-medium ${changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        ) : isAnalyzing ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        ) : movementExplanation ? (
          <div className="space-y-3">
            <div 
              className="text-card-foreground"
              dangerouslySetInnerHTML={{ __html: processedExplanation }}
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
          </div>
        ) : (
          <p className="text-muted-foreground">Loading explanation from Sonar...</p>
        )}
      </CardContent>
    </Card>
  );
} 