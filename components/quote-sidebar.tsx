"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import { CalendarDays, MapPin, Package, Shield, Wrench, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HOUSE_TYPES, ITEM_CATEGORIES, PACKAGING_OPTIONS, ADDITIONAL_SERVICES, type BookingState } from "@/lib/types"

interface QuoteSidebarProps {
  booking: BookingState
  currentStep: number
}

export function QuoteSidebar({ booking, currentStep }: QuoteSidebarProps) {
  const pricing = useMemo(() => {
    // Base price from house type
    const houseType = HOUSE_TYPES.find((h) => h.id === booking.houseType)
    const basePrice = houseType?.basePrice || 0

    // Items price
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

    // Packaging
    const packagingOption = PACKAGING_OPTIONS.find((p) => p.id === booking.packagingType)
    const packagingMultiplier = packagingOption?.multiplier || 1
    const subtotal = basePrice + itemsPrice
    const packagingFee = subtotal * (packagingMultiplier - 1)

    // Additional services
    let servicesPrice = 0
    for (const serviceId of booking.additionalServices) {
      const service = ADDITIONAL_SERVICES.find((s) => s.id === serviceId)
      if (service) {
        servicesPrice += service.price
      }
    }

    // Total
    const total = subtotal + packagingFee + servicesPrice

    return {
      basePrice,
      itemsPrice,
      itemDetails,
      packagingFee,
      servicesPrice,
      subtotal,
      total,
    }
  }, [booking])

  const totalItems = Object.values(booking.selectedItems).reduce((a, b) => a + b, 0)

  return (
    <div className="sticky top-24">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4">
          <h3 className="text-lg font-bold text-white">Your Quote</h3>
          <p className="text-sm text-white/70">Review your booking details</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Move Date */}
          {booking.moveDate && (
            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Moving Date</p>
                <p className="font-semibold text-foreground">{format(booking.moveDate, "PPP")}</p>
              </div>
            </div>
          )}

          {/* Locations */}
          {(booking.pickupCity || booking.dropCity) && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold text-foreground">
                  {booking.pickupCity || "Pickup"} → {booking.dropCity || "Drop"}
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-border" />

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            {booking.houseType && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {HOUSE_TYPES.find((h) => h.id === booking.houseType)?.name} Base
                </span>
                <span className="font-medium text-foreground">Rs{pricing.basePrice.toLocaleString()}</span>
              </div>
            )}

            {totalItems > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  Items ({totalItems})
                </span>
                <span className="font-medium text-foreground">Rs{pricing.itemsPrice.toLocaleString()}</span>
              </div>
            )}

            {pricing.packagingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  Premium Packaging
                </span>
                <span className="font-medium text-foreground">
                  +Rs{Math.round(pricing.packagingFee).toLocaleString()}
                </span>
              </div>
            )}

            {pricing.servicesPrice > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  Add-on Services
                </span>
                <span className="font-medium text-foreground">+Rs{pricing.servicesPrice.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">Rs{Math.round(pricing.total).toLocaleString()}</span>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            *Final price may vary based on actual inventory and distance
          </p>

          {currentStep === 3 && <Button className="w-full h-12 text-base font-semibold">Proceed to Payment</Button>}
        </div>

        {/* Trust Badges */}
        <div className="bg-secondary/50 px-6 py-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-bold text-foreground">50K+</p>
            <p className="text-xs text-muted-foreground">Happy Moves</p>
          </div>
          <div>
            <p className="font-bold text-foreground">4.9/5</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div>
            <p className="font-bold text-foreground flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              100%
            </p>
            <p className="text-xs text-muted-foreground">Insured</p>
          </div>
        </div>
      </div>
    </div>
  )
}
