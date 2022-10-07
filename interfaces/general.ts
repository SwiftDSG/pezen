import { Restaurant } from "./restaurants"
import { Menu, MenuPack } from "./menus";

export type ViewMode = 'desktop' | 'mobile'

export interface Subscription {
  endpoint: string
  uuid: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface Position {
  position: {
    lat: number
    lng: number
  }
  name: string
  address?: string
}

export interface HomeData {
  menus: {
    'dine-in'?: Menu[]
    'pre-order'?: Menu[]
    'pack'?: {
      date: Date
      items: MenuPack[]
    }[]
  }
  restaurants: {
    'reservable'?: Restaurant[]
    'popular'?: Restaurant[]
  }
}

export interface SearchData {
  'restaurants': Restaurant[]
  'menus': Menu[]
  'menu-packs': {
    date: Date
    items: MenuPack[]
  }[]
}

export interface InputFileOption {
  disabled: boolean;
  file: File;
  type?: 'any' | 'image';
  label?: string
  image_url?: string
}
export interface InputImageOption {
  label: string;
  limit: number;
  file: (File | string)[];
}
export interface InputOption {
  name: string
  placeholder: string
  model: string
  value?: string
  icon?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number'
  disabled?: boolean
  options?: (string | {
    name: string
    value: string
  })[]
}
export interface InputCodeOption {
  name: string
  length: number
  model: string
  disabled?: boolean
}
export interface InputSearchOption {
  name: string
  placeholder: string
  model: string
  type?: 'primary' | 'secondary'
}
export interface InputGeneric<T> {
  name: string
  placeholder: string
  model: string
  value?: T
  icon?: string
  label?: string
  error?: string
  type?: 'email' | 'password' | 'tel' | 'number'
  disabled?: boolean
  options?: (string | {
    name: string
    value: string
  })[]
}

export interface UserRecord {
  _id: string;
  name: string;
  role_id: string[];
}

export interface RestaurantMenuCategories {
  category: string
  menus: Menu[]
}

export interface RestaurantMenusResponse {
  categories: RestaurantMenuCategories[]
  packs?: MenuPack[]
}