"use client"

import { format } from "date-fns"
import {
  CheckCircle2,
  MapPin,
  CalendarDays,
  Phone,
  Mail,
  Download,
  Share2,
  Home,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HOUSE_TYPES, type BookingState } from "@/lib/types"

interface ConfirmationStepProps {
  booking: BookingState
  bookingId: string
  onStartNew: () => void
}

export function ConfirmationStep({ booking, bookingId, onStartNew }: ConfirmationStepProps) {
  const houseType = HOUSE_TYPES.find((h) => h.id === booking.houseType)
  const totalItems = Object.values(booking.selectedItems).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full animate-in fade-in zoom-in-95 duration-500">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-flex">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-6 mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your move has been successfully scheduled</p>
        </div>

        {/* Booking Card */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
          {/* Booking ID Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 p-5 text-white text-center">
            <p className="text-white/70 text-sm mb-1">Booking ID</p>
            <p className="text-2xl font-bold tracking-wider">{bookingId}</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Move Date */}
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moving Date</p>
                <p className="font-bold text-foreground">
                  {booking.moveDate ? format(booking.moveDate, "EEEE, MMMM d, yyyy") : "Not selected"}
                </p>
              </div>
            </div>

            {/* Route */}
            <div className="relative">
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-t-xl border-b-2 border-dashed border-emerald-200">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-emerald-600 font-medium mb-1">PICKUP</p>
                  <p className="font-semibold text-foreground">{booking.pickupAddress1}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.pickupCity}, {booking.pickupState} - {booking.pickupPincode}
                  </p>
                </div>
              </div>

              <div className="absolute left-[39px] top-1/2 transform -translate-y-1/2 z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-rose-50 rounded-b-xl">
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-rose-600 font-medium mb-1">DROP</p>
                  <p className="font-semibold text-foreground">{booking.dropAddress1}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.dropCity}, {booking.dropState} - {booking.dropPincode}
                  </p>
                </div>
              </div>
            </div>

            {/* House Type & Items */}
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Property & Items</p>
                <p className="font-bold text-foreground">
                  {houseType?.name} • {totalItems} items
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl p-5 mb-6">
          <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <p className="text-sm text-muted-foreground">
                Our team will call you within <span className="font-semibold text-foreground">30 minutes</span> to
                confirm details
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <p className="text-sm text-muted-foreground">
                You{"'"}ll receive a confirmation SMS and email with tracking link
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <p className="text-sm text-muted-foreground">
                Our moving crew will arrive at pickup location on scheduled date
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <a
            href="tel:+919876543210"
            className="flex-1 flex items-center justify-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
          >
            <Phone className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">+91 98765 43210</span>
          </a>
          <a
            href="mailto:support@moveeasy.com"
            className="flex-1 flex items-center justify-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">support@moveeasy.com</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" className="flex-1 h-12 bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <Button variant="ghost" onClick={onStartNew} className="w-full mt-4 h-12 text-muted-foreground">
          Book Another Move
        </Button>
      </div>
    </div>
  )
}
