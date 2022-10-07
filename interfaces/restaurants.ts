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