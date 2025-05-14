import yf from 'yahoo-finance2';

export async function fetchStock(symbol: string) {
  const quote = await yf.quoteSummary(symbol, {
    modules: ['price', 'summaryDetail', 'defaultKeyStatistics'],
  });
  
  // Calculate date for 1 month ago
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const chart = await yf.chart(symbol, { 
    period1: oneMonthAgo, 
    period2: now, 
    interval: '1d' 
  });
  
  return { quote, chart };
}