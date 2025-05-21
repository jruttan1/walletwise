'use client'

import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Position {
  symbol: string
  shares: number
  costBasis?: number  // Make cost basis optional
  currentPrice: number
  previousPrice: number
  dailyPct: number
  value: number
}

interface PortfolioGridProps {
  positions: Position[]
}

export function PortfolioGrid({ positions }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {positions.map((position) => (
        <Link
          key={position.symbol}
          href={`/dashboard?mode=single&symbol=${position.symbol}`}
          className="block"
        >
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold">{position.symbol}</h3>
                  <p className="text-sm text-muted-foreground">
                    {position.shares} shares
                  </p>
                </div>
                <div className={`flex items-center ${position.dailyPct >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {position.dailyPct >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(position.dailyPct).toFixed(2)}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <span className="font-medium">${position.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-medium">${position.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cost Basis</span>
                  <span className="font-medium">
                    {position.costBasis ? `$${position.costBasis.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
} 