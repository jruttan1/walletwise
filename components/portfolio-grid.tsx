import React from "react"
import StockCardLink from "./StockCardLink"

interface Position {
  symbol: string
  shares: number
  costBasis: number
  name: string
  percentChange: number
  priceData?: any
  fundamentals?: any
}

interface PortfolioGridProps {
  positions: Position[]
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ positions }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {positions.map((position) => (
        <StockCardLink key={position.symbol} pos={position} />
      ))}
    </div>
  )
}

export default PortfolioGrid 