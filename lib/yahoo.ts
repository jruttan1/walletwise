import yf from 'yahoo-finance2'

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
interface HistoricalDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose?: number;
}

export type ChartResult = any 
export type QuoteSummaryResult = Awaited<ReturnType<typeof yf.quoteSummary>>

export async function fetchStock(symbol: string): Promise<{
  quote: QuoteSummaryResult
  chart: ChartResult
}> {
  const ticker = symbol.toUpperCase()
  console.log(`Fetching data for ${ticker} in yahoo.ts`)

  const quote = await yf.quoteSummary(ticker, {
    modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'summaryProfile']
  })
  
  const today = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(today.getDate() - 30)
  
  const todayStr = today.toISOString().split('T')[0]
  const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0]
  
  console.log(`Fetching historical data from ${oneMonthAgoStr} to ${todayStr}`)
  
  try {
    const historicalData = await yf.historical(ticker, {
      period1: oneMonthAgoStr,
      period2: todayStr,
      interval: '1d'
    }) as HistoricalDataPoint[]
    
    console.log(`Got ${historicalData.length} historical data points`)
    
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

export async function fetchChart(
  symbol: string,
  period: number = 1,
  interval: HistoricalIntervalType = '1d'
): Promise<ChartResult> {
  const ticker = symbol.toUpperCase()
  
  const today = new Date()
  const start = new Date()
  start.setMonth(today.getMonth() - period)
  
  const todayStr = today.toISOString().split('T')[0]
  const startStr = start.toISOString().split('T')[0]
  
  const historicalData = await yf.historical(ticker, {
    period1: startStr,
    period2: todayStr,
    interval
  }) as HistoricalDataPoint[]
  
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

export async function fetchChartByDates(
  symbol: string,
  start: Date,
  end: Date,
  interval: HistoricalIntervalType = '1d'
): Promise<ChartResult> {
  const ticker = symbol.toUpperCase()
  
  const today = new Date()
  const safeEnd = end > today ? today : end
  
  const historicalData = await yf.historical(ticker, {
    period1: start,
    period2: safeEnd,
    interval
  }) as HistoricalDataPoint[]
  
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