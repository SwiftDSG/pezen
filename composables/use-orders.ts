import { OrderCart } from "~~/interfaces/orders";

export default function () {
  const cart = useState<OrderCart>('order-cart', () => null)

  const loadCart = (code: string): OrderCart => {
    const cartRaw: string = localStorage.getItem('order-cart')
    if (cartRaw) {
      cart.value = JSON.parse(cartRaw)
      if (cart.value?.restaurant.code !== code) {
        localStorage.removeItem('order-cart')
        cart.value = null
      }
    }
    return cart.value
  }

  const setCart = (payload: OrderCart): void => {
    localStorage.setItem('order-cart', JSON.stringify(payload))
    cart.value = payload
  }

  return { cart, loadCart, setCart }
}