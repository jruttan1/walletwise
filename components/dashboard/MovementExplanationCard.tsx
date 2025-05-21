import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"

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

export const MovementExplanationCard: React.FC<MovementExplanationCardProps> = ({ 
  isLoading, 
  ticker, 
  movementExplanation,
  movementSources,
  priceHistory,
  movement
}) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>This Week's Movement Explained</CardTitle>
          {!isLoading && displayMovement && (
            <div className="ml-4 flex items-center">
              {displayMovement.direction === 'up' ? (
                <div className="flex items-center text-success">
                  <TrendingUp className="h-5 w-5 mr-1" />
                  <span className="font-semibold">{displayMovement.percentage}</span>
                </div>
              ) : (
                <div className="flex items-center text-danger">
                  <TrendingDown className="h-5 w-5 mr-1" />
                  <span className="font-semibold">{displayMovement.percentage}</span>
                </div>
              )}
            </div>
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
        ) : movementExplanation ? (
          <div className="space-y-3">
            <p className="text-card-foreground">{movementExplanation}</p>
            
            {/* Debug information */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-muted-foreground mt-2 mb-1">
                Sources available: {movementSources ? movementSources.length : 0}
              </div>
            )}
            
            {movementSources && movementSources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {movementSources.map((source, idx) => (
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
        ) : (
          <p className="text-muted-foreground">Loading explanation from Sonar...</p>
        )}
      </CardContent>
    </Card>
  );
} 