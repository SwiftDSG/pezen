import { Subscription } from "./general"

type UserRole = 'user' | 'restaurant'

interface UserFinancePayoutAddress {
  name: string
  bank: string
  account: string
  alias_name: string
}

interface UserFinance {
  address: UserFinancePayoutAddress[]
  balance: number
}

export interface User {
  order_id: string[]
  restaurant_id: string[]
  name: string
  email: string
  phone: string
  password: string
  salt: string
  image_url?: string
  role: UserRole[]
  create_date: Date
  finance: UserFinance
  subscription: Subscription[]
}