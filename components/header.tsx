"use client"

import { Truck, Phone, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">MoveElite</span>
              <p className="text-xs text-muted-foreground -mt-0.5">Premium Movers</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Track Order
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Phone className="w-4 h-4" />
              +91 98765 43210
            </a>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="#" className="text-lg font-medium py-2 border-b">
                    Services
                  </a>
                  <a href="#" className="text-lg font-medium py-2 border-b">
                    Pricing
                  </a>
                  <a href="#" className="text-lg font-medium py-2 border-b">
                    Track Order
                  </a>
                  <a href="#" className="text-lg font-medium py-2 border-b">
                    About
                  </a>
                  <a href="tel:+919876543210" className="flex items-center gap-2 text-primary font-medium py-2">
                    <Phone className="w-4 h-4" />
                    +91 98765 43210
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
