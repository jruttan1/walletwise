// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchStock }            from '@/lib/yahoo'
import { askSonar }              from '@/lib/sonar'

interface PortfolioRequest {
  positions: { symbol: string; shares: number }[]
}

interface SonarAIReview {
  personality: string
  review: string
  citations: Array<{ title: string, url: string }>
  diversify: string[]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as PortfolioRequest

    const quotes = await Promise.all(
      body.positions.map(async (p) => {
        try {
          const { quote } = await fetchStock(p.symbol)
          const current = quote.price.regularMarketPrice
          const previous = quote.price.regularMarketPreviousClose
          const dailyPct = ((current - previous) / previous) * 100
          
          return {
            symbol: p.symbol,
            shares: p.shares,
            currentPrice: current,
            previousPrice: previous,
            dailyPct,
          }
        } catch (error) {
          console.error(`Error fetching quote for ${p.symbol}:`, error)
          return null
        }
      })
    )

    // Filter out any failed quotes (null values)
    const validQuotes = quotes.filter((q): q is NonNullable<typeof q> => q !== null)
    
    // Calculate portfolio overview
    const portfolioQuotes = validQuotes.map(p => ({
      ...p,
      value: p.shares * p.currentPrice,
    }))

    const totalValue    = portfolioQuotes.reduce((sum, d) => sum + d.value, 0)
    const yesterdayValue = portfolioQuotes.reduce((sum, d) => sum + d.shares * d.previousPrice, 0)
    const totalGainLoss = totalValue - yesterdayValue
    const totalGainPct  = yesterdayValue > 0 ? (totalGainLoss / yesterdayValue) * 100 : 0

    // Portfolio overview
    const holdingsCount = portfolioQuotes.length

    // Asset allocation
    const allocation = portfolioQuotes.map(d => ({
      symbol: d.symbol,
      pct:    (d.value / totalValue) * 100,
      value:  d.value,
    }))

    // Top performers
    const topPerformers = [...portfolioQuotes]
      .sort((a, b) => (b.dailyPct || 0) - (a.dailyPct || 0))
      .slice(0, 3)
      .map(d => ({ symbol: d.symbol, dailyPct: d.dailyPct || 0 }))

    return NextResponse.json({
      positions:      portfolioQuotes,
      overview:       { totalValue, totalGainLoss, totalGainPct, holdingsCount },
      allocation,
      topPerformers,
      aiReview: {
        personality: 'Analyzing...',
        review: 'AI analysis is being generated in the background.',
        citations: [],
        diversify: []
      }
    })

    // Note: AI analysis has been moved to a separate endpoint for better performance
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}