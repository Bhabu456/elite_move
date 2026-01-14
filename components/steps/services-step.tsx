"use client"

import { useState } from "react"
import { Package, Wrench, Tag, ChevronLeft, ChevronRight, Shield, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  PACKAGING_OPTIONS,
  ADDITIONAL_SERVICES,
  type BookingState,
  type PackagingType,
  type AdditionalService,
} from "@/lib/types"

interface ServicesStepProps {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  onNext: () => void
  onBack: () => void
}

export function ServicesStep({ booking, updateBooking, onNext, onBack }: ServicesStepProps) {
  const [couponApplied, setCouponApplied] = useState(false)

  const toggleService = (serviceId: AdditionalService) => {
    const current = booking.additionalServices
    const newServices = current.includes(serviceId) ? current.filter((s) => s !== serviceId) : [...current, serviceId]
    updateBooking({ additionalServices: newServices })
  }

  const applyCoupon = () => {
    if (booking.couponCode.trim()) {
      setCouponApplied(true)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Packaging Options */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Add Packaging Type</h3>
            <p className="text-sm text-muted-foreground">Choose protection level for your items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PACKAGING_OPTIONS.map((option) => {
            const isSelected = booking.packagingType === option.id
            const isPremium = option.id === "premium"

            return (
              <button
                key={option.id}
                onClick={() => updateBooking({ packagingType: option.id as PackagingType })}
                className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? isPremium
                      ? "border-amber-400 bg-amber-50"
                      : "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                {isSelected && (
                  <div
                    className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                      isPremium ? "bg-amber-500" : "bg-primary"
                    }`}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {isPremium ? (
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Shield className="w-5 h-5 text-primary" />
                  )}
                  <span className={`font-bold ${isPremium ? "text-amber-700" : "text-foreground"}`}>{option.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                {option.multiplier > 1 && (
                  <p className="text-xs text-amber-600 font-medium mt-2">
                    +{Math.round((option.multiplier - 1) * 100)}% of base price
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Other Services</h3>
            <p className="text-sm text-muted-foreground">Optional add-on services</p>
          </div>
        </div>

        <div className="space-y-3">
          {ADDITIONAL_SERVICES.map((service) => {
            const isSelected = booking.additionalServices.includes(service.id)
            return (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <span className="font-semibold text-primary">Rs{service.price}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Coupon Code */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Have a Coupon?</h3>
            <p className="text-sm text-muted-foreground">Apply discount code</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Enter coupon code"
            value={booking.couponCode}
            onChange={(e) => {
              updateBooking({ couponCode: e.target.value.toUpperCase() })
              setCouponApplied(false)
            }}
            className="h-11 uppercase"
          />
          <Button onClick={applyCoupon} variant={couponApplied ? "outline" : "default"} className="h-11 px-6">
            {couponApplied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Applied
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      </div>

      {/* Navigation - Updated to go to review step */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="h-12 px-6 bg-transparent">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button onClick={onNext} className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90">
          Review Quote
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
