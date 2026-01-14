"use client"

import { useState, useRef } from "react"
import { Button, Card, message, Spin } from "antd"
import { FiCamera, FiPlus, FiMinus, FiArrowLeft, FiArrowRight, FiCheck, FiX, FiZap, FiEdit2 } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

const houseTypes = [
  { id: "1bhk", label: "1 BHK", image: "/1bhk-apartment-interior.jpg", baseItems: 15 },
  { id: "2bhk", label: "2 BHK", image: "/2bhk-apartment-interior.jpg", baseItems: 25 },
  { id: "3bhk", label: "3 BHK", image: "/3bhk-apartment-interior.jpg", baseItems: 35 },
  { id: "4bhk", label: "4 BHK+", image: "/4bhk-luxury-apartment.jpg", baseItems: 50 },
]

const itemCategories = [
  {
    id: "furniture",
    label: "Furniture",
    items: [
      { id: "sofa", name: "Sofa (3 Seater)", price: 800, icon: "🛋️" },
      { id: "bed", name: "Bed (Queen)", price: 1000, icon: "🛏️" },
      { id: "wardrobe", name: "Wardrobe", price: 1200, icon: "🚪" },
      { id: "dining", name: "Dining Table", price: 600, icon: "🪑" },
      { id: "study", name: "Study Table", price: 400, icon: "📚" },
      { id: "dressing", name: "Dressing Table", price: 500, icon: "💄" },
    ],
  },
  {
    id: "appliances",
    label: "Appliances",
    items: [
      { id: "fridge", name: "Refrigerator", price: 700, icon: "🧊" },
      { id: "washing", name: "Washing Machine", price: 600, icon: "🧺" },
      { id: "ac", name: "Air Conditioner", price: 800, icon: "❄️" },
      { id: "tv", name: "Television", price: 500, icon: "📺" },
      { id: "microwave", name: "Microwave", price: 300, icon: "🔲" },
      { id: "geyser", name: "Geyser", price: 400, icon: "🚿" },
    ],
  },
  {
    id: "boxes",
    label: "Boxes & Cartons",
    items: [
      { id: "small", name: "Small Box", price: 50, icon: "📦" },
      { id: "medium", name: "Medium Box", price: 80, icon: "📦" },
      { id: "large", name: "Large Box", price: 120, icon: "📦" },
      { id: "wardrobe-box", name: "Wardrobe Box", price: 200, icon: "📦" },
    ],
  },
  {
    id: "special",
    label: "Special Items",
    items: [
      { id: "piano", name: "Piano", price: 2000, icon: "🎹" },
      { id: "gym", name: "Gym Equipment", price: 1500, icon: "🏋️" },
      { id: "plants", name: "Indoor Plants", price: 200, icon: "🪴" },
      { id: "aquarium", name: "Aquarium", price: 800, icon: "🐠" },
    ],
  },
]

