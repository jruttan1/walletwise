"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Wallet, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const router = useRouter()
  const [ticker, setTicker] = useState("")

  const navigateToSingleStock = () => {
    if (!ticker) return
    router.push(`/dashboard?mode=single&symbol=${ticker.toUpperCase().trim()}`)
  }

  const navigateToPortfolio = () => {
    router.push(`/dashboard?mode=portfolio`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo.svg"
            alt="WalletWise"
            className="w-[400px] h-auto block"
          />
          <p className="text-xl max-w-2xl text-foreground py-4 mt-2">
            Your AI-powered finance coach for new investors. Understand stocks, track performance, and make informed
            decisions.
          </p>

          <div className="bg-card rounded-xl shadow-md p-8 mb-10 max-w-3xl w-full">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">How it works</h2>
            <ul className="space-y-8">
              {[
                {
                  title: "Upload your portfolio",
                  desc: "Drag in a simple CSV and turn your portfolio into an AI financial classroom.",
                },
                {
                  title: "Explore personalized insights",
                  desc: "Access key financial metrics, price trends, and AI-powered analysis.",
                },
                {
                  title: "Grow your investing IQ",
                  desc: "Learn the factors affecting your money, get personalized lessons and suggestions tailored to your holdings",
                },
              ].map((step, idx) => (
                <li key={idx}>
                  <div className="bg-muted/40 rounded-lg p-6 shadow-sm hover:bg-muted/60 transition">
                    <h3 className="font-semibold text-card-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-3xl space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="ticker-input" className="text-left text-sm font-medium text-foreground">
                Enter a stock ticker symbol
              </label>
              <input
                id="ticker-input"
                type="text"
                placeholder="AAPL"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-4 py-3 text-card-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigateToSingleStock()
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                onClick={navigateToSingleStock}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-medium flex items-center justify-center"
                disabled={!ticker.trim()}
              >
                Analyze stock
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={navigateToPortfolio}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-medium flex items-center justify-center"
              >
                Analyze my portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="w-full max-w-3xl mt-6 space-y-4">
            <p className="text-muted-foreground">
              This is not financial advice. This is an educational tool to help you understand investing. Insights are AI-generated and may not be accurate nor used for financial decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}