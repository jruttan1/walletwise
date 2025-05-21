// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { fetchStock }            from '@/lib/yahoo'
import { askSonar }              from '@/lib/sonar'

interface SonarAIReview {
  personality: string
  review: string
  citations: Array<{ title: string, url: string }>
  diversify: string[]
}

export async function POST(req: NextRequest) {
  const { positions: raw } = (await req.json()) as {
    positions: { symbol: string; shares: number; costBasis?: number }[]
  }
  const positions = raw.map(p => ({
    symbol: p.symbol.trim().toUpperCase(),
    shares: p.shares,
    costBasis: p.costBasis,
  }))

  const invalid: string[] = []
  const detailed = await Promise.all(
    positions.map(async p => {
      console.log('[api/portfolio] invalid tickers:', invalid)
      try {
        const { quote } = await fetchStock(p.symbol)
        const current  = quote.price.regularMarketPrice
        const previous = quote.price.regularMarketPreviousClose
        const dailyPct = ((current - previous) / previous) * 100
        const costBase = p.costBasis ?? previous
        const value    = p.shares * current

        return {
          symbol:       p.symbol,
          shares:       p.shares,
          costBasis:    costBase,
          currentPrice: current,
          previousPrice: previous,
          dailyPct,
          value,
        }
      } catch {
        invalid.push(p.symbol.toUpperCase())
        return null
      }
    })
  )

  // If any tickers failed, return 422 with the list
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: 'Invalid tickers', invalid },
      { status: 422 }
    )
  }

  // Filter out nulls (all are valid now)
  const portfolioQuotes = detailed.filter(
    (d): d is NonNullable<typeof d> => d !== null
  )

  // Portfolio overview
  const totalValue    = portfolioQuotes.reduce((sum, d) => sum + d.value, 0)
  const totalCost     = portfolioQuotes.reduce((sum, d) => sum + d.shares * d.costBasis, 0)
  const totalGainLoss = totalValue - totalCost
  const totalGainPct  = (totalGainLoss / totalCost) * 100
  const holdingsCount = portfolioQuotes.length

  // Asset allocation
  const allocation = portfolioQuotes.map(d => ({
    symbol: d.symbol,
    pct:    (d.value / totalValue) * 100,
    value:  d.value,
  }))

  // Top performers
  const topPerformers = [...portfolioQuotes]
    .sort((a, b) => b.dailyPct - a.dailyPct)
    .slice(0, 3)
    .map(d => ({ symbol: d.symbol, dailyPct: d.dailyPct }))

  // AI review prompt
  const aiPrompt = `
You are an AI investment coach. Given these portfolio holdings:
${JSON.stringify(portfolioQuotes, null, 2)}
—assign an investor personality, give a 3-4 sentence overall review of strengths and risks with citations, and suggest three tickers to improve diversification. dont use any financial jargon. this should be educational for new investors.

IMPORTANT: Respond with ONLY a valid JSON object in this exact format (no backticks, no markdown, just pure JSON):
{
  "personality": "string describing investor type max 4 words keep it fun and engaging",
  "review": "3-4 sentence review with citation references like [1], [2]",
  "citations": [{"title": "source title", "url": "source url"}],
  "diversify": ["TICKER1","TICKER2","TICKER3"]
}
`.trim()

  try {
    const sonarResponse = await askSonar(aiPrompt)
    let aiReview: SonarAIReview;
    
    try {
      // Try to parse the AI response as JSON
      const cleanJsonStr = sonarResponse.answer
        .replace(/^```json\s*/, '') // Remove leading ```json
        .replace(/^```\s*/, '')     // Remove leading ```
        .replace(/\s*```$/, '')     // Remove trailing ```
        .trim();
      
      aiReview = JSON.parse(cleanJsonStr) as SonarAIReview;
      
      // Validate the parsed object has required fields
      if (!aiReview.personality || !aiReview.review || !Array.isArray(aiReview.citations) || !Array.isArray(aiReview.diversify)) {
        throw new Error('Missing required fields in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', sonarResponse.answer);
      
      return NextResponse.json(
        { 
          error: 'Failed to generate portfolio analysis',
          positions: portfolioQuotes,
          overview: { totalValue, totalCost, totalGainLoss, totalGainPct, holdingsCount },
          allocation,
          topPerformers,
          aiReview: {
            personality: 'Analysis Unavailable',
            review: 'We were unable to generate an analysis of your portfolio at this time. Please try again later.',
            citations: [],
            diversify: []
          }
        },
        { status: 200 } // Still return 200 since the core portfolio data is valid
      );
    }

    return NextResponse.json({
      positions:      portfolioQuotes,
      overview:       { totalValue, totalCost, totalGainLoss, totalGainPct, holdingsCount },
      allocation,
      topPerformers,
      aiReview
    })
  } catch (err: any) {
    console.error('AI review error:', err)
    return NextResponse.json(
      { error: 'AI analysis failed' },
      { status: 500 }
    )
  }
}