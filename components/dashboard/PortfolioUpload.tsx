import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Upload, FileText, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PortfolioUploadProps {
  onPortfolioLoaded: () => void
}

export const PortfolioUpload: React.FC<PortfolioUploadProps> = ({ onPortfolioLoaded }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'error' | 'success'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is CSV
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setUploadState('error')
      setErrorMessage("Please upload a CSV file.")
      return
    }

    setUploadState('uploading')
    
    // Simulate file upload processing
    setTimeout(() => {
      setUploadState('processing')
      
      // Simulate API call to /api/portfolio/insights
      fetchPortfolioInsights()
    }, 1500)
  }

  const fetchPortfolioInsights = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/portfolio/insights', {
      //   method: 'POST',
      //   body: formData, // CSV file data
      // })
      // if (!response.ok) throw new Error('Failed to process portfolio')
      // const positions = await response.json()

      // Simulate API response delay
      setTimeout(() => {
        setUploadState('success')
        
        // Notify parent that portfolio is loaded after a small delay
        setTimeout(() => {
          onPortfolioLoaded()
        }, 1000)
      }, 1500)
    } catch (error) {
      console.error('Error processing portfolio:', error)
      setUploadState('error')
      setErrorMessage("Failed to analyze your portfolio. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-border"
          } ${uploadState === 'error' ? "border-destructive/50 bg-destructive/5" : ""}`}
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
              <h3 className="text-lg font-medium mb-2">Drag and drop your portfolio CSV</h3>
              <p className="text-muted-foreground mb-4">
                Or click to browse your files
              </p>
              <div className="flex justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <Button variant="outline" type="button">
                    <FileText className="mr-2 h-4 w-4" />
                    Browse files
                  </Button>
                </label>
              </div>
              <p className="text-xs text-muted-foreground mt-6">
                Your file should include columns for ticker, shares, and cost basis.
              </p>
            </>
          )}

          {uploadState === 'uploading' && (
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Uploading your portfolio...</h3>
              <p className="text-muted-foreground">This will just take a moment.</p>
            </div>
          )}

          {uploadState === 'processing' && (
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Analyzing your portfolio...</h3>
              <p className="text-muted-foreground">Our AI is processing your investments.</p>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload failed</h3>
              <p className="text-muted-foreground mb-4">{errorMessage || "There was an error processing your file."}</p>
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
              <h3 className="text-lg font-medium mb-2">Portfolio uploaded!</h3>
              <p className="text-muted-foreground">Preparing your analysis...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 