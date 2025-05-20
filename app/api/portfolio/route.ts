import { NextRequest, NextResponse } from 'next/server'
import { fetchStock } from '@/lib/yahoo'
import { askSonar } from '@/lib/sonar'

export async function POST(req: NextRequest) {
  const { positions } = await req.json() as {
    positions: Array<{ symbol: string, shares: number; costBasis?: number }>
  };

  try { 
    // Fetch quote and compute each positions metrics
    const portfolioQuotes = await Promise.all(
      positions.map(async position => {
        const { quote: summary } = await fetchStock(position.symbol)
        const current  = summary.price.regularMarketPrice
        const previous = summary.price.regularMarketPreviousClose
        const dailyPct = ((current - previous) / previous) * 100
        const costBase = position.costBasis ?? previous
        const value    = position.shares * current

        return {
            symbol: position.symbol,
            shares: position.shares,
            costBasis: costBase,
            currentPrice: current,
            previousPrice: previous,
            dailyPct,
            value,
        }

      })
    );

    // Portfolio overview

    const totalValue = portfolioQuotes.reduce((sum, d) => sum + d.value, 0)
    const totalCost = portfolioQuotes.reduce((sum, d) => sum + d.shares * d.costBasis, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainPct = (totalGainLoss / totalCost) * 100
    const holdingsCount = portfolioQuotes.length
    
    // Asset Allocation
    const allocation = portfolioQuotes.map(d => ({
        symbol: d.symbol,
        pct: d.value / totalValue,
        value: d.value,
    }))

    // Top Performers

    const topPerformers = [...portfolioQuotes]
    .sort((a, b) => b.dailyPct - a.dailyPct)
    .slice(0, 3)
    .map(d => ({ symbol: d.symbol, dailyPct: d.dailyPct }))

    // AI Analysis

    const prompt = `You are an AI investment coach. Given these holdings:
    ${JSON.stringify(portfolioQuotes, null, 2)}
    —assign an investor personality, give a 2–3 sentence overall review of strengths and risks, and suggest three tickers to improve diversification.
    Reply with JSON: { "personality": string, "review": string, "diversify": [string,string,string] }
        `.trim()

    const aiReview = await askSonar(prompt)

    // Return JSON from API

    return NextResponse.json({
        positions: portfolioQuotes,
        overview: {
            totalValue,
            totalCost,
            totalGainLoss,
            totalGainPct,
            holdingsCount,
        },
        allocation,
        topPerformers,
        aiReview,
    })
  } catch (e: any) {
    console.error('Portfolio error', e)
    return NextResponse.json({ error: e.message }, { status: 404 })
  }

}