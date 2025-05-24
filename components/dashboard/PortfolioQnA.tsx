'use client'

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon, RotateCcw, Loader2, HelpCircle, AlertCircle, Lightbulb } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

interface PortfolioQnAProps {
  portfolioData: {
    positions: Position[]
    overview: Overview
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  sources?: Array<{ title: string, url: string }>
}

// Sample questions to help users get started
const SAMPLE_QUESTIONS = [
  "What is dollar-cost averaging?",
  "How can I reduce risk in my portfolio?",
  "Should I invest in individual stocks or ETFs?",
  "What's a good P/E ratio?",
  "How diversified is my portfolio?",
  "What sectors am I missing in my portfolio?",
]

export function PortfolioQnA({ portfolioData }: PortfolioQnAProps) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const handleSendQuestion = async () => {
    if (!question.trim() || isLoading) return
    
    setError('')
    setIsLoading(true)
    
    // Add user message
    const userMessage: Message = { id: generateId(), role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    
    try {
      // Send question with comprehensive portfolio context to backend
      const response = await fetch('/api/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question,
          portfolioData: portfolioData 
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get answer')
      }
      
      const data = await response.json()
      
      // Add assistant message
      const assistantMessage: Message = { 
        id: generateId(),
        role: 'assistant', 
        content: data.answer || 'Sorry, I could not generate an answer at this time.',
        sources: data.citations && data.citations.length > 0 ? data.citations : undefined
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('QnA API error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          id: generateId(),
          role: 'system', 
          content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Something went wrong'}. Please try again.`
        }
      ])
    } finally {
      setIsLoading(false)
      // Focus the input field after sending
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleSampleQuestion = (sampleQuestion: string) => {
    setQuestion(sampleQuestion)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendQuestion()
    }
  }

  const clearChat = () => {
    setMessages([])
    setError('')
  }

  // Get an avatar for message types
  const getAvatar = (role: string) => {
    switch (role) {
      case 'user':
        return 'U'
      case 'assistant':
        return 'AI'
      case 'system':
        return <AlertCircle className="h-4 w-4" />
      default:
        return '?'
    }
  }

  // Get background color for message types
  const getMessageStyle = (role: string) => {
    switch (role) {
      case 'user':
        return 'bg-primary text-primary-foreground'
      case 'assistant':
        return 'bg-muted'
      case 'system':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100'
      default:
        return 'bg-muted'
    }
  }

  const portfolioSummary = portfolioData.positions.length > 0 
    ? `${portfolioData.positions.map(p => p.symbol).join(', ')} (${portfolioData.positions.length} holdings, $${portfolioData.overview.totalValue.toLocaleString()} total value)`
    : 'No portfolio data'

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Financial Advisor
            </CardTitle>
            <CardDescription className="mt-1">
              Ask questions about finance, investments, or your portfolio
            </CardDescription>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearChat} title="Clear chat">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="space-y-8">
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto text-primary/40 mb-4" />
                <p className="text-lg font-medium mb-2">How can I help with your finances?</p>
                <p>Ask me anything about financial concepts, investment strategies, or your portfolio.</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SAMPLE_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSampleQuestion(q)}
                      className="p-3 text-left text-sm rounded-md bg-muted/50 hover:bg-muted transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'} mt-1`}>
                      <Avatar className={message.role === 'system' ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100' : ''}>
                        <AvatarFallback>
                          {getAvatar(message.role)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div 
                        className={`rounded-lg px-4 py-2 ${getMessageStyle(message.role)}`}
                      >
                        {message.content}
                      </div>
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p className="font-semibold">Sources:</p>
                          <ul className="list-disc pl-4 mt-1 space-y-1">
                            {message.sources.map((source, i) => (
                              <li key={i}>
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {source.title || source.url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/10">
        <div className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            placeholder="Ask a financial question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 border-primary/20 focus-visible:ring-primary"
          />
          <Button 
            onClick={handleSendQuestion} 
            disabled={!question.trim() || isLoading}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 