"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StepIndicator } from "@/components/step-indicator"
import { LocationStep } from "@/components/steps/location-step"
import { ItemsStep } from "@/components/steps/items-step"
import { ServicesStep } from "@/components/steps/services-step"
import { ReviewStep } from "@/components/steps/review-step"
import { ConfirmationStep } from "@/components/steps/confirmation-step"
import { QuoteSidebar } from "@/components/quote-sidebar"
import { MobileQuoteBar } from "@/components/mobile-quote-bar"
import type { BookingState } from "@/lib/types"

const STEPS = [
  { id: 1, title: "Location", description: "Pickup & Drop" },
  { id: 2, title: "Items", description: "Select Items" },
  { id: 3, title: "Services", description: "Add-ons" },
  { id: 4, title: "Review", description: "Your Quote" },
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isBooked, setIsBooked] = useState(false)
  const [bookingId, setBookingId] = useState("")
  const [booking, setBooking] = useState<BookingState>({
    // Location
    pickupAddress1: "",
    pickupAddress2: "",
    pickupPincode: "",
    pickupCity: "",
    pickupState: "",
    pickupFloor: "",
    pickupLift: false,
    dropAddress1: "",
    dropAddress2: "",
    dropPincode: "",
    dropCity: "",
    dropState: "",
    dropFloor: "",
    dropLift: false,
    moveDate: null,
    // Items
    houseType: null,
    selectedItems: {},
    // Services
    packagingType: "standard",
    additionalServices: [],
    couponCode: "",
    aiDetectedItems: {},
  })

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }))
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4 && !isBooked) {
      setCurrentStep(step)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleConfirmBooking = () => {
    const id = "PM" + Date.now().toString().slice(-8)
    setBookingId(id)
    setIsBooked(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleStartNew = () => {
    setIsBooked(false)
    setCurrentStep(1)
    setBookingId("")
    setBooking({
      pickupAddress1: "",
      pickupAddress2: "",
      pickupPincode: "",
      pickupCity: "",
      pickupState: "",
      pickupFloor: "",
      pickupLift: false,
      dropAddress1: "",
      dropAddress2: "",
      dropPincode: "",
      dropCity: "",
      dropState: "",
      dropFloor: "",
      dropLift: false,
      moveDate: null,
      houseType: null,
      selectedItems: {},
      aiDetectedItems: {},
      packagingType: "standard",
      additionalServices: [],
      couponCode: "",
    })
  }

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ConfirmationStep booking={booking} bookingId={bookingId} onStartNew={handleStartNew} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="hero-gradient py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 text-balance">Book Your Move in Minutes</h1>
            <p className="text-white/80 text-sm lg:text-base">Get instant quotes and hassle-free relocation</p>
          </div>
          <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={goToStep} />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="flex-1 min-w-0">
            {currentStep === 1 && (
              <LocationStep booking={booking} updateBooking={updateBooking} onNext={() => goToStep(2)} />
            )}
            {currentStep === 2 && (
              <ItemsStep
                booking={booking}
                updateBooking={updateBooking}
                onNext={() => goToStep(3)}
                onBack={() => goToStep(1)}
              />
            )}
            {currentStep === 3 && (
              <ServicesStep
                booking={booking}
                updateBooking={updateBooking}
                onNext={() => goToStep(4)}
                onBack={() => goToStep(2)}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep
                booking={booking}
                onBack={() => goToStep(3)}
                onConfirm={handleConfirmBooking}
                onEditStep={goToStep}
              />
            )}
          </div>

          {/* Quote Sidebar - Desktop (hide on review step) */}
          {currentStep < 4 && (
            <div className="hidden lg:block w-[380px] flex-shrink-0">
              <QuoteSidebar booking={booking} currentStep={currentStep} />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Quote Bar (hide on review step) */}
      {currentStep < 4 && <MobileQuoteBar booking={booking} />}
    </div>
  )
}
