"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Wallet, ArrowRight, Brain, TrendingUp, MessageCircle, Shield, Zap, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

  const features= [
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: 'Smart Portfolio Insights',
      description: 'Upload your holdings to get custom allocation tips, risk metrics, and rebalancing suggestions'
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: 'AI Finance Coach',
      description: 'Ask any question about investing, market concepts, or your portfolio in plain English'
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: 'Deep Analytics Engine',
      description: 'Analyze stock moves, spot risk factors, and uncover market trends with AI-driven insights'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: 'Live Market Feed',
      description: 'Stream real-time price charts, and fundamentals for every ticker'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* Logo and Hero */}
          <img
            src="/logo.svg"
            alt="WalletWise"
            className="w-[400px] h-auto block mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 max-w-4xl">
            Invest smarter with AI
          </h1>
          <p className="text-xl max-w-3xl text-muted-foreground mb-12 leading-relaxed">
            Upload your portfolio and get personalized AI insights, diversification tips, and risk analysis. 
            Plus, analyze individual stocks and chat with your AI finance coach, all backed by reliable sources.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-12">
            {features.map((feature, idx) => (
              <Card key={idx} className="text-left">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How it Works */}
          <Card className="mb-12 max-w-4xl w-full">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8 text-center text-foreground">How WalletWise Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    title: "Upload your portfolio",
                    desc: "Simply upload a CSV file with your holdings (ticker & shares) to get comprehensive portfolio analysis.",
                    icon: <BarChart3 className="h-5 w-5" />
                  },
                  {
                    step: "2", 
                    title: "Get AI insights",
                    desc: "View portfolio overview, diversification analysis, risk highlights, and personalized investment recommendations.",
                    icon: <Brain className="h-5 w-5" />
                  },
                  {
                    step: "3",
                    title: "Learn and improve",
                    desc: "Chat with your AI finance coach, explore individual stocks, and discover new investment opportunities.",
                    icon: <MessageCircle className="h-5 w-5" />
                  },
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-lg mb-4">
                      {step.step}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {step.icon}
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="w-full max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Get Started</h2>
            
            {/* Primary CTA - Portfolio */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <p className="text-muted-foreground text-sm mb-4">
                Upload a CSV file with your holdings to get comprehensive AI analysis, diversification tips, and personalized recommendations.
              </p>
              <Button
                onClick={navigateToPortfolio}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg font-medium flex items-center justify-center h-12"
              >
                Upload & Analyze My Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Secondary CTA - Single Stock */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">Or analyze a single stock:</p>
              <div className="flex flex-col space-y-3">
                <input
                  id="ticker-input"
                  type="text"
                  placeholder="Enter ticker (AAPL, TSLA, NVDA...)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-4 py-2 text-card-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary text-center"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigateToSingleStock()
                  }}
                />
                <Button
                  onClick={navigateToSingleStock}
                  variant="outline"
                  className="w-full text-base font-medium flex items-center justify-center h-10"
                  disabled={!ticker.trim()}
                >
                  Analyze Single Stock
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-8">
              <Shield className="h-4 w-4" />
              <p>
                Educational tool only • Not financial advice • AI-generated insights may vary
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}