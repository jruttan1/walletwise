import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface CompanyInfo {
  name: string
  businessSummary: string | null
}

interface TickerDisplayProps {
  ticker: string
  error?: string | null
  companyInfo?: CompanyInfo
  isLoading?: boolean
}

// Function to create a 1-sentence company description
const createCompanyDescription = (businessSummary: string | null, companyName: string, ticker: string): string => {
  if (!businessSummary) {
    return `${companyName} is a publicly traded company.`
  }
  
  // Split by sentences and get meaningful sentences
  const sentences = businessSummary.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  // Find the first meaningful sentence that describes what the company does
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim()
    
    // Skip sentences that are just company names, locations, or too short
    if (sentence.length < 30 || 
        sentence === companyName) {
      continue
    }
    
    // Look for sentences that describe business activities
    if (sentence.includes('design') || 
        sentence.includes('develop') || 
        sentence.includes('manufacture') || 
        sentence.includes('provide') || 
        sentence.includes('offer') || 
        sentence.includes('operate') ||
        sentence.includes('specialize') ||
        sentence.includes('focus') ||
        sentence.includes('engage') ||
        sentence.includes('sells') ||
        sentence.includes('creates') ||
        sentence.includes('produces')) {
      
      // Check if sentence already starts with company name
      if (sentence.toLowerCase().startsWith(companyName.toLowerCase())) {
        return sentence + '.'
      } else {
        return `${companyName} ${sentence.charAt(0).toLowerCase() + sentence.slice(1)}.`
      }
    }
  }
  
  // If no good descriptive sentence found, try to find any sentence with business keywords
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim()
    if (sentence.length > 30 && sentence !== companyName) {
      // Check if sentence already starts with company name
      if (sentence.toLowerCase().startsWith(companyName.toLowerCase())) {
        return sentence + '.'
      } else {
        return `${companyName} ${sentence.charAt(0).toLowerCase() + sentence.slice(1)}.`
      }
    }
  }
  
  return `${companyName} is a publicly traded company.`
}

export const TickerDisplay: React.FC<TickerDisplayProps> = ({ 
  ticker, 
  error, 
  companyInfo, 
  isLoading = false 
}) => {
  const description = companyInfo 
    ? createCompanyDescription(companyInfo.businessSummary, companyInfo.name, ticker)
    : null

  return (
    <div className="mb-8">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold text-foreground">{ticker}</h2>
        {error && <div className="ml-4 text-sm text-destructive">{error}</div>}
      </div>
      
      {/* Company Description */}
      <div className="mt-2">
        {isLoading ? (
          <Skeleton className="h-5 w-3/4" />
        ) : description ? (
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        ) : (
          <p className="text-muted-foreground text-sm">Loading company information...</p>
        )}
      </div>
    </div>
  )
} 