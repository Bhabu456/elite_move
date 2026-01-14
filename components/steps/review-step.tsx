"use client"

import { useMemo } from "react"
import { format } from "date-fns"
import {
  MapPin,
  Home,
  Package,
  Shield,
  Wrench,
  Tag,
  ChevronLeft,
  Pencil,
  CheckCircle2,
  Truck,
  Sparkles,
  CreditCard,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { HOUSE_TYPES, ITEM_CATEGORIES, PACKAGING_OPTIONS, ADDITIONAL_SERVICES, type BookingState } from "@/lib/types"

interface ReviewStepProps {
  booking: BookingState
  onBack: () => void
  onConfirm: () => void
  onEditStep: (step: number) => void
}

export function ReviewStep({ booking, onBack, onConfirm, onEditStep }: ReviewStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online")

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
    const serviceDetails: { name: string; price: number }[] = []
    for (const serviceId of booking.additionalServices) {
      const service = ADDITIONAL_SERVICES.find((s) => s.id === serviceId)
      if (service) {
        servicesPrice += service.price
        serviceDetails.push({ name: service.name, price: service.price })
      }
    }

    const discount = booking.couponCode ? Math.round(subtotal * 0.1) : 0
    const total = subtotal + packagingFee + servicesPrice - discount

    return {
      basePrice,
      itemsPrice,
      itemDetails,
      packagingFee,
      packagingName: packagingOption?.name || "Standard",
      servicesPrice,
      serviceDetails,
      discount,
      subtotal,
      total,
    }
  }, [booking])

  const totalItems = Object.values(booking.selectedItems).reduce((a, b) => a + b, 0)
  const houseType = HOUSE_TYPES.find((h) => h.id === booking.houseType)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Almost Done!
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Your Quote</h2>
        <p className="text-muted-foreground mt-1">Please review your items and shifting details</p>
      </div>

      {/* Move Summary Card */}
      <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Shifting Date</p>
              <p className="font-bold text-lg">{booking.moveDate ? format(booking.moveDate, "PPP") : "Not selected"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditStep(1)}
            className="text-white hover:bg-white/20 self-start sm:self-auto"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span className="text-white/70 text-sm">Pickup Location</span>
            </div>
            <p className="font-semibold">{booking.pickupAddress1 || "Address not provided"}</p>
            <p className="text-sm text-white/70">
              {booking.pickupCity}, {booking.pickupState} - {booking.pickupPincode}
            </p>
            <p className="text-xs text-white/60 mt-1">
              Floor: {booking.pickupFloor || "Ground"} | Lift: {booking.pickupLift ? "Available" : "Not Available"}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-rose-300" />
              <span className="text-white/70 text-sm">Drop Location</span>
            </div>
            <p className="font-semibold">{booking.dropAddress1 || "Address not provided"}</p>
            <p className="text-sm text-white/70">
              {booking.dropCity}, {booking.dropState} - {booking.dropPincode}
            </p>
            <p className="text-xs text-white/60 mt-1">
              Floor: {booking.dropFloor || "Ground"} | Lift: {booking.dropLift ? "Available" : "Not Available"}
            </p>
          </div>
        </div>
      </div>

      {/* Items Summary */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Items & Inventory</h3>
              <p className="text-sm text-muted-foreground">
                {houseType?.name} • {totalItems} items selected
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>

        <div className="p-5">
          {/* House Type */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">{houseType?.name || "Not selected"} Base Price</span>
            </div>
            <span className="font-semibold text-foreground">Rs{pricing.basePrice.toLocaleString()}</span>
          </div>

          {/* Item Details */}
          {pricing.itemDetails.length > 0 && (
            <div className="py-3 border-b border-border">
              <p className="text-sm text-muted-foreground mb-2">Selected Items:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pricing.itemDetails.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">
                      {item.name} <span className="text-muted-foreground">x{item.count}</span>
                    </span>
                    <span className="font-medium text-foreground">Rs{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-2 border-t border-dashed border-border">
                <span className="text-muted-foreground">Items Subtotal</span>
                <span className="font-semibold text-foreground">Rs{pricing.itemsPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Summary */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Shifting Details</h3>
              <p className="text-sm text-muted-foreground">Packaging & additional services</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(3)}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>

        <div className="p-5 space-y-3">
          {/* Packaging */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {booking.packagingType === "premium" ? (
                <Sparkles className="w-5 h-5 text-amber-500" />
              ) : (
                <Shield className="w-5 h-5 text-primary" />
              )}
              <span className="text-foreground">{pricing.packagingName}</span>
            </div>
            <span className="font-semibold text-foreground">
              {pricing.packagingFee > 0 ? `+Rs${Math.round(pricing.packagingFee).toLocaleString()}` : "Included"}
            </span>
          </div>

          {/* Additional Services */}
          {pricing.serviceDetails.length > 0 ? (
            pricing.serviceDetails.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <span className="text-foreground">{service.name}</span>
                <span className="font-semibold text-foreground">Rs{service.price.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-2">No additional services selected</p>
          )}

          {/* Coupon */}
          {booking.couponCode && (
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-rose-500" />
                <span className="text-foreground">Coupon ({booking.couponCode})</span>
              </div>
              <span className="font-semibold text-emerald-600">-Rs{pricing.discount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Total Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/70">Subtotal</span>
          <span className="font-medium">Rs{pricing.subtotal.toLocaleString()}</span>
        </div>
        {pricing.packagingFee > 0 && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70">Packaging Fee</span>
            <span className="font-medium">+Rs{Math.round(pricing.packagingFee).toLocaleString()}</span>
          </div>
        )}
        {pricing.servicesPrice > 0 && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70">Add-on Services</span>
            <span className="font-medium">+Rs{pricing.servicesPrice.toLocaleString()}</span>
          </div>
        )}
        {pricing.discount > 0 && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-400">Discount Applied</span>
            <span className="font-medium text-emerald-400">-Rs{pricing.discount.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-white/20 pt-4 flex items-center justify-between">
          <span className="text-lg font-semibold">Total Amount</span>
          <span className="text-3xl font-bold">Rs{Math.round(pricing.total).toLocaleString()}</span>
        </div>
        <p className="text-xs text-white/50 mt-2">*Final price may vary based on actual inventory</p>
      </div>

      {/* Payment Method */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4">Select Payment Method</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod("online")}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === "online" ? "bg-primary text-white" : "bg-secondary text-foreground"
              }`}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Pay Online</p>
              <p className="text-xs text-muted-foreground">Cards, UPI, Net Banking</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod("cash")}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === "cash" ? "bg-primary text-white" : "bg-secondary text-foreground"
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Pay Later</p>
              <p className="text-xs text-muted-foreground">Cash on Delivery</p>
            </div>
          </button>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
          termsAccepted ? "border-primary/30 bg-primary/5" : "border-border"
        }`}
        onClick={() => setTermsAccepted(!termsAccepted)}
      >
        <Checkbox
          checked={termsAccepted}
          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our <span className="text-primary hover:underline">Terms & Conditions</span> and{" "}
          <span className="text-primary hover:underline">Privacy Policy</span>
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="h-14 px-6 bg-transparent">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!termsAccepted}
          className="flex-1 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          {paymentMethod === "online" ? "Pay Now" : "Confirm Booking"}
        </Button>
      </div>
    </div>
  )
}
