import { NextRequest, NextResponse } from 'next/server'
import { askSonar } from '@/lib/sonar'

interface Position {
    symbol: string
    shares: number
    currentPrice: number
    previousPrice: number
    dailyPct: number
    value: number
}

interface Overview {
    totalValue: number
    totalGainLoss: number
    totalGainPct: number
    holdingsCount: number
}

interface PortfolioData {
    positions: Position[]
    overview: Overview
}

interface QnARequest {
    question: string
    portfolioData?: PortfolioData
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { question, portfolioData } = body as QnARequest
        
        if (!question || typeof question !== 'string') {
            return NextResponse.json({ error: 'Invalid question' }, { status: 400 })
        }
        
        if (!question.trim()) {
            return NextResponse.json({ error: 'Please ask a question' }, { status: 400 })
        }

        // Build enhanced prompt with comprehensive portfolio context
        const enhancedPrompt = buildEnhancedPrompt(question, portfolioData)
        
        const response = await askSonar(enhancedPrompt)
        return NextResponse.json(response)
    } catch (e) {
        console.error('Error in Sonar API:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

function buildEnhancedPrompt(question: string, portfolioData?: PortfolioData): string {
    // Build comprehensive portfolio context
    let portfolioContext = ''
    
    if (portfolioData && portfolioData.positions.length > 0) {
        const { positions, overview } = portfolioData
        
        const holdingsDetails = positions.map(position => {
            const currentPrice = position.currentPrice || 0
            const gainLoss = currentPrice > 0 ? ((currentPrice - position.previousPrice) / position.previousPrice * 100) : 0
            const gainLossSign = currentPrice >= position.previousPrice ? '+' : ''
            const dailyPct = position.dailyPct || 0
            const dailyPctSign = dailyPct >= 0 ? '+' : ''
            const value = position.value || 0
            
            return `${position.symbol}: ${position.shares || 0} shares, $${value.toLocaleString()} value (${gainLossSign}${gainLoss.toFixed(1)}% vs previous price), ${dailyPctSign}${dailyPct.toFixed(1)}% today`
        }).join('; ')
        
        const totalValue = overview.totalValue || 0
        const totalGainLoss = overview.totalGainLoss || 0
        const totalGainPct = overview.totalGainPct || 0
        const holdingsCount = overview.holdingsCount || 0
        
        const totalGainLossSign = totalGainLoss >= 0 ? '+' : ''
        const totalGainPctSign = totalGainPct >= 0 ? '+' : ''
        
        portfolioContext = `Portfolio Context: 
- Holdings: ${holdingsDetails}
- Portfolio Overview: $${totalValue.toLocaleString()} total value, ${totalGainLossSign}$${Math.abs(totalGainLoss).toLocaleString()} (${totalGainPctSign}${totalGainPct.toFixed(1)}%) total gain/loss, ${holdingsCount} total holdings

`
    }
    
    // Build the complete prompt
    const baseInstruction = 'You are a helpful financial advisor. Answer this question in a clear, educational way for a beginner investor.'
    
    return `${baseInstruction} ${portfolioContext}

Question: ${question}

CRITICAL FORMATTING RULES - FOLLOW EXACTLY:
- NEVER use any markdown formatting whatsoever (no **, __, *, _, ##, etc.)
- Write in plain text only - no special characters for emphasis
- Use simple paragraph breaks for structure
- Do NOT use bullet points, numbered lists, or any special formatting
- Write naturally and conversationally without any text styling
- Do not use any special characters or formatting for emphasis
- Keep responses short and concise, no more than 6 sentences paragraphs

CONTENT GUIDELINES:
- ALWAYS check the portfolio context above first before answering
- If the user asks about buying/investing in a stock they already own, acknowledge their existing position and discuss adding to it rather than treating it as a new investment
- If they ask about a stock not in their portfolio, then discuss it as a potential new addition
- Only provide general educational guidance, not specific investment recommendations
- Do not cite specific statistics, yields, or price targets unless you are absolutely certain they are current and accurate
- Do NOT create numbered citations like [1], [2], [3] - the system will handle citations automatically
- Avoid recommending specific brokers or platforms
- Focus on educational concepts rather than specific actionable advice
- If you're uncertain about current data, acknowledge this limitation
- Keep responses conversational and helpful without overly specific claims
- Use clear, simple language suitable for a beginner investor`
}