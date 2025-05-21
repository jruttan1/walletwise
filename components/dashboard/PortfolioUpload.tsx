'use client'
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Upload, FileText, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PortfolioUploadProps {
  onPortfolioLoaded: (data: {
    positions: Array<{
      symbol: string
      shares: number
      costBasis: number
      currentPrice: number
      previousPrice: number
      dailyPct: number
      value: number
    }>
    overview: {
      totalValue: number
      totalCost: number
      totalGainLoss: number
      totalGainPct: number
      holdingsCount: number
    }
    allocation: Array<{ symbol: string; pct: number; value: number }>
    topPerformers: Array<{ symbol: string; dailyPct: number }>
    aiReview: { personality: string; review: string; diversify: string[] }
  }) => void
}

export const PortfolioUpload: React.FC<PortfolioUploadProps> = ({ onPortfolioLoaded }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'error' | 'success'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files?.[0] && handleFile(e.target.files[0])
  }

  const handleFile = async (file: File) => {
    console.log('[PortfolioUpload] handleFile', file)
    // … validation …
  
    setUploadState('uploading')
    setErrorMessage(null)
  
    try {
      const text = await file.text()
      // Split into lines, trim, drop empty and header
      const lines = text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.toLowerCase().startsWith('symbol'))
  
      if (lines.length === 0) {
        throw new Error('CSV has no data rows.')
      }
  
      // Auto-correct each row: split, remove empty, take first 3 columns
      const positions = lines.map(line => {
        const cells = line
          .split(',')
          .map(c => c.trim())
          .filter(c => c !== '')
        
        const [symbol = '', shares = '0', cost = '0'] = cells
        return {
          symbol: symbol.toUpperCase(),
          shares: Number(shares),
          costBasis: Number(cost),
        }
      }).filter(p => p.symbol && !isNaN(p.shares))
  
      console.log('[upload] cleaned positions:', positions)
  
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positions }),
      })
  
      if (res.status === 422) {
        const err = await res.json()
        throw new Error(`Invalid tickers: ${err.invalid.join(', ')}`)
      }
      if (!res.ok) throw new Error(`Server error: ${res.statusText}`)
  
      const data = await res.json()
      setUploadState('success')
      setTimeout(() => onPortfolioLoaded(data), 500)
  
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message)
      setUploadState('error')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`
            border-2 border-dashed rounded-lg p-10 text-center
            ${dragActive ? "border-primary bg-primary/5" : "border-border"}
            ${uploadState === 'error' ? "border-destructive/50 bg-destructive/5" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploadState === 'idle' && (
            <>
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Drag and drop your CSV</h3>
              <p className="text-muted-foreground mb-4">Or click to browse files</p>
              <label className="cursor-pointer">
                <input type="file" accept=".csv" className="hidden" onChange={handleChange} />
                <Button variant="outline" type="button">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse files
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-6">
                CSV columns: ticker, shares, cost basis
              </p>
            </>
          )}

          {uploadState === 'uploading' && (
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Analyzing your portfolio…</h3>
              <p className="text-muted-foreground">This should only take a second.</p>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload failed</h3>
              <p className="text-muted-foreground mb-4">{errorMessage}</p>
              <Button onClick={() => setUploadState('idle')} variant="outline">
                Try again
              </Button>
            </div>
          )}

          {uploadState === 'success' && (
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-medium mb-2">Success!</h3>
              <p className="text-muted-foreground">Loading your dashboard… Please be patient, the AI is working its magic!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}