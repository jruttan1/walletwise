'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

interface InvestorPersonalityProps {
  portfolioData: {
    symbols: string[]
    weights: number[]
  }
}

export function InvestorPersonality({ portfolioData }: InvestorPersonalityProps) {
  const [personality, setPersonality] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getPersonality() {
      try {
        // TODO: Replace with actual API call to get AI-generated personality
        // This is a mock implementation
        const mockPersonalities = [
          'Growth-Focused Tech Enthusiast',
          'Balanced Value Investor',
          'Conservative Dividend Seeker',
          'Aggressive Growth Trader',
          'ESG-Conscious Innovator'
        ]
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        const randomPersonality = mockPersonalities[Math.floor(Math.random() * mockPersonalities.length)]
        setPersonality(randomPersonality)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch investor personality:', error)
        setPersonality('Balanced Investor')
        setLoading(false)
      }
    }

    if (portfolioData.symbols.length > 0) {
      getPersonality()
    }
  }, [portfolioData])

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Your Investor Profile</h3>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-6 w-3/4" />
        ) : (
          <p className="text-xl font-medium text-primary">{personality}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          Based on your current holdings, we've generated a profile for you.
        </p>
      </CardContent>
    </Card>
  )
} 