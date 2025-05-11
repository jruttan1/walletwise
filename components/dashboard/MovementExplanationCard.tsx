import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { MovementExplanation } from "@/components/movement-explanation"

interface MovementExplanationCardProps {
  isLoading: boolean
  ticker: string
  movementExplanation?: string | null
  movement?: {
    direction: 'up' | 'down'
    percentage: string
  }
}

export const MovementExplanationCard: React.FC<MovementExplanationCardProps> = ({ 
  isLoading, 
  ticker, 
  movementExplanation,
  movement = { direction: Math.random() > 0.5 ? 'up' : 'down', percentage: Math.random() > 0.5 ? '+2.4%' : '-1.8%' }
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center">
        <CardTitle>Today's Movement Explained</CardTitle>
        {!isLoading && movement && (
          <div className="ml-4 flex items-center">
            {movement.direction === 'up' ? (
              <div className="flex items-center text-success">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="font-semibold">{movement.percentage}</span>
              </div>
            ) : (
              <div className="flex items-center text-danger">
                <TrendingDown className="h-5 w-5 mr-1" />
                <span className="font-semibold">{movement.percentage}</span>
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
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-sm text-primary hover:underline flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              Source 1
            </a>
            <a href="#" className="text-sm text-primary hover:underline flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              Source 2
            </a>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Loading explanation from Sonar...</p>
      )}
    </CardContent>
  </Card>
) 