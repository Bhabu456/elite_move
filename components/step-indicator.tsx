"use client"

import { Check } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 sm:gap-4 bg-white/10 backdrop-blur-sm rounded-full px-4 py-3 sm:px-6 sm:py-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isClickable = step.id <= currentStep

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={`flex items-center gap-2 sm:gap-3 transition-all ${
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-white text-primary"
                      : isCurrent
                        ? "bg-white text-primary pulse-ring"
                        : "bg-white/20 text-white/70"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
                </div>

                {/* Step Text - Hidden on mobile for non-current */}
                <div className={`hidden sm:block ${!isCurrent && "md:block"}`}>
                  <p className={`text-sm font-semibold ${isCurrent ? "text-white" : "text-white/70"}`}>{step.title}</p>
                  <p className="text-xs text-white/50 hidden md:block">{step.description}</p>
                </div>
              </button>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 md:w-16 h-0.5 mx-2 sm:mx-3 rounded-full transition-all ${
                    currentStep > step.id ? "bg-white" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
