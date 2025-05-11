import Link from "next/link"
import { Wallet, TrendingUp, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground">WalletWise</span>
          </Link>
        </div>
        <p className="ml-4 hidden text-sm text-muted-foreground md:block">
          Your AI-powered finance coach for new investors
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <TrendingUp className="h-5 w-5" />
            <span className="sr-only">Markets</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
