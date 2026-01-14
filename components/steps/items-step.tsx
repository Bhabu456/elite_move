"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Home,
  Package,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  Upload,
  Sparkles,
  Edit3,
  X,
  Loader2,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HOUSE_TYPES, ITEM_CATEGORIES, type BookingState, type HouseType } from "@/lib/types"

interface ItemsStepProps {
  booking: BookingState
  updateBooking: (updates: Partial<BookingState>) => void
  onNext: () => void
  onBack: () => void
}

type InputMode = "select" | "ai" | "manual"

// Simulated AI detection results based on common room items
const simulateAIDetection = (): Record<string, number> => {
  // Simulate a delay and return "detected" items
  const detectedItems: Record<string, number> = {
    bed_double: 1,
    wardrobe: 1,
    sofa_3seater: 1,
    center_table: 1,
    tv_55: 1,
    fridge_double: 1,
    washing_machine: 1,
    ac_split: 1,
    microwave: 1,
    medium_carton: 5,
    small_carton: 3,
  }
  return detectedItems
}

export function ItemsStep({ booking, updateBooking, onNext, onBack }: ItemsStepProps) {
  const [activeCategory, setActiveCategory] = useState(ITEM_CATEGORIES[0].id)
  const [inputMode, setInputMode] = useState<InputMode>("select")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [detectedItems, setDetectedItems] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateItemCount = (itemId: string, delta: number) => {
    const currentCount = booking.selectedItems[itemId] || 0
    const newCount = Math.max(0, currentCount + delta)

    const newItems = { ...booking.selectedItems }
    if (newCount === 0) {
      delete newItems[itemId]
    } else {
      newItems[itemId] = newCount
    }

    updateBooking({ selectedItems: newItems })
  }

  const setItemCount = (itemId: string, count: number) => {
    const newItems = { ...booking.selectedItems }
    if (count <= 0) {
      delete newItems[itemId]
    } else {
      newItems[itemId] = count
    }
    updateBooking({ selectedItems: newItems })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyzeImage = async () => {
    setIsAnalyzing(true)
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2500))
    const detected = simulateAIDetection()
    setDetectedItems(detected)
    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  const confirmDetectedItems = () => {
    // Merge detected items with existing selections
    const merged = { ...booking.selectedItems }
    Object.entries(detectedItems).forEach(([id, count]) => {
      merged[id] = (merged[id] || 0) + count
    })
    updateBooking({ selectedItems: merged, aiDetectedItems: detectedItems })
    setInputMode("manual")
  }

  const updateDetectedItemCount = (itemId: string, delta: number) => {
    const currentCount = detectedItems[itemId] || 0
    const newCount = Math.max(0, currentCount + delta)
    const newItems = { ...detectedItems }
    if (newCount === 0) {
      delete newItems[itemId]
    } else {
      newItems[itemId] = newCount
    }
    setDetectedItems(newItems)
  }

  const resetAIMode = () => {
    setUploadedImage(null)
    setAnalysisComplete(false)
    setDetectedItems({})
    setInputMode("select")
  }

  const activeItems = ITEM_CATEGORIES.find((c) => c.id === activeCategory)?.items || []
  const totalItems = Object.values(booking.selectedItems).reduce((a, b) => a + b, 0)
  const totalDetectedItems = Object.values(detectedItems).reduce((a, b) => a + b, 0)

  // Get item name by ID
  const getItemName = (itemId: string): string => {
    for (const category of ITEM_CATEGORIES) {
      const item = category.items.find((i) => i.id === itemId)
      if (item) return item.name
    }
    return itemId
  }

  const getItemPrice = (itemId: string): number => {
    for (const category of ITEM_CATEGORIES) {
      const item = category.items.find((i) => i.id === itemId)
      if (item) return item.basePrice
    }
    return 0
  }

  // Mode Selection Screen
  if (inputMode === "select") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        {/* House Type Selection - Always show first */}
        <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Select House Type</h3>
              <p className="text-sm text-muted-foreground">Choose your current home size</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HOUSE_TYPES.map((house) => {
              const isSelected = booking.houseType === house.id
              return (
                <button
                  key={house.id}
                  onClick={() => updateBooking({ houseType: house.id as HouseType })}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <p className="font-bold text-lg text-foreground">{house.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{house.rooms}</p>
                  <p className="text-sm font-semibold text-primary mt-2">From Rs{house.basePrice.toLocaleString()}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Choose Input Method */}
        <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">How would you like to add items?</h3>
              <p className="text-sm text-muted-foreground">Choose the easiest method for you</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {/* AI Detection Option - Changed to blue theme */}
            <button
              onClick={() => setInputMode("ai")}
              className="group relative overflow-hidden p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">AI Smart Detect</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a photo of your room and let AI identify all items automatically
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <Camera className="w-4 h-4" />
                  <span>Quick & Easy</span>
                </div>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-1 bg-primary text-white text-xs font-semibold rounded-full">Recommended</span>
              </div>
            </button>

            {/* Manual Selection Option */}
            <button
              onClick={() => setInputMode("manual")}
              className="group relative overflow-hidden p-6 rounded-2xl border-2 border-border bg-secondary/30 hover:border-primary/30 hover:bg-secondary/50 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Edit3 className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">Manual Selection</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Browse categories and select items one by one with full control
                </p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <Package className="w-4 h-4" />
                  <span>Full Control</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="h-12 px-6 bg-transparent">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          <Button
            onClick={() => setInputMode("manual")}
            disabled={!booking.houseType}
            className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  // AI Upload & Analysis Screen
  if (inputMode === "ai") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-card rounded-2xl border border-border overflow-hidden card-hover">
          {/* Header - Changed to primary color */}
          <div className="bg-primary p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">AI Item Detection</h3>
                  <p className="text-sm text-white/80">Upload your room photo for instant detection</p>
                </div>
              </div>
              <button
                onClick={resetAIMode}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {!uploadedImage ? (
              // Upload Area - Changed to primary blue theme
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-primary/30 rounded-2xl p-8 sm:p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Upload Room Photo</h4>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Take a clear photo of your room showing all items you want to move
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    JPG, PNG supported
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Max 10MB
                  </span>
                </div>
              </div>
            ) : !analysisComplete ? (
              // Image Preview & Analyze
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-secondary/30">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded room"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center mb-3 animate-pulse">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <p className="text-white font-semibold">Analyzing your room...</p>
                        <p className="text-white/70 text-sm">AI is detecting items</p>
                      </div>
                    </div>
                  )}
                  {!isAnalyzing && (
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {!isAnalyzing && (
                  <Button
                    onClick={handleAnalyzeImage}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-semibold"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Detect Items with AI
                  </Button>
                )}
              </div>
            ) : (
              // Detection Results
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Detection Complete!</p>
                      <p className="text-sm text-green-600">{totalDetectedItems} items detected</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAnalysisComplete(false)
                      setUploadedImage(null)
                    }}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Re-scan
                  </button>
                </div>

                {/* Detected Items List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {Object.entries(detectedItems).map(([itemId, count]) => (
                    <div key={itemId} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{getItemName(itemId)}</p>
                        <p className="text-sm text-muted-foreground">Rs{getItemPrice(itemId)}/pc</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateDetectedItemCount(itemId, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold">{count}</span>
                        <button
                          onClick={() => updateDetectedItemCount(itemId, 1)}
                          className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  You can adjust quantities above, then confirm to add these items
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetAIMode} className="h-12 px-6 bg-transparent">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </Button>
          {analysisComplete ? (
            <Button
              onClick={confirmDetectedItems}
              className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90"
            >
              <Check className="w-5 h-5 mr-2" />
              Confirm {totalDetectedItems} Items
            </Button>
          ) : (
            <Button
              onClick={() => setInputMode("manual")}
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
            >
              Skip to Manual Selection
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Manual Selection Screen
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* AI Detection Banner - Show if user hasn't used AI yet */}
      {Object.keys(booking.aiDetectedItems || {}).length === 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Try AI Smart Detect</p>
                <p className="text-xs text-muted-foreground">Upload a photo to auto-detect items</p>
              </div>
            </div>
            <Button
              onClick={() => setInputMode("ai")}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white shrink-0"
            >
              <Camera className="w-4 h-4 mr-1" />
              Try AI
            </Button>
          </div>
        </div>
      )}

      {/* House Type Selection */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Home className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Select House Type</h3>
            <p className="text-sm text-muted-foreground">Choose your current home size</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HOUSE_TYPES.map((house) => {
            const isSelected = booking.houseType === house.id
            return (
              <button
                key={house.id}
                onClick={() => updateBooking({ houseType: house.id as HouseType })}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-secondary/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <p className="font-bold text-lg text-foreground">{house.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{house.rooms}</p>
                <p className="text-sm font-semibold text-primary mt-2">From Rs{house.basePrice.toLocaleString()}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Tabs & Items */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Select Items</h3>
            <p className="text-sm text-muted-foreground">Add items you want to move</p>
          </div>
          {totalItems > 0 && (
            <div className="ml-auto px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">{totalItems} items</span>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {ITEM_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id
            const categoryItemCount = category.items.reduce(
              (sum, item) => sum + (booking.selectedItems[item.id] || 0),
              0,
            )

            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-secondary/50 text-foreground hover:bg-secondary"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
                {categoryItemCount > 0 && (
                  <span
                    className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      isActive ? "bg-white text-primary" : "bg-primary text-white"
                    }`}
                  >
                    {categoryItemCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeItems.map((item) => {
            const count = booking.selectedItems[item.id] || 0
            const isSelected = count > 0

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Rs{item.basePrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {count > 0 ? (
                    <>
                      <button
                        onClick={() => updateItemCount(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-foreground">{count}</span>
                      <button
                        onClick={() => updateItemCount(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => updateItemCount(item.id, 1)}
                      className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-all"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setInputMode("select")} className="h-12 px-6 bg-transparent">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={totalItems === 0}
          className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
