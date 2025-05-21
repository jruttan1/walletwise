# 🚀 WalletWise 🌟

An AI-powered finance coach for new investors. WalletWise.AI helps users understand stock fundamentals, price movements, and potential risks with AI-generated explanations.

## 🔍 Project Overview

WalletWise.AI is designed to make stock analysis accessible and intuitive for new investors by combining clear data visualizations with AI-powered insights. With WalletWise you can:

- 📈 Visualize 30-day price trends at a glance  
- 🤖 Get AI explanations for key price movements  
- 💡 View essential financial metrics in plain English  
- ⚠️ Receive AI-generated risk summaries  
- 🔎 Discover similar stocks based on company fundamentals  

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ with TypeScript and Tailwind CSS  
- **Data Visualization**: Recharts  
- **Financial Data**: yahoo-finance2  
- **AI Analysis**: Perplexity Sonar API  
- **Icons**: Lucide React  

## ✨ Features

- 🚀 **Onboarding Flow**  
    Simple, step-by-step guide for first-time users  
- 🔍 **Stock Selector**  
    Curated list of top companies and ticker search  
- 📊 **Trend Charts**  
    Interactive 30-day price history with hover details  
- 📝 **Movement Explanations**  
    AI-generated natural language breakdown of recent price changes  
- 📋 **Fundamentals Dashboard**  
    Key metrics like market cap, P/E ratio and dividend yield with tooltips  
- ⚖️ **Risk Analysis**  
    AI-driven risk highlights to help spot potential issues  
- 🔗 **Similar Stocks**  
    Recommendations for companies with comparable fundamentals  
- 📱 **Responsive Design**  
    Optimized for desktop, tablet and mobile  

## 🚀 Getting Started

### 🔧 Prerequisites

- [Node.js](https://nodejs.org) v16 or higher  
- npm v8 or higher (bundled with Node.js)  

### 📥 Installation

1. Clone the repository  
    ```bash
    git clone https://github.com/yourusername/walletwise.git
    ```  
2. Change into project directory  
    ```bash
    cd walletwise
    ```  
3. Install dependencies  
    ```bash
    npm install
    ```

### ▶️ Running the App

1. Start the development server  
    ```bash
    npm run dev
    ```  
2. Open your browser and go to  
    ```
    http://localhost:3000
    ```
3. Add your API key
   ```
   copy .env.example into a file called: .env.local and replace the API with your own

## 🎯 Usage

1. Sign up or log in to save your favorite stocks  
2. Browse or search tickers from the top companies list  
3. Click on a stock to view detailed trend charts and AI insights  
4. Explore fundamentals, risk analysis, and similar stock suggestions  
5. Build and track your own portfolio (coming soon)  

## 🔄 Importing Data

#### Single Stock Input  
Use the “Add Stock” form to enter one ticker at a time manually—ideal for quick lookups or adding a single new position.

#### Portfolio CSV Upload  
To get the most out of walletwise, upload a CSV file with your entire portfolio (see format below).

## 🔄 CSV Upload

WalletWise supports importing your portfolio via CSV. Your file must include these columns in order:

- `ticker` (required): Stock symbol (e.g. AAPL)  
- `shares` (required): Number of shares owned (e.g. 10)  
- `cost_basis` (optional): Purchase price per share (e.g. 150.00)  

**Example CSV:**
```csv
ticker,shares,cost_basis
AAPL,10,150.00
MSFT,5
GOOGL,2,2200.50
```

## 🗺️ Roadmap

- **Phase 1 (now)**  
  - Integrate real-time Yahoo Finance API data  
  - Hook up Perplexity Sonar API for AI insights  
- **Phase 2**  
  - User authentication and profile management  
  - Save and load favorite stocks and watchlists  
- **Phase 3**  
  - Portfolio tracking with CSV import/export  
  - Additional chart types and timeframes  
- **Phase 4**  
  - Mobile PWA support  
  - Social sharing of portfolio snapshots  

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feature-name`)  
3. Commit your changes (`git commit -m 'Add new feature'`)  
4. Push to your fork (`git push origin feature-name`)  
5. Open a Pull Request  

Please follow the code of conduct and check existing issues before submitting new ones.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.  
