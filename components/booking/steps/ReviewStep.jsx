"use client"

import { useState } from "react"
import { Button, Card, Radio, Checkbox, Divider } from "antd"
import {
  FiArrowLeft,
  FiMapPin,
  FiBox,
  FiPackage,
  FiTag,
  FiEdit2,
  FiCreditCard,
  FiCheck,
  FiCalendar,
} from "react-icons/fi"
import { motion } from "framer-motion"
import dayjs from "dayjs"

const itemCategories = [
  {
    id: "furniture",
    items: [
      { id: "sofa", name: "Sofa (3 Seater)", price: 800 },
      { id: "bed", name: "Bed (Queen)", price: 1000 },
      { id: "wardrobe", name: "Wardrobe", price: 1200 },
      { id: "dining", name: "Dining Table", price: 600 },
      { id: "study", name: "Study Table", price: 400 },
      { id: "dressing", name: "Dressing Table", price: 500 },
    ],
  },
  {
    id: "appliances",
    items: [
      { id: "fridge", name: "Refrigerator", price: 700 },
      { id: "washing", name: "Washing Machine", price: 600 },
      { id: "ac", name: "Air Conditioner", price: 800 },
      { id: "tv", name: "Television", price: 500 },
      { id: "microwave", name: "Microwave", price: 300 },
      { id: "geyser", name: "Geyser", price: 400 },
    ],
  },
  {
    id: "boxes",
    items: [
      { id: "small", name: "Small Box", price: 50 },
      { id: "medium", name: "Medium Box", price: 80 },
      { id: "large", name: "Large Box", price: 120 },
      { id: "wardrobe-box", name: "Wardrobe Box", price: 200 },
    ],
  },
  {
    id: "special",
    items: [
      { id: "piano", name: "Piano", price: 2000 },
      { id: "gym", name: "Gym Equipment", price: 1500 },
      { id: "plants", name: "Indoor Plants", price: 200 },
      { id: "aquarium", name: "Aquarium", price: 800 },
    ],
  },
]

const packagingPrices = {
  standard: { name: "Standard Packing", price: 0 },
  premium: { name: "Premium Packing", price: 1500 },
  luxury: { name: "Luxury Packing", price: 3500 },
}

const additionalServicesList = [
  { id: "ac_install", name: "AC Installation", price: 1500 },
  { id: "tv_install", name: "TV Installation", price: 800 },
  { id: "geyser_install", name: "Geyser Installation", price: 600 },
  { id: "dismantling", name: "Furniture Dismantling", price: 1000 },
  { id: "cleaning", name: "Deep Cleaning", price: 2000 },
]