export default function ItemsStep({ data, onUpdate, onNext, onBack }) {
  const [activeCategory, setActiveCategory] = useState("furniture")
  const [aiMode, setAiMode] = useState("choice") // 'choice', 'uploading', 'analyzing', 'results'
  const [uploadedImage, setUploadedImage] = useState(null)
  const [detectedItems, setDetectedItems] = useState([])
  const fileInputRef = useRef(null)

  const updateHouseType = (houseType) => {
    onUpdate({ ...data, houseType })
  }

  const updateItemQuantity = (itemId, delta) => {
    const currentItems = data.selectedItems || {}
    const currentQty = currentItems[itemId] || 0
    const newQty = Math.max(0, currentQty + delta)

    if (newQty === 0) {
      const { [itemId]: _, ...rest } = currentItems
      onUpdate({ ...data, selectedItems: rest })
    } else {
      onUpdate({ ...data, selectedItems: { ...currentItems, [itemId]: newQty } })
    }
  }

  const getItemQuantity = (itemId) => {
    return data.selectedItems?.[itemId] || 0
  }

  const getTotalItems = () => {
    return Object.values(data.selectedItems || {}).reduce((sum, qty) => sum + qty, 0)
  }

  // AI Detection Functions
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target.result)
        setAiMode("uploading")
        // Simulate AI processing
        setTimeout(() => {
          setAiMode("analyzing")
          setTimeout(() => {
            // Simulated detected items
            const mockDetected = [
              { id: "sofa", name: "Sofa (3 Seater)", quantity: 1, confidence: 95, price: 800 },
              { id: "tv", name: "Television", quantity: 1, confidence: 92, price: 500 },
              { id: "bed", name: "Bed (Queen)", quantity: 2, confidence: 88, price: 1000 },
              { id: "fridge", name: "Refrigerator", quantity: 1, confidence: 90, price: 700 },
              { id: "ac", name: "Air Conditioner", quantity: 2, confidence: 85, price: 800 },
              { id: "wardrobe", name: "Wardrobe", quantity: 1, confidence: 87, price: 1200 },
            ]
            setDetectedItems(mockDetected)
            setAiMode("results")
          }, 2000)
        }, 1500)
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmDetectedItems = () => {
    const newItems = {}
    detectedItems.forEach((item) => {
      if (item.quantity > 0) {
        newItems[item.id] = item.quantity
      }
    })
    onUpdate({ ...data, selectedItems: { ...data.selectedItems, ...newItems }, aiDetectionUsed: true })
    setAiMode("choice")
    message.success("Items added successfully!")
  }

  const updateDetectedQuantity = (itemId, delta) => {
    setDetectedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)),
    )
  }

  const removeDetectedItem = (itemId) => {
    setDetectedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // AI Choice Screen
  if (aiMode === "choice") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* AI Detection Option */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiZap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Smart Detection</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Upload a photo of your room and our AI will automatically detect all items for you
            </p>

            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            <Button
              type="primary"
              size="large"
              icon={<FiCamera className="w-5 h-5" />}
              onClick={() => fileInputRef.current?.click()}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
            >
              Upload Room Photo
            </Button>
          </div>
        </Card>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Manual Selection */}
        <Card className="shadow-sm border-0">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiEdit2 className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manual Selection</h3>
            <p className="text-gray-600 mb-6">Select your house type and add items manually</p>

            <Button size="large" onClick={() => setAiMode("manual")} className="h-12 px-8">
              Select Items Manually
            </Button>
          </div>
        </Card>

        {/* Back Button */}
        <div className="flex justify-start pt-4">
          <Button size="large" onClick={onBack} className="h-12 px-6 flex items-center gap-2">
            <FiArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </motion.div>
    )
  }

  // AI Uploading/Analyzing Screen
  if (aiMode === "uploading" || aiMode === "analyzing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="relative mb-8">
          {uploadedImage && (
            <img
              src={uploadedImage || "/placeholder.svg"}
              alt="Uploaded"
              className="w-64 h-48 object-cover rounded-xl shadow-lg"
            />
          )}
          <div className="absolute inset-0 bg-blue-600/20 rounded-xl flex items-center justify-center">
            <Spin size="large" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {aiMode === "uploading" ? "Uploading Image..." : "AI is Analyzing Your Room..."}
        </h3>
        <p className="text-gray-600">{aiMode === "analyzing" && "Detecting furniture, appliances, and other items"}</p>
      </motion.div>
    )
  }

  // AI Results Screen
  if (aiMode === "results") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card className="shadow-sm border-0">
          <div className="flex items-center gap-4 mb-6">
            {uploadedImage && (
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="Uploaded"
                className="w-24 h-20 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiCheck className="w-5 h-5 text-green-500" />
                {detectedItems.length} Items Detected
              </h3>
              <p className="text-gray-600 text-sm">Review and adjust quantities below</p>
            </div>
          </div>

          <div className="space-y-3">
            {detectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} each • {item.confidence}% confidence
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
                    <Button
                      size="small"
                      icon={<FiMinus className="w-4 h-4" />}
                      onClick={() => updateDetectedQuantity(item.id, -1)}
                    />
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="small"
                      icon={<FiPlus className="w-4 h-4" />}
                      onClick={() => updateDetectedQuantity(item.id, 1)}
                    />
                  </div>
                  <Button
                    size="small"
                    danger
                    icon={<FiX className="w-4 h-4" />}
                    onClick={() => removeDetectedItem(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-between pt-4">
          <Button
            size="large"
            onClick={() => {
              setAiMode("choice")
              setUploadedImage(null)
              setDetectedItems([])
            }}
            className="h-12 px-6"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={confirmDetectedItems}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
          >
            Confirm Items
            <FiCheck className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    )
  }

  // Manual Selection Screen
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* AI Detection Banner */}
      {!data.aiDetectionUsed && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiZap className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Want it faster?</p>
                <p className="text-sm text-gray-600">Use AI to detect items from photo</p>
              </div>
            </div>
            <Button type="primary" onClick={() => setAiMode("choice")} className="bg-blue-600 hover:bg-blue-700">
              Try AI Detection
            </Button>
          </div>
        </Card>
      )}

      {/* House Type Selection */}
      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select House Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {houseTypes.map((house) => (
            <div
              key={house.id}
              onClick={() => updateHouseType(house.id)}
              className={`
                relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300
                ${
                  data.houseType === house.id
                    ? "border-blue-500 shadow-lg shadow-blue-500/20"
                    : "border-gray-200 hover:border-blue-300"
                }
              `}
            >
              <img src={house.image || "/placeholder.svg"} alt={house.label} className="w-full h-24 object-cover" />
              <div className="p-3 bg-white">
                <p className="font-semibold text-gray-800">{house.label}</p>
                <p className="text-xs text-gray-500">~{house.baseItems} items</p>
              </div>
              {data.houseType === house.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Category Tabs */}
      <Card className="shadow-sm border-0">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {itemCategories.map((cat) => (
            <Button
              key={cat.id}
              type={activeCategory === cat.id ? "primary" : "default"}
              onClick={() => setActiveCategory(cat.id)}
              className={activeCategory === cat.id ? "bg-blue-600" : ""}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {itemCategories
              .find((c) => c.id === activeCategory)
              ?.items.map((item) => {
                const qty = getItemQuantity(item.id)
                return (
                  <div
                    key={item.id}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border-2 transition-all
                      ${qty > 0 ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
                          <Button
                            size="small"
                            icon={<FiMinus className="w-4 h-4" />}
                            onClick={() => updateItemQuantity(item.id, -1)}
                          />
                          <span className="w-8 text-center font-bold text-blue-600">{qty}</span>
                          <Button
                            size="small"
                            icon={<FiPlus className="w-4 h-4" />}
                            onClick={() => updateItemQuantity(item.id, 1)}
                          />
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          icon={<FiPlus className="w-4 h-4" />}
                          onClick={() => updateItemQuantity(item.id, 1)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
          </motion.div>
        </AnimatePresence>
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
          disabled={getTotalItems() === 0}
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          Next: Services
          <FiArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
