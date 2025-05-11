# WalletWise.AI

An AI-powered finance coach for new investors. WalletWise.AI helps users understand stock fundamentals, price movements, and potential risks with AI-generated explanations.

## Project Overview

WalletWise.AI is designed to make stock analysis accessible to new investors by providing:

- Clear visualization of stock price trends
- AI-powered explanations of price movements
- Key financial metrics in an easy-to-understand format
- Risk analysis to help investors make informed decisions
- Similar stock recommendations based on AI reasoning

## Tech Stack

- **Frontend**: Next.js 13+ with TypeScript and Tailwind CSS
- **Data Visualization**: Recharts
- **Financial Data**: yahoo-finance2
- **AI Analysis**: Perplexity Sonar API
- **Icons**: Lucide React

## Local Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Route Contract

The `/api/ticker/[symbol]` endpoint returns the following JSON structure:

\`\`\`json
{
  "priceHistory": [
    { "date": "2023-01-01T00:00:00.000Z", "close": 150.25 }
    // ... 30 days of price data
  ],
  "fundamentals": {
    "marketCap": "$2.8T",
    "peRatio": "32.4",
    "revenueTTM": "$394.3B",
    "epsTTM": "$6.14",
    "dividendYield": "0.5%"
  },
  "movementExplanation": null,  // Will be populated by Sonar API
  "riskHighlights": [],         // Will be populated by Sonar API
  "similarStocks": []           // Will be populated by Sonar API
}
\`\`\`

## Features

- **Onboarding Experience**: Simple introduction to the app's features
- **Stock Selection**: Choose from a curated list of top companies
- **Price Trend Visualization**: Interactive chart showing 30-day price history
- **Movement Explanation**: AI-powered analysis of price changes
- **Fundamentals Display**: Key financial metrics with explanations
- **Risk Analysis**: AI-generated risk highlights for informed decisions
- **Similar Stocks**: Recommendations for similar investment opportunities
- **Responsive Design**: Works on desktop and mobile devices

## Next Steps

1. **Integrate Yahoo Finance API**: Replace mock data with real financial data
2. **Implement Sonar API**: Add AI-powered insights for:
   - Price movement explanations
   - Risk analysis
   - Similar stock recommendations
3. **Add User Authentication**: Allow users to create accounts and save favorite stocks
4. **Enhance Visualization**: Add more chart types and timeframes
5. **Implement Portfolio Tracking**: Allow users to create and track portfolios
6. **Enable CSV Upload**: Implement CSV parsing for portfolio analysis

## License

MIT
# WalletWise.AI
# walletwise
# walletwise
