import { NextRequest, NextResponse } from 'next/server'
import { askSonar } from '@/lib/sonar'

interface RiskHighlight {
  text: string;
  sources: string[];
}

interface SimilarStock {
  ticker: string;
  reason: string;
  sources: string[];
}

interface StockAnalysis {
  movementExplanation: string | null;
  movementSources: string[];
  riskHighlights: RiskHighlight[];
  similarStocks: SimilarStock[];
}

export async function GET(
  request: NextRequest,
  context: { params: { symbol: string } }
) {
  try {
    const symbol = context.params.symbol;
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    const upperSymbol = symbol.toUpperCase();

    const aiPrompt = `
Analyze ${upperSymbol} stock and provide 3 key risks. For each claim you make, use actual URLs as sources. Format as JSON:
{
  "movementExplanation": "Why did the stock move this week? Explain simply in 3-4 sentences and reference sources like [1], [2]. Don't mention the movement number, price or dates",
  "movementSources": ["https://example.com/source1", "https://example.com/source2"],
  "riskHighlights": [
    {
      "text": "Risk 1 - explain in simple terms, 2 sentences",
      "sources": ["https://example.com/risk1source1", "https://example.com/risk1source2"]
    },
    {
      "text": "Risk 2 - explain in simple terms, 2 sentences",
      "sources": ["https://example.com/risk2source1", "https://example.com/risk2source2"]
    },
    {
      "text": "Risk 3 - explain in simple terms, 2 sentences",
      "sources": ["https://example.com/risk3source1", "https://example.com/risk3source2"]
    }
  ],
  "similarStocks": [
    {
      "ticker": "EXAMPLE1",
      "reason": "Why this stock is similar in under 9 words"
    },
    {
      "ticker": "EXAMPLE2",
      "reason": "Why this stock is similar in under 9 words"
    },
    {
      "ticker": "EXAMPLE3",
      "reason": "Why this stock is similar in under 9 words"
    }
  ]
}`.trim();

    const sonarResponse = await askSonar(aiPrompt);
    
    try {
      const cleanJsonStr = sonarResponse.answer
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '')
        .trim();
      
      const analysis = JSON.parse(cleanJsonStr) as StockAnalysis;
      
      // Add citations from Sonar to the analysis
      if (sonarResponse.citations && sonarResponse.citations.length > 0) {
        // Use citation URLs for movement explanation if not already provided
        if (!analysis.movementSources || analysis.movementSources.length === 0) {
          analysis.movementSources = sonarResponse.citations.slice(0, 2).map(c => c.url);
        }
        
        // Distribute citation URLs to risk highlights
        if (analysis.riskHighlights && analysis.riskHighlights.length > 0) {
          analysis.riskHighlights.forEach((risk: RiskHighlight, index: number) => {
            if (!risk.sources || risk.sources.length === 0) {
              const startIdx = index * 2 % sonarResponse.citations.length;
              risk.sources = [
                sonarResponse.citations[startIdx % sonarResponse.citations.length]?.url,
                sonarResponse.citations[(startIdx + 1) % sonarResponse.citations.length]?.url
              ].filter(Boolean);
            }
          });
        }
      }

      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', sonarResponse.answer);
      
      // Create fallback analysis with citations if available
      const fallbackCitations = sonarResponse.citations || [];
      
      return NextResponse.json({
        movementExplanation: null,
        movementSources: fallbackCitations.slice(0, 2).map(c => c.url),
        riskHighlights: [],
        similarStocks: []
      });
    }
  } catch (error) {
    console.error('Error fetching AI analysis:', error);
    return NextResponse.json(
      { 
        movementExplanation: null,
        movementSources: [],
        riskHighlights: [],
        similarStocks: []
      },
      { status: 500 }
    );
  }
} 