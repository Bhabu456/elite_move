"use client"

import { useState } from "react"
import { Button, Card, Input, Switch, message } from "antd"
import { FiArrowLeft, FiArrowRight, FiPackage, FiShield, FiStar, FiTag, FiCheck, FiTool } from "react-icons/fi"
import { motion } from "framer-motion"

const packagingOptions = [
  {
    id: "standard",
    name: "Standard Packing",
    description: "Basic protection with bubble wrap and cartons",
    price: 0,
    features: ["Bubble wrap", "Standard cartons", "Basic tape"],
    icon: FiPackage,
  },
  {
    id: "premium",
    name: "Premium Packing",
    description: "Enhanced protection for delicate items",
    price: 1500,
    features: ["Multi-layer bubble wrap", "Reinforced cartons", "Corner protectors", "Fragile stickers"],
    icon: FiShield,
    recommended: true,
  },
  {
    id: "luxury",
    name: "Luxury Packing",
    description: "White-glove service with custom crating",
    price: 3500,
    features: ["Custom wooden crates", "Climate protection", "GPS tracking", "Insurance included", "Unpacking service"],
    icon: FiStar,
  },
]

const additionalServices = [
  { id: "ac_install", name: "AC Installation", price: 1500, description: "Professional AC dismount & reinstall" },
  { id: "tv_install", name: "TV Installation", price: 800, description: "Wall mount installation" },
  { id: "geyser_install", name: "Geyser Installation", price: 600, description: "Geyser dismount & reinstall" },
  { id: "dismantling", name: "Furniture Dismantling", price: 1000, description: "Disassemble large furniture" },
  { id: "cleaning", name: "Deep Cleaning", price: 2000, description: "Full house cleaning at new location" },
]

export default function ServicesStep({ data, onUpdate, onNext, onBack }) {
  const [couponCode, setCouponCode] = useState(data.coupon || "")
  const [couponApplied, setCouponApplied] = useState(!!data.coupon)

  const updatePackaging = (packagingId) => {
    onUpdate({ ...data, packaging: packagingId })
  }

  const toggleService = (serviceId) => {
    const current = data.additionalServices || []
    const updated = current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId]
    onUpdate({ ...data, additionalServices: updated })
  }

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "MOVE10") {
      onUpdate({ ...data, coupon: couponCode, discount: 10 })
      setCouponApplied(true)
      message.success("Coupon applied! 10% discount")
    } else if (couponCode.toUpperCase() === "FIRST500") {
      onUpdate({ ...data, coupon: couponCode, discount: 500 })
      setCouponApplied(true)
      message.success("Coupon applied! ₹500 off")
    } else {
      message.error("Invalid coupon code")
    }
  }

  const removeCoupon = () => {
    onUpdate({ ...data, coupon: "", discount: 0 })
    setCouponCode("")
    setCouponApplied(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Packaging Options */}
      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiPackage className="w-5 h-5 text-blue-600" />
          Select Packaging Type
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packagingOptions.map((option) => {
            const Icon = option.icon
            const isSelected = data.packaging === option.id

            return (
              <div
                key={option.id}
                onClick={() => updatePackaging(option.id)}
                className={`
                  relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                  }
                `}
              >
                {option.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h4 className="font-bold text-gray-800 mb-1">{option.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{option.description}</p>

                  <p className="text-xl font-bold text-blue-600 mb-4">
                    {option.price === 0 ? "Included" : `+₹${option.price.toLocaleString()}`}
                  </p>

                  <ul className="space-y-2 text-left w-full">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Additional Services */}
      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiTool className="w-5 h-5 text-blue-600" />
          Additional Services
        </h3>

        <div className="space-y-3">
          {additionalServices.map((service) => {
            const isSelected = (data.additionalServices || []).includes(service.id)

            return (
              <div
                key={service.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl border-2 transition-all
                  ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
                `}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{service.name}</p>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-800">₹{service.price.toLocaleString()}</span>
                  <Switch checked={isSelected} onChange={() => toggleService(service.id)} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Coupon Code */}
      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiTag className="w-5 h-5 text-blue-600" />
          Have a Coupon?
        </h3>

        {couponApplied ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-500 rounded-xl">
            <div className="flex items-center gap-3">
              <FiCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Coupon Applied: {couponCode.toUpperCase()}</p>
                <p className="text-sm text-green-600">
                  {typeof data.discount === "number" && data.discount < 100
                    ? `${data.discount}% discount applied`
                    : `₹${data.discount} discount applied`}
                </p>
              </div>
            </div>
            <Button danger onClick={removeCoupon}>
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Input
              size="large"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button
              type="primary"
              size="large"
              onClick={applyCoupon}
              disabled={!couponCode}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply
            </Button>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2">Try: MOVE10 or FIRST500</p>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button size="large" onClick={onBack} className="h-12 px-6 flex items-center gap-2">
          <FiArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={onNext}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          Review Quote
          <FiArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
