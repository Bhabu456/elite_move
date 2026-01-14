import { Card, Divider } from "antd"
import { FiBox, FiPackage, FiTool, FiTag, FiShield } from "react-icons/fi"

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
  standard: 0,
  premium: 1500,
  luxury: 3500,
}

const additionalServicesList = [
  { id: "ac_install", name: "AC Installation", price: 1500 },
  { id: "tv_install", name: "TV Installation", price: 800 },
  { id: "geyser_install", name: "Geyser Installation", price: 600 },
  { id: "dismantling", name: "Furniture Dismantling", price: 1000 },
  { id: "cleaning", name: "Deep Cleaning", price: 2000 },
]

export default function QuoteSidebar({ data }) {
  const allItems = itemCategories.flatMap((c) => c.items)

  // Calculate items total
  const itemsTotal = Object.entries(data.items?.selectedItems || {}).reduce((sum, [itemId, qty]) => {
    const item = allItems.find((i) => i.id === itemId)
    return sum + (item?.price || 0) * qty
  }, 0)

  const totalItems = Object.values(data.items?.selectedItems || {}).reduce((sum, qty) => sum + qty, 0)

  // Packaging price
  const packagingPrice = packagingPrices[data.services?.packaging] || 0

  // Additional services total
  const servicesTotal = (data.services?.additionalServices || []).reduce((sum, serviceId) => {
    const service = additionalServicesList.find((s) => s.id === serviceId)
    return sum + (service?.price || 0)
  }, 0)

  const subtotal = itemsTotal + packagingPrice + servicesTotal

  // Discount
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
    <Card className="shadow-lg border-0 sticky top-24">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Your Quote</h3>

      {/* Items */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-600">
          <FiBox className="w-4 h-4" />
          <span>Items ({totalItems})</span>
        </div>
        <span className="font-medium text-gray-800">₹{itemsTotal.toLocaleString()}</span>
      </div>

      {/* Packaging */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-600">
          <FiPackage className="w-4 h-4" />
          <span>Packaging</span>
        </div>
        <span className="font-medium text-gray-800">
          {packagingPrice === 0 ? "Included" : `₹${packagingPrice.toLocaleString()}`}
        </span>
      </div>

      {/* Services */}
      {servicesTotal > 0 && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-gray-600">
            <FiTool className="w-4 h-4" />
            <span>Services</span>
          </div>
          <span className="font-medium text-gray-800">₹{servicesTotal.toLocaleString()}</span>
        </div>
      )}

      {/* Discount */}
      {discount > 0 && (
        <div className="flex items-center justify-between mb-2 text-green-600">
          <div className="flex items-center gap-2">
            <FiTag className="w-4 h-4" />
            <span>Discount</span>
          </div>
          <span className="font-medium">-₹{discount.toLocaleString()}</span>
        </div>
      )}

      <Divider className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between text-xl font-bold">
        <span className="text-gray-800">Total</span>
        <span className="text-blue-600">₹{total.toLocaleString()}</span>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-4 border-t space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiShield className="w-4 h-4 text-green-500" />
          <span>100% Safe & Insured</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiShield className="w-4 h-4 text-green-500" />
          <span>Professional Team</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiShield className="w-4 h-4 text-green-500" />
          <span>No Hidden Charges</span>
        </div>
      </div>
    </Card>
  )
}
