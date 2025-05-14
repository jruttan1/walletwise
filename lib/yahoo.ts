import yf from 'yahoo-finance2';

export async function fetchStock(symbol: string) {
  // grab current quote + 1-month candles
  const quote = await yf.quoteSummary(symbol, { modules: ['price'] });
  const chart = await yf.chart(symbol, { period1: '1mo', interval: '1d' });
  return { quote, chart };
}