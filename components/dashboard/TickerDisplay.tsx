import React from "react"

interface TickerDisplayProps {
  ticker: string
  error?: string | null
}

export const TickerDisplay: React.FC<TickerDisplayProps> = ({ ticker, error }) => (
  <div className="mb-8">
    <div className="flex items-center">
      <h2 className="text-2xl font-bold text-foreground">{ticker}</h2>
      {error && <div className="ml-4 text-sm text-destructive">{error}</div>}
    </div>
  </div>
) 