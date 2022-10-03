interface RestaurantRoom {
  id: string
  order_number: string
}

export interface RestaurantListenSocket {
  'update-order': () => void
}

export interface RestaurantEmitSocket {
  'join-room': (payload: RestaurantRoom) => void
  'leave-room': (payload: RestaurantRoom) => void
}

export interface NotificationListenSocket {
  'new-notification': () => void
}

export interface NotificationEmitSocket {
  'join': (token: string) => void
}