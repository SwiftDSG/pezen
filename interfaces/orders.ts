import { MenuCart } from "./menus"
import { RestaurantMin } from "./restaurants";

export interface OrderMethod {
  name: string;
  type: "dine-in" | "booking" | "pre-order";
  icon: string;
  message: string;
  available: boolean;
  table?: string;
  guest?: number;
  date?: number;
}

export interface OrderCart {
  method: {
    type: OrderMethod['type']
    table?: string
    guest?: number
    date?: number
  }
  restaurant: RestaurantMin
  items: MenuCart[]
}