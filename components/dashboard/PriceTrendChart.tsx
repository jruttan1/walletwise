import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface PriceTrendChartProps {
  isLoading: boolean
  error?: string | null
  priceHistory?: { date: string; close: number }[]
}

// Simple date formatter
const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  } catch (e) {
    return dateStr
  }
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ isLoading, error, priceHistory }) => {
  // Ensure we have valid data with fallback
  const data = React.useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return []
    return priceHistory
  }, [priceHistory])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Trend (1 Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Trend (1 Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Trend (1 Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Find min and max for domain
  const prices = data.map(d => d.close)
  const minPrice = Math.floor(Math.min(...prices) * 0.98)
  const maxPrice = Math.ceil(Math.max(...prices) * 1.02)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Trend (1 Month)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                domain={[minPrice, maxPrice]}
                tickFormatter={(value) => `$${value}`}
                width={50}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-md shadow p-2">
                        <p className="text-sm text-foreground">{formatDate(data.date)}</p>
                        <p className="text-base font-medium text-foreground">${data.close.toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGradient)"
                dot={false}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))' }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 