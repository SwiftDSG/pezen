import { Position, PositionMin } from "./general"
import { UserMin } from "./users"

export interface CourierService {
  _id: string
  courier_id: string
  name: string
  price: number
  distance: {
    max: number
    increment?: {
      price: number
      threshold: number
      value: number
    }
  }
  weight: {
    max: number
    increment?: {
      price: number
      threshold: number
      value: number
    }
  }
  type: 'bike' | 'car'
}

export interface Courier {
  _id: string
  restaurant_id: string
  name: string
  type: string
  address: string
  formatted_address: string[]
  position: PositionMin
  services: CourierService[]
  members: UserMin[]
  create_date: Date
}