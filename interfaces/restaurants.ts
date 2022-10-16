import { Courier } from "./couriers"
import { Position, PositionMin } from "./general"

interface RestaurantOpeningHour {
  open: string
  close: string
}

export type RestaurantType =
  'Cafe' |
  'Steakhouse' |
  'Seafood' |
  'Pastry' |
  'BBQ & Grill' |
  'Fast Food' |
  'Healthy' |
  'Traditional' |
  'Chinese' |
  'Japanese' |
  'Indonesian' |
  'Indian' |
  'Italian' |
  'Mexican' |
  'Middle Eastern' |
  'Thailand'


export interface RestaurantMin {
  _id: string
  code: string
  name: string
  logo_url?: string
}

export interface Restaurant {
  _id: string
  name: string
  code: string
  categories: number[]
  formatted_address: string[]
  distance?: number
  price_level?: number
  address?: string
  logo_url?: string
  image_url?: string
  opening_hours?: (RestaurantOpeningHour | 'closed' | 'opened')[]
  position?: {
    lat: number
    lng: number
  }
  rating?: {
    count: number
    value: number
  }
  create_date: Date
}

export interface RestaurantDetails extends Restaurant {
  methods: {
    'dine-in': {
      count: number
    }
    'pre-order': {
      count: number
    }
  }
  tables: { _id: string; table_number: string, capacity?: number }[]
  couriers?: Courier[]
  addresses?: {
    address: string
    distance: {
      text: string
      value: number
    }
    formatted_address: string[]
    name: string
    phone: string
    position: PositionMin
    type: string
  }[]
}