import React from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StockCardLinkProps {
  pos: {
    symbol: string
    name: string
    percentChange: number
  }
}

const StockCardLink: React.FC<StockCardLinkProps> = ({ pos }) => {
  const isPositive = pos.percentChange >= 0

  return (
    <Link href={`/dashboard?mode=single&symbol=${pos.symbol}`}>
      <div className="bg-card rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] cursor-pointer border border-border h-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{pos.symbol}</h3>
            <p className="text-sm text-muted-foreground mt-1">{pos.name}</p>
          </div>
          <div className={`flex items-center justify-center px-2.5 py-1 rounded-full text-sm font-medium ${
            isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}>
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {pos.percentChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default StockCardLink 