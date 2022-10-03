import { RestaurantType } from "~~/interfaces/restaurants";

export default function () {
  const restaurantTypes: RestaurantType[] = [
    'Cafe',
    'Steakhouse',
    'Seafood',
    'Pastry',
    'BBQ & Grill',
    'Fast Food',
    'Healthy',
    'Traditional',
    'Chinese',
    'Japanese',
    'Indonesian',
    'Indian',
    'Italian',
    'Mexican',
    'Middle Eastern',
    'Thailand',
  ]

  return { restaurantTypes }
}