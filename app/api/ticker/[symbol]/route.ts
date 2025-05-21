import { NextRequest, NextResponse } from 'next/server';
import { fetchStock } from '@/lib/yahoo';
import { askSonar } from '@/lib/sonar';

interface PricePoint {
  date: string;
  close: number;
}

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

function generateFallbackData(symbol: string): PricePoint[] {
  console.log(`Generating fallback data for ${symbol}`);
  const pricePoints: PricePoint[] = [];
  
  const seedValue = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const basePrice = 10 + (seedValue % 490);
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);
  
  let currentDate = new Date(startDate);
  let currentPrice = basePrice;
  
  while (currentDate <= endDate) {
    
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) {
  
      const volatility = 0.005 + ((seedValue % 5) / 100);
      
      const change = currentPrice * volatility * (Math.random() * 2 - 1);
      currentPrice = Math.max(1, currentPrice + change);
      
      pricePoints.push({
        date: currentDate.toISOString().split('T')[0],
        close: parseFloat(currentPrice.toFixed(2))
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return pricePoints;
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
    console.log(`Processing request for ${upperSymbol}`);

 
    const { quote, chart } = await fetchStock(upperSymbol);
    
    if (chart && typeof chart === 'object') {
      console.log(`Chart structure received for ${upperSymbol}`);
    }
    
    let formattedPriceHistory: PricePoint[] = [];
    
    try {
      if (chart && chart.result && chart.result.length > 0) {
        const result = chart.result[0];
        
        if (result.timestamp && result.indicators && result.indicators.quote && 
            result.indicators.quote[0] && result.indicators.quote[0].close) {
          
          const timestamps = result.timestamp;
          const closes = result.indicators.quote[0].close;
          
          console.log(`Found ${timestamps.length} timestamps and ${closes.length} price points`);
          
          formattedPriceHistory = timestamps.map((timestamp: number, index: number) => {
            if (index < closes.length && closes[index] !== null && closes[index] !== undefined) {
              return {
                date: new Date(timestamp * 1000).toISOString().split('T')[0],
                close: parseFloat(closes[index].toFixed(2))
              };
            }
            return null;
          }).filter((point: PricePoint | null): point is PricePoint => point !== null);
          
          console.log(`Successfully extracted ${formattedPriceHistory.length} valid price points`);
          
          if (formattedPriceHistory.length > 0) {
            console.log("First point:", formattedPriceHistory[0]);
            console.log("Last point:", formattedPriceHistory[formattedPriceHistory.length - 1]);
          }
        } else {
          console.error("Missing required data structure in chart result");
        }
      } else {
        console.error("No valid chart result found in response");
      }
    } catch (error) {
      console.error("Error extracting price history:", error);
    }

    if (formattedPriceHistory.length === 0) {
      throw new Error("Failed to extract valid price data from Yahoo Finance");
    }

    const fundamentals = {
      marketCap: formatMarketCap(quote?.summaryDetail?.marketCap || 0),
      peRatio: quote?.summaryDetail?.trailingPE?.toFixed(2) || 'N/A',
      revenueTTM: formatCurrency(quote?.financialData?.totalRevenue || 0),
      epsTTM: quote?.defaultKeyStatistics?.trailingEps?.toFixed(2) || 'N/A',
      dividendYield: ((quote?.summaryDetail?.dividendYield || 0) * 100).toFixed(1) + '%'
    };

    const aiPrompt = `
Analyze ${upperSymbol} stock and provide 3 key risks. For each claim you make, use actual URLs as sources. Format as JSON:
{
  "movementExplanation": "Why did the stock move this week? Explain simply in 3-4 sentences and reference sources like [1], [2]. Don't mention the movement number, price or dates",
  "movementSources": ["https://example.com/source1", "https://example.com/source2"],
  "riskHighlights": [
    {
      "text": "Risk 1 - explain in simple terms",
      "sources": ["https://example.com/risk1source1", "https://example.com/risk1source2"]
    },
    {
      "text": "Risk 2 - explain in simple terms",
      "sources": ["https://example.com/risk2source1", "https://example.com/risk2source2"]
    },
    {
      "text": "Risk 3 - explain in simple terms",
      "sources": ["https://example.com/risk3source1", "https://example.com/risk3source2"]
    }
  ],
  "similarStocks": [
    {
      "ticker": "EXAMPLE1",
      "reason": "Why this stock is similar in under 9 words",
    },
    {
      "ticker": "EXAMPLE2",
      "reason": "Why this stock is similar in under 9 words",
    },
    {
      "ticker": "EXAMPLE3",
      "reason": "Why this stock is similar in under 9 words",
    }
  ]
}`.trim();

    const sonarResponse = await askSonar(aiPrompt);
    console.log('Sonar response received:', { 
      hasAnswer: Boolean(sonarResponse.answer),
      answerLength: sonarResponse.answer?.length || 0,
      citationsCount: sonarResponse.citations?.length || 0,
      citationsSample: sonarResponse.citations?.slice(0, 2)
    });
    
    let analysis;
    try {
      const cleanJsonStr = sonarResponse.answer
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '')
        .trim();
      
      console.log('Cleaned JSON string:', cleanJsonStr.substring(0, 200) + '...');
      analysis = JSON.parse(cleanJsonStr);
      console.log('Parsed analysis structure:', {
        hasMovementExplanation: Boolean(analysis.movementExplanation),
        hasMovementSources: Boolean(analysis.movementSources),
        riskHighlightsCount: analysis.riskHighlights?.length || 0,
        similarStocksCount: analysis.similarStocks?.length || 0
      });
      
      // Add citations from Sonar to the analysis
      if (sonarResponse.citations && sonarResponse.citations.length > 0) {
        console.log('Adding Sonar citations to analysis');
        
        // Use citation URLs for movement explanation if not already provided
        if (!analysis.movementSources || analysis.movementSources.length === 0) {
          analysis.movementSources = sonarResponse.citations.slice(0, 2).map(c => c.url);
          console.log('Added movement sources:', analysis.movementSources);
        }
        
        // Distribute citation URLs to risk highlights
        if (analysis.riskHighlights && analysis.riskHighlights.length > 0) {
          analysis.riskHighlights.forEach((risk: RiskHighlight, index: number) => {
            if (!risk.sources || risk.sources.length === 0) {
              // Use citations or generate placeholder URLs
              const startIdx = index * 2 % sonarResponse.citations.length;
              risk.sources = [
                sonarResponse.citations[startIdx % sonarResponse.citations.length]?.url,
                sonarResponse.citations[(startIdx + 1) % sonarResponse.citations.length]?.url
              ].filter(Boolean);
            }
          });
        }
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', sonarResponse.answer);
      
      // Create fallback analysis with citations if available
      const fallbackCitations = sonarResponse.citations || [];
      
      analysis = {
        movementExplanation: null,
        movementSources: fallbackCitations.slice(0, 2).map(c => c.url),
        riskHighlights: [],
        similarStocks: []
      };
    }

    return NextResponse.json({
      priceHistory: formattedPriceHistory,
      fundamentals,
      ...analysis
    });
  } catch (error) {
    console.error('Error fetching ticker data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticker data' },
      { status: 500 }
    );
  }
}

function formatMarketCap(value: number): string {
  if (!value) return 'N/A';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatCurrency(value: number): string {
  if (!value) return 'N/A';
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}