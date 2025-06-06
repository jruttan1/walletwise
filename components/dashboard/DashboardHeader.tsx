import React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"

interface DashboardHeaderProps {
  viewMode: "single" | "portfolio"
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ viewMode }) => (
  <header className="mb-8">
    {viewMode === "single" ? (
      <Link href="/dashboard?mode=portfolio" className="text-primary hover:underline text-sm flex items-center mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Portfolio
      </Link>
    ) : (
      <Link href="/" className="text-primary hover:underline text-sm flex items-center mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back
      </Link>
    )}
    <div className="flex items-center mb-2">
      <Image src="/mini-logo.svg" alt="WalletWise" width={150} height={150} />
    </div>
    <p className="text-muted-foreground">
      Your AI-powered finance coach.
      {viewMode === "portfolio" && " Analyze your entire portfolio at once."}
    </p>
  </header>
) 