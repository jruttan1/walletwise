// lib/yahoo.ts
import yf from 'yahoo-finance2'

type IntervalType = '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo';

export type ChartResult = Awaited<ReturnType<typeof yf.chart>>
export type QuoteSummaryResult = Awaited<ReturnType<typeof yf.quoteSummary>>

/**
 * Fetch fundamentals + 1-month daily history
 */
export async function fetchStock(symbol: string): Promise<{
  quote: QuoteSummaryResult
  chart: any  // Using any temporarily until we can properly type this
}> {
  const ticker = symbol.toUpperCase()
  const quote = await yf.quoteSummary(ticker, {
    modules: ['price', 'summaryDetail', 'defaultKeyStatistics'],
  })
  
  // Calculate date range for 1 month
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 1)
  
  const chart = await yf.chart(ticker, {
    period1: start,
    period2: end,
    interval: '1d' as IntervalType,
  })
  return { quote, chart }
}

/**
 * Fetch only the price chart for any period
 * @param symbol – ticker (e.g. "AAPL")
 * @param period – number of time units to look back
 * @param interval – e.g. "1d", "1wk"
 */
export async function fetchChart(
  symbol: string,
  period: number = 1,
  interval: IntervalType = '1d'
): Promise<ChartResult> {
  const ticker = symbol.toUpperCase()
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - period)
  
  return yf.chart(ticker, { 
    period1: start,
    period2: end,
    interval 
  })
}

/**
 * Fetch chart data between specific dates
 */
export async function fetchChartByDates(
  symbol: string,
  start: Date,
  end: Date,
  interval: IntervalType = '1d'
): Promise<ChartResult> {
  return yf.chart(symbol.toUpperCase(), {
    period1: start,
    period2: end,
    interval,
  })
}