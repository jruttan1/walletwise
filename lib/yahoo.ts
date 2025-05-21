// lib/yahoo.ts
import yf from 'yahoo-finance2'

// Limited interval types that work with historical API
type HistoricalIntervalType = '1d' | '1wk' | '1mo';

// Define proper types for the Yahoo Finance chart data
interface ChartQuoteIndicator {
  close: number[];
  open: number[];
  high: number[];
  low: number[];
  volume: number[];
}

interface ChartIndicators {
  quote: ChartQuoteIndicator[];
}

// Define the type for historical data entry
interface HistoricalDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose?: number;
}

export type ChartResult = any // Use any temporarily to avoid type errors
export type QuoteSummaryResult = Awaited<ReturnType<typeof yf.quoteSummary>>

/**
 * Fetch fundamentals + 1-month daily history
 */
export async function fetchStock(symbol: string): Promise<{
  quote: QuoteSummaryResult
  chart: ChartResult
}> {
  const ticker = symbol.toUpperCase()
  console.log(`Fetching data for ${ticker} in yahoo.ts`)

  // Make quotes API call
  const quote = await yf.quoteSummary(ticker, {
    modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData']
  })
  
  // Calculate dates for exactly one month of data (today minus 30 days)
  const today = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(today.getDate() - 30)
  
  const todayStr = today.toISOString().split('T')[0]
  const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0]
  
  console.log(`Fetching historical data from ${oneMonthAgoStr} to ${todayStr}`)
  
  try {
    // Use historical data which maps to chart API internally
    const historicalData = await yf.historical(ticker, {
      period1: oneMonthAgoStr,
      period2: todayStr,
      interval: '1d'
    }) as HistoricalDataPoint[]
    
    console.log(`Got ${historicalData.length} historical data points`)
    
    // Convert historical data to chart format for frontend compatibility
    const chartResult = {
      result: [{
        timestamp: historicalData.map((d: HistoricalDataPoint) => Math.floor(d.date.getTime() / 1000)),
        indicators: {
          quote: [{
            close: historicalData.map((d: HistoricalDataPoint) => d.close),
            open: historicalData.map((d: HistoricalDataPoint) => d.open),
            high: historicalData.map((d: HistoricalDataPoint) => d.high),
            low: historicalData.map((d: HistoricalDataPoint) => d.low),
            volume: historicalData.map((d: HistoricalDataPoint) => d.volume)
          }]
        }
      }]
    }
    
    return { quote, chart: chartResult }
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error)
    throw new Error(`Failed to fetch stock data for ${ticker}`)
  }
}

/**
 * Fetch only the price chart for any period
 * @param symbol – ticker (e.g. "AAPL")
 * @param period – number of months to look back
 * @param interval – e.g. "1d", "1wk", "1mo"
 */
export async function fetchChart(
  symbol: string,
  period: number = 1,
  interval: HistoricalIntervalType = '1d'
): Promise<ChartResult> {
  const ticker = symbol.toUpperCase()
  
  // Calculate dates based on period
  const today = new Date()
  const start = new Date()
  start.setMonth(today.getMonth() - period)
  
  const todayStr = today.toISOString().split('T')[0]
  const startStr = start.toISOString().split('T')[0]
  
  // Get historical data
  const historicalData = await yf.historical(ticker, {
    period1: startStr,
    period2: todayStr,
    interval
  }) as HistoricalDataPoint[]
  
  // Convert to chart format
  return {
    result: [{
      timestamp: historicalData.map((d: HistoricalDataPoint) => Math.floor(d.date.getTime() / 1000)),
      indicators: {
        quote: [{
          close: historicalData.map((d: HistoricalDataPoint) => d.close),
          open: historicalData.map((d: HistoricalDataPoint) => d.open),
          high: historicalData.map((d: HistoricalDataPoint) => d.high),
          low: historicalData.map((d: HistoricalDataPoint) => d.low),
          volume: historicalData.map((d: HistoricalDataPoint) => d.volume)
        }]
      }
    }]
  }
}

/**
 * Fetch chart data between specific dates
 */
export async function fetchChartByDates(
  symbol: string,
  start: Date,
  end: Date,
  interval: HistoricalIntervalType = '1d'
): Promise<ChartResult> {
  const ticker = symbol.toUpperCase()
  
  // Ensure end date is not in the future
  const today = new Date()
  const safeEnd = end > today ? today : end
  
  // Get historical data
  const historicalData = await yf.historical(ticker, {
    period1: start,
    period2: safeEnd,
    interval
  }) as HistoricalDataPoint[]
  
  // Convert to chart format
  return {
    result: [{
      timestamp: historicalData.map((d: HistoricalDataPoint) => Math.floor(d.date.getTime() / 1000)),
      indicators: {
        quote: [{
          close: historicalData.map((d: HistoricalDataPoint) => d.close),
          open: historicalData.map((d: HistoricalDataPoint) => d.open),
          high: historicalData.map((d: HistoricalDataPoint) => d.high),
          low: historicalData.map((d: HistoricalDataPoint) => d.low),
          volume: historicalData.map((d: HistoricalDataPoint) => d.volume)
        }]
      }
    }]
  }
}