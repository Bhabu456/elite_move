"use client"

import { useState } from "react"
import { Button, Drawer, Divider } from "antd"
import { FiChevronUp, FiBox, FiPackage, FiTool, FiTag } from "react-icons/fi"

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

const packagingPrices = { standard: 0, premium: 1500, luxury: 3500 }

const additionalServicesList = [
  { id: "ac_install", price: 1500 },
  { id: "tv_install", price: 800 },
  { id: "geyser_install", price: 600 },
  { id: "dismantling", price: 1000 },
  { id: "cleaning", price: 2000 },
]

export default function MobileQuoteBar({ data }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const allItems = itemCategories.flatMap((c) => c.items)

  const itemsTotal = Object.entries(data.items?.selectedItems || {}).reduce((sum, [itemId, qty]) => {
    const item = allItems.find((i) => i.id === itemId)
    return sum + (item?.price || 0) * qty
  }, 0)

  const totalItems = Object.values(data.items?.selectedItems || {}).reduce((sum, qty) => sum + qty, 0)
  const packagingPrice = packagingPrices[data.services?.packaging] || 0

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
    <>
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{totalItems} items</p>
            <p className="text-xl font-bold text-blue-600">₹{total.toLocaleString()}</p>
          </div>
          <Button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2">
            View Details
            <FiChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        title="Quote Breakdown"
        placement="bottom"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        height="auto"
        className="rounded-t-xl"
      >
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-gray-600">
              <FiBox className="w-4 h-4" /> Items ({totalItems})
            </span>
            <span className="font-medium">₹{itemsTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-gray-600">
              <FiPackage className="w-4 h-4" /> Packaging
            </span>
            <span className="font-medium">
              {packagingPrice === 0 ? "Included" : `₹${packagingPrice.toLocaleString()}`}
            </span>
          </div>

          {servicesTotal > 0 && (
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-gray-600">
                <FiTool className="w-4 h-4" /> Services
              </span>
              <span className="font-medium">₹{servicesTotal.toLocaleString()}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-2">
                <FiTag className="w-4 h-4" /> Discount
              </span>
              <span className="font-medium">-₹{discount.toLocaleString()}</span>
            </div>
          )}

          <Divider className="my-2" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-blue-600">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </Drawer>
    </>
  )
}
