import { NextRequest, NextResponse } from 'next/server'
import { askSonar } from '@/lib/sonar'

interface Position {
  symbol: string
  shares: number
  currentPrice: number
  previousPrice: number
  dailyPct: number
  value: number
}

interface SonarAIReview {
  personality: string
  review: string
  citations: Array<{ title: string, url: string }>
  diversify: string[]
}

export async function POST(req: NextRequest) {
  try {
    const { positions } = await req.json() as { positions: Position[] }

    // AI review prompt
    const aiPrompt = `
You are an AI investment coach. Given these portfolio holdings:
${JSON.stringify(positions, null, 2)}
—assign an investor personality, give a 3-4 sentence overall review of strengths and risks with citations, and suggest three tickers to improve diversification. dont use any financial jargon. this should be educational for new investors.

IMPORTANT: Respond with ONLY a valid JSON object in this exact format (no backticks, no markdown, just pure JSON):
{
  "personality": "string describing investor type max 4 words keep it fun and engaging",
  "review": "3-4 sentence review, if there are citation references that apply, use them like [1], [2], only if you have the link",
  "citations": [{"title": "source title", "url": "source url"}],
  "diversify": ["TICKER1","TICKER2","TICKER3"]
}
`.trim()

    const sonarResponse = await askSonar(aiPrompt)
    
    try {
      // Try to parse the AI response as JSON
      const cleanJsonStr = sonarResponse.answer
        .replace(/^```json\s*/, '') // Remove leading ```json
        .replace(/^```\s*/, '')     // Remove leading ```
        .replace(/\s*```$/, '')     // Remove trailing ```
        .trim();
      
      const aiReview = JSON.parse(cleanJsonStr) as SonarAIReview;
      
      // Validate the parsed object has required fields
      if (!aiReview.personality || !aiReview.review || !Array.isArray(aiReview.citations) || !Array.isArray(aiReview.diversify)) {
        throw new Error('Missing required fields in AI response');
      }

      return NextResponse.json(aiReview)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', sonarResponse.answer);
      
      return NextResponse.json({
        personality: 'Conservative Investor',
        review: 'Unable to generate AI analysis at this time.',
        citations: [],
        diversify: []
      })
    }
  } catch (err: any) {
    console.error('AI analysis error:', err)
    return NextResponse.json(
      { 
        personality: 'Analysis Failed',
        review: 'AI analysis could not be completed.',
        citations: [],
        diversify: []
      },
      { status: 500 }
    )
  }
} 