export default function ReviewStep({ data, onBack, onConfirm, goToStep }) {
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Calculate items total
  const getItemDetails = () => {
    const details = []
    const allItems = itemCategories.flatMap((c) => c.items)

    Object.entries(data.items?.selectedItems || {}).forEach(([itemId, qty]) => {
      const item = allItems.find((i) => i.id === itemId)
      if (item && qty > 0) {
        details.push({ ...item, quantity: qty, total: item.price * qty })
      }
    })
    return details
  }

  const itemDetails = getItemDetails()
  const itemsTotal = itemDetails.reduce((sum, item) => sum + item.total, 0)
  const packagingPrice = packagingPrices[data.services?.packaging]?.price || 0

  const servicesTotal = (data.services?.additionalServices || []).reduce((sum, serviceId) => {
    const service = additionalServicesList.find((s) => s.id === serviceId)
    return sum + (service?.price || 0)
  }, 0)

  const subtotal = itemsTotal + packagingPrice + servicesTotal

  let discount = 0
  if (data.services?.discount) {
    if (data.services.discount < 100) {
      discount = Math.round((subtotal * data.services.discount) / 100)
    } else {
      discount = data.services.discount
    }
  }

  const total = subtotal - discount

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Location Summary */}
      <Card className="shadow-sm border-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-blue-600" />
            Location Details
          </h3>
          <Button type="link" icon={<FiEdit2 className="w-4 h-4" />} onClick={() => goToStep(1)}>
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-sm font-medium text-green-600 mb-2">Pickup</p>
            <p className="text-gray-800">{data.location?.pickup?.address1}</p>
            <p className="text-gray-600 text-sm">
              {data.location?.pickup?.city}, {data.location?.pickup?.state} - {data.location?.pickup?.pincode}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Floor: {data.location?.pickup?.floor || "N/A"} | Lift: {data.location?.pickup?.hasLift ? "Yes" : "No"}
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-sm font-medium text-red-600 mb-2">Drop</p>
            <p className="text-gray-800">{data.location?.drop?.address1}</p>
            <p className="text-gray-600 text-sm">
              {data.location?.drop?.city}, {data.location?.drop?.state} - {data.location?.drop?.pincode}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Floor: {data.location?.drop?.floor || "N/A"} | Lift: {data.location?.drop?.hasLift ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-blue-600" />
          <span className="text-gray-800">
            Moving Date:{" "}
            <strong>{data.location?.date ? dayjs(data.location.date).format("DD MMM YYYY") : "Not selected"}</strong>
          </span>
        </div>
      </Card>

      {/* Items Summary */}
      <Card className="shadow-sm border-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiBox className="w-5 h-5 text-blue-600" />
            Items ({itemDetails.length})
          </h3>
          <Button type="link" icon={<FiEdit2 className="w-4 h-4" />} onClick={() => goToStep(2)}>
            Edit
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {itemDetails.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-800">₹{item.total.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between">
          <span className="text-gray-600">Items Subtotal</span>
          <span className="font-bold text-gray-800">₹{itemsTotal.toLocaleString()}</span>
        </div>
      </Card>

      {/* Services Summary */}
      <Card className="shadow-sm border-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiPackage className="w-5 h-5 text-blue-600" />
            Services
          </h3>
          <Button type="link" icon={<FiEdit2 className="w-4 h-4" />} onClick={() => goToStep(3)}>
            Edit
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Packaging</span>
            <span className="text-gray-800">
              {packagingPrices[data.services?.packaging]?.name || "Standard"}
              {packagingPrice > 0 && <span className="font-semibold ml-2">+₹{packagingPrice.toLocaleString()}</span>}
              {packagingPrice === 0 && <span className="text-green-600 ml-2">Included</span>}
            </span>
          </div>

          {(data.services?.additionalServices || []).length > 0 && (
            <>
              <Divider className="my-2" />
              {(data.services?.additionalServices || []).map((serviceId) => {
                const service = additionalServicesList.find((s) => s.id === serviceId)
                return service ? (
                  <div key={serviceId} className="flex justify-between items-center">
                    <span className="text-gray-600">{service.name}</span>
                    <span className="font-semibold text-gray-800">+₹{service.price.toLocaleString()}</span>
                  </div>
                ) : null
              })}
            </>
          )}
        </div>
      </Card>

      {/* Price Breakdown */}
      <Card className="shadow-sm border-0 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Items Total</span>
            <span className="text-gray-800">₹{itemsTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Packaging</span>
            <span className="text-gray-800">₹{packagingPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Additional Services</span>
            <span className="text-gray-800">₹{servicesTotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-2">
                <FiTag className="w-4 h-4" />
                Discount ({data.services?.coupon})
              </span>
              <span>-₹{discount.toLocaleString()}</span>
            </div>
          )}

          <Divider className="my-2" />

          <div className="flex justify-between text-xl font-bold">
            <span className="text-gray-800">Total Amount</span>
            <span className="text-blue-600">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiCreditCard className="w-5 h-5 text-blue-600" />
          Payment Method
        </h3>

        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "online" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onClick={() => setPaymentMethod("online")}
            >
              <Radio value="online" className="w-full">
                <div className="ml-2">
                  <p className="font-medium text-gray-800">Pay Online</p>
                  <p className="text-sm text-gray-500">Cards, UPI, Net Banking</p>
                </div>
              </Radio>
            </div>
            <div
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <Radio value="cod" className="w-full">
                <div className="ml-2">
                  <p className="font-medium text-gray-800">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when service is complete</p>
                </div>
              </Radio>
            </div>
          </div>
        </Radio.Group>
      </Card>

      {/* Terms & Conditions */}
      <Card className="shadow-sm border-0">
        <Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}>
          <span className="text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        </Checkbox>
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
          onClick={() => onConfirm(paymentMethod)}
          disabled={!termsAccepted}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          {paymentMethod === "online" ? "Pay Now" : "Confirm Booking"}
          <FiCheck className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
