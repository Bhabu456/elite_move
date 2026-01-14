export type HouseType = "1bhk" | "2bhk" | "3bhk" | "4bhk+"

export type PackagingType = "standard" | "premium"

export type AdditionalService =
  | "ac_installation"
  | "dismantling"
  | "geyser_installation"
  | "tv_installation"
  | "refrigerator"
  | "furniture_assembly"

export interface BookingState {
  // Location
  pickupAddress1: string
  pickupAddress2: string
  pickupPincode: string
  pickupCity: string
  pickupState: string
  pickupFloor: string
  pickupLift: boolean
  dropAddress1: string
  dropAddress2: string
  dropPincode: string
  dropCity: string
  dropState: string
  dropFloor: string
  dropLift: boolean
  moveDate: Date | null
  // Items
  houseType: HouseType | null
  selectedItems: Record<string, number>
  aiDetectedItems: Record<string, number>
  // Services
  packagingType: PackagingType
  additionalServices: AdditionalService[]
  couponCode: string
}

export const HOUSE_TYPES: {
  id: HouseType
  name: string
  rooms: string
  basePrice: number
}[] = [
  { id: "1bhk", name: "1 BHK", rooms: "1 Room + Kitchen", basePrice: 3500 },
  { id: "2bhk", name: "2 BHK", rooms: "2 Rooms + Kitchen", basePrice: 5500 },
  { id: "3bhk", name: "3 BHK", rooms: "3 Rooms + Kitchen", basePrice: 7500 },
  { id: "4bhk+", name: "4 BHK+", rooms: "4+ Rooms", basePrice: 12000 },
]

export interface ItemCategory {
  id: string
  name: string
  items: Item[]
}

export interface Item {
  id: string
  name: string
  basePrice: number
  unit: string
}

export const ITEM_CATEGORIES: ItemCategory[] = [
  {
    id: "furniture",
    name: "Furniture",
    items: [
      { id: "sofa_2seater", name: "Sofa (2-Seater)", basePrice: 400, unit: "pc" },
      { id: "sofa_3seater", name: "Sofa (3-Seater)", basePrice: 600, unit: "pc" },
      { id: "bed_single", name: "Single Bed", basePrice: 350, unit: "pc" },
      { id: "bed_double", name: "Double Bed", basePrice: 500, unit: "pc" },
      { id: "wardrobe", name: "Wardrobe", basePrice: 700, unit: "pc" },
      { id: "dining_4", name: "Dining Table (4-seater)", basePrice: 400, unit: "pc" },
      { id: "dining_6", name: "Dining Table (6-seater)", basePrice: 550, unit: "pc" },
      { id: "study_table", name: "Study Table", basePrice: 250, unit: "pc" },
      { id: "dressing_table", name: "Dressing Table", basePrice: 300, unit: "pc" },
      { id: "center_table", name: "Center Table", basePrice: 200, unit: "pc" },
    ],
  },
  {
    id: "appliances",
    name: "Large Appliances",
    items: [
      { id: "fridge_single", name: "Refrigerator (Single Door)", basePrice: 400, unit: "pc" },
      { id: "fridge_double", name: "Refrigerator (Double Door)", basePrice: 600, unit: "pc" },
      { id: "washing_machine", name: "Washing Machine", basePrice: 450, unit: "pc" },
      { id: "ac_split", name: "AC (Split)", basePrice: 800, unit: "pc" },
      { id: "ac_window", name: "AC (Window)", basePrice: 500, unit: "pc" },
      { id: "tv_32", name: 'TV (Up to 32")', basePrice: 300, unit: "pc" },
      { id: "tv_55", name: 'TV (32" - 55")', basePrice: 450, unit: "pc" },
      { id: "tv_large", name: 'TV (55"+)', basePrice: 600, unit: "pc" },
    ],
  },
  {
    id: "small_appliances",
    name: "Small Appliances",
    items: [
      { id: "microwave", name: "Microwave", basePrice: 150, unit: "pc" },
      { id: "geyser", name: "Geyser", basePrice: 200, unit: "pc" },
      { id: "chimney", name: "Chimney", basePrice: 300, unit: "pc" },
      { id: "water_purifier", name: "Water Purifier", basePrice: 150, unit: "pc" },
      { id: "mixer", name: "Mixer Grinder", basePrice: 80, unit: "pc" },
    ],
  },
  {
    id: "boxes",
    name: "Cartons",
    items: [
      { id: "small_carton", name: "Small Carton", basePrice: 50, unit: "pc" },
      { id: "medium_carton", name: "Medium Carton", basePrice: 80, unit: "pc" },
      { id: "large_carton", name: "Large Carton", basePrice: 120, unit: "pc" },
      { id: "wardrobe_carton", name: "Wardrobe Carton", basePrice: 200, unit: "pc" },
      { id: "bedding_carton", name: "Bedding Carton", basePrice: 100, unit: "pc" },
      { id: "fragile_box", name: "Fragile Items Box", basePrice: 150, unit: "pc" },
    ],
  },
]

export const ADDITIONAL_SERVICES: {
  id: AdditionalService
  name: string
  price: number
}[] = [
  { id: "ac_installation", name: "AC Installation", price: 1500 },
  { id: "dismantling", name: "Dismantling", price: 800 },
  { id: "geyser_installation", name: "Geyser Installation", price: 600 },
  { id: "tv_installation", name: "TV Installation", price: 500 },
  { id: "refrigerator", name: "Refrigerator Setup", price: 300 },
  { id: "furniture_assembly", name: "Furniture Assembly", price: 1000 },
]

export const PACKAGING_OPTIONS: {
  id: PackagingType
  name: string
  description: string
  multiplier: number
}[] = [
  {
    id: "standard",
    name: "Standard Packaging",
    description: "Basic bubble wrap and cardboard protection",
    multiplier: 1,
  },
  {
    id: "premium",
    name: "Premium Packaging",
    description: "Extra cushioning, foam sheets & fragile handling",
    multiplier: 1.25,
  },
]
