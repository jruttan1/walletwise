import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"

interface MovementExplanationCardProps {
  isLoading: boolean
  ticker: string
  movementExplanation?: string | null
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
          <div>
            <p className="text-card-foreground">{movementExplanation}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Loading explanation from Sonar...</p>
        )}
      </CardContent>
    </Card>
  );
} 