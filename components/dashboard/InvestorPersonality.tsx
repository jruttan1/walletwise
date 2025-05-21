'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface InvestorPersonalityProps {
  portfolioData: {
    symbols: string[]
    weights: number[]
  }
  personality: string
}

export function InvestorPersonality({ portfolioData, personality }: InvestorPersonalityProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Your Investor Profile</h3>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-medium text-primary">{personality}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on your current holdings, we've generated a profile for you.
        </p>
      </CardContent>
    </Card>
  )
} 