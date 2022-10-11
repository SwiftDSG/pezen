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

export interface MenuCart {
  _id: string
  name: string
  quantity: number
  price: number
  markup_price: number
  image_url?: string
  note?: string
  take_away?: boolean
}

export interface Menu extends MenuBase {
  stock?: number
  eligible_promos?: {
    _id: string
    p_ids: string[]
    amount: number
  }
}

export interface MenuPack extends MenuBase {
  stock: {
    available: number
    quantity: number
  }
}

interface MenuGroupDelivery {
  type: 'car' | 'bike',
  name: string
  fee: number
  address: any
}

export interface MenuGroup {
  code: string
  items: MenuCart[]
  date?: Date
  delivery?: MenuGroupDelivery
}