import { RestaurantMenusResponse } from "~~/interfaces/general";
import { Restaurant, RestaurantType } from "~~/interfaces/restaurants";

export default function () {
  const { positionCurrent } = useMain()
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

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

  const checkRestaurant = async (payload: { code: string, table: string }): Promise<string> => {
    const response: Response = await $fetch(`${config.public.apiBase}/restaurants/check/${payload.code}?table_number=${payload.table}`, 'get')

    const result: string = await response.text()
    return result
  }

  const getRestaurantDetails = async (code: string): Promise<Restaurant> => {
    const response: Response = await $fetch(`${config.public.apiBase}/restaurants/details/${code}${positionCurrent.value ? `?lat=${positionCurrent.value.position.lat}&lng=${positionCurrent.value.position.lng}` : ''
      }`, 'get')

    const result: Restaurant = await response.json()
    return result
  }

  const getRestaurantMenus = async (code: string, type: 'dine-in' | 'pre-order'): Promise<RestaurantMenusResponse> => {
    const response: Response = await $fetch(`${config.public.apiBase}/restaurants/menus/${code}?type=${type}`, 'get')

    const result: RestaurantMenusResponse = await response.json()
    return result
  }

  return { restaurantTypes, checkRestaurant, getRestaurantDetails, getRestaurantMenus }
}