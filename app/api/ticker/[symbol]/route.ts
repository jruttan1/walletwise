import { NextRequest, NextResponse } from 'next/server';
import { fetchStock } from '@/lib/yahoo';
import { askSonar } from '@/lib/sonar';

interface PricePoint {
  date: string;
  close: number;
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
Analyze ${upperSymbol} stock and provide 3 key risks. Format as JSON:
{
  "movementExplanation": "Why did the stock move today? Explain simply.",
  "riskHighlights": [
    {
      "text": "Risk 1 - explain in simple terms"
    },
    {
      "text": "Risk 2 - explain in simple terms"
    },
    {
      "text": "Risk 3 - explain in simple terms"
    }
  ],
  "similarStocks": [
    {
      "ticker": "EXAMPLE",
      "reason": "Why this stock is similar"
    }
  ]
}`.trim();

    const sonarResponse = await askSonar(aiPrompt);
    let analysis;
    try {
      const cleanJsonStr = sonarResponse.answer
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '')
        .trim();
      
      analysis = JSON.parse(cleanJsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', sonarResponse.answer);
      
      analysis = {
        movementExplanation: null,
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