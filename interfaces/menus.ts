import { RestaurantMin } from "./restaurants"

interface MenuBase {
  _id: string
  type: 'regular' | 'pre-order' | 'dine-in' | 'scheduled'
  category: string
  description: string
  name: string
  portion: number
  price: number
  markup_price: number
  make_duration: number
  status: 'active' | 'inactive'
  image_url?: string
  restaurant?: RestaurantMin
  create_date?: Date
}

export interface Menu extends MenuBase {
  stock?: number
}

export interface MenuPack extends MenuBase {
  stock: {
    available: number
    quantity: number
  }
}