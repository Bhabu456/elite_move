"use client"

import { useMemo, useState } from "react"
import { ChevronUp, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { HOUSE_TYPES, ITEM_CATEGORIES, PACKAGING_OPTIONS, ADDITIONAL_SERVICES, type BookingState } from "@/lib/types"

interface MobileQuoteBarProps {
  booking: BookingState
}

export function MobileQuoteBar({ booking }: MobileQuoteBarProps) {
  const [open, setOpen] = useState(false)

  const pricing = useMemo(() => {
    const houseType = HOUSE_TYPES.find((h) => h.id === booking.houseType)
    const basePrice = houseType?.basePrice || 0

    let itemsPrice = 0
    const itemDetails: { name: string; count: number; price: number }[] = []

    for (const [itemId, count] of Object.entries(booking.selectedItems)) {
      for (const category of ITEM_CATEGORIES) {
        const item = category.items.find((i) => i.id === itemId)
        if (item && count > 0) {
          const price = item.basePrice * count
          itemsPrice += price
          itemDetails.push({ name: item.name, count, price })
        }
      }
    }

    const packagingOption = PACKAGING_OPTIONS.find((p) => p.id === booking.packagingType)
    const packagingMultiplier = packagingOption?.multiplier || 1
    const subtotal = basePrice + itemsPrice
    const packagingFee = subtotal * (packagingMultiplier - 1)

    let servicesPrice = 0
    for (const serviceId of booking.additionalServices) {
      const service = ADDITIONAL_SERVICES.find((s) => s.id === serviceId)
      if (service) {
        servicesPrice += service.price
      }
    }

    const total = subtotal + packagingFee + servicesPrice

    return { basePrice, itemsPrice, itemDetails, packagingFee, servicesPrice, total }
  }, [booking])

  const totalItems = Object.values(booking.selectedItems).reduce((a, b) => a + b, 0)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-pb z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className="flex items-center justify-between px-4 py-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Total</p>
                <p className="text-xl font-bold text-foreground">Rs{Math.round(pricing.total).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">View Details</span>
              <ChevronUp className={`w-5 h-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </div>
          </div>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Quote Breakdown</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 overflow-auto pb-24">
            {booking.houseType && (
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">
                  {HOUSE_TYPES.find((h) => h.id === booking.houseType)?.name} Base
                </span>
                <span className="font-semibold">Rs{pricing.basePrice.toLocaleString()}</span>
              </div>
            )}

            {pricing.itemDetails.length > 0 && (
              <div className="py-3 border-b">
                <p className="font-medium mb-2">Selected Items ({totalItems})</p>
                {pricing.itemDetails.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm py-1">
                    <span className="text-muted-foreground">
                      {item.name} x {item.count}
                    </span>
                    <span>Rs{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {pricing.packagingFee > 0 && (
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">Premium Packaging</span>
                <span className="font-semibold">+Rs{Math.round(pricing.packagingFee).toLocaleString()}</span>
              </div>
            )}

            {pricing.servicesPrice > 0 && (
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">Add-on Services</span>
                <span className="font-semibold">+Rs{pricing.servicesPrice.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">Rs{Math.round(pricing.total).toLocaleString()}</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t">
            <Button className="w-full h-12 text-base font-semibold">Proceed to Payment</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
