import { io, Socket } from 'socket.io-client'
import { RestaurantListenSocket, RestaurantEmitSocket, NotificationListenSocket, NotificationEmitSocket } from '~~/interfaces/sockets'

export default function () {
  const config = useRuntimeConfig()

  const socketRestaurant = useState<Socket<RestaurantListenSocket, RestaurantEmitSocket>>('socket-restaurant', () => null)
  const socketNotification = useState<Socket<NotificationListenSocket, NotificationEmitSocket>>('socket-notification', () => null)

  const initSocket = (): void => {
    socketRestaurant.value = io(`${config.public.apiBase}/restaurant`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    })
    socketNotification.value = io(`${config.public.apiBase}/notification`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
    })
  }

  return { socketRestaurant, socketNotification, initSocket }
}