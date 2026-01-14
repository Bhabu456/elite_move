"use client"

import { useState } from "react"
import { MapPin, Calendar, Building2, ArrowUp, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import type { BookingState } from "@/lib/types"

interface LocationStepProps {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  onNext: () => void
}

export function LocationStep({ booking, updateBooking, onNext }: LocationStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!booking.pickupAddress1) newErrors.pickupAddress1 = "Required"
    if (!booking.pickupPincode) newErrors.pickupPincode = "Required"
    if (!booking.pickupCity) newErrors.pickupCity = "Required"
    if (!booking.dropAddress1) newErrors.dropAddress1 = "Required"
    if (!booking.dropPincode) newErrors.dropPincode = "Required"
    if (!booking.dropCity) newErrors.dropCity = "Required"
    if (!booking.moveDate) newErrors.moveDate = "Select a date"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Move Date */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Moving Date</h3>
            <p className="text-sm text-muted-foreground">When do you want to move?</p>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full h-12 justify-start text-left font-normal ${
                errors.moveDate ? "border-destructive" : ""
              }`}
            >
              <Calendar className="mr-3 h-4 w-4 text-muted-foreground" />
              {booking.moveDate ? (
                <span className="text-foreground">{format(booking.moveDate, "PPP")}</span>
              ) : (
                <span className="text-muted-foreground">Select your moving date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={booking.moveDate || undefined}
              onSelect={(date) => updateBooking({ moveDate: date || null })}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.moveDate && <p className="text-sm text-destructive mt-2">{errors.moveDate}</p>}
      </div>

      {/* Pickup Location */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pickup Location</h3>
            <p className="text-sm text-muted-foreground">Where should we pick up from?</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-1.5 block">Address Line 1 *</Label>
            <Input
              placeholder="House/Flat No., Building Name"
              value={booking.pickupAddress1}
              onChange={(e) => updateBooking({ pickupAddress1: e.target.value })}
              className={`h-11 ${errors.pickupAddress1 ? "border-destructive" : ""}`}
            />
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-1.5 block">Address Line 2</Label>
            <Input
              placeholder="Street, Landmark"
              value={booking.pickupAddress2}
              onChange={(e) => updateBooking({ pickupAddress2: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Pincode *</Label>
              <Input
                placeholder="110001"
                value={booking.pickupPincode}
                onChange={(e) => updateBooking({ pickupPincode: e.target.value })}
                className={`h-11 ${errors.pickupPincode ? "border-destructive" : ""}`}
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">City *</Label>
              <Input
                placeholder="City"
                value={booking.pickupCity}
                onChange={(e) => updateBooking({ pickupCity: e.target.value })}
                className={`h-11 ${errors.pickupCity ? "border-destructive" : ""}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">State</Label>
              <Input
                placeholder="State"
                value={booking.pickupState}
                onChange={(e) => updateBooking({ pickupState: e.target.value })}
                className="h-11"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Floor</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Floor No."
                  type="number"
                  value={booking.pickupFloor}
                  onChange={(e) => updateBooking({ pickupFloor: e.target.value })}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-secondary rounded-xl">
            <div className="flex items-center gap-3">
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Lift Available</span>
            </div>
            <Switch
              checked={booking.pickupLift}
              onCheckedChange={(checked) => updateBooking({ pickupLift: checked })}
            />
          </div>
        </div>
      </div>

      {/* Drop Location */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Drop Location</h3>
            <p className="text-sm text-muted-foreground">Where should we deliver?</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-1.5 block">Address Line 1 *</Label>
            <Input
              placeholder="House/Flat No., Building Name"
              value={booking.dropAddress1}
              onChange={(e) => updateBooking({ dropAddress1: e.target.value })}
              className={`h-11 ${errors.dropAddress1 ? "border-destructive" : ""}`}
            />
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-1.5 block">Address Line 2</Label>
            <Input
              placeholder="Street, Landmark"
              value={booking.dropAddress2}
              onChange={(e) => updateBooking({ dropAddress2: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Pincode *</Label>
              <Input
                placeholder="110001"
                value={booking.dropPincode}
                onChange={(e) => updateBooking({ dropPincode: e.target.value })}
                className={`h-11 ${errors.dropPincode ? "border-destructive" : ""}`}
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">City *</Label>
              <Input
                placeholder="City"
                value={booking.dropCity}
                onChange={(e) => updateBooking({ dropCity: e.target.value })}
                className={`h-11 ${errors.dropCity ? "border-destructive" : ""}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">State</Label>
              <Input
                placeholder="State"
                value={booking.dropState}
                onChange={(e) => updateBooking({ dropState: e.target.value })}
                className="h-11"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1.5 block">Floor</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Floor No."
                  type="number"
                  value={booking.dropFloor}
                  onChange={(e) => updateBooking({ dropFloor: e.target.value })}
                  className="h-11 pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-secondary rounded-xl">
            <div className="flex items-center gap-3">
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Lift Available</span>
            </div>
            <Switch checked={booking.dropLift} onCheckedChange={(checked) => updateBooking({ dropLift: checked })} />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <Button onClick={handleNext} className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
        Continue to Select Items
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  )
}
