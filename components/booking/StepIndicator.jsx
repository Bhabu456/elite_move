import { FiMapPin, FiBox, FiSettings, FiFileText, FiCheck } from "react-icons/fi"

const steps = [
  { id: 1, label: "Location", icon: FiMapPin },
  { id: 2, label: "Items", icon: FiBox },
  { id: 3, label: "Services", icon: FiSettings },
  { id: 4, label: "Review", icon: FiFileText },
]

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-6 px-4 overflow-x-auto">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = currentStep === step.id
        const isCompleted = currentStep > step.id

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 transform
                  ${
                    isCompleted
                      ? "bg-green-500 text-white scale-100"
                      : isActive
                        ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30"
                        : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                {isCompleted ? <FiCheck className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`
                  mt-2 text-xs md:text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"}
                `}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                  w-8 md:w-16 lg:w-24 h-1 mx-2 md:mx-4 rounded-full transition-colors duration-300
                  ${currentStep > step.id ? "bg-green-500" : "bg-gray-200"}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
