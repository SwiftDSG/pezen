import { HomeData, Position, SearchData, ViewMode } from "~~/interfaces/general";

export default function () {
  const { $fetch } = useNuxtApp()
  const config = useRuntimeConfig()

  const viewMode = useState<ViewMode>('view-mode', () => null)
  const homeData = useState<HomeData>('home-data', () => null)
  const notificationPermission = useState<NotificationPermission | 'blocked'>('notification-permission', () => 'default')
  const geolocationPermission = useState<PermissionState>('geolocation-permission', () => 'prompt')
  const positionCurrent = useState<Position>('position-current', () => null)
  const positionSelected = useState<Position>('position-selected', () => null)
  const searchLoading = useState<boolean>('search-loading', () => false)
  const searchData = useState<SearchData>('search-data', () => null)

  const loadPermissions = async (): Promise<void> => {
    if ('Notification' in window) {
      const permission: NotificationPermission = Notification.permission
      if (permission === 'denied') {
        notificationPermission.value = 'denied'
      } else if (permission === 'granted') {
        notificationPermission.value = localStorage.getItem('notification_permission') === 'blocked' ? 'blocked' : 'granted'
      } else {
        notificationPermission.value = 'default'
      }
    }
    if (navigator.permissions) {
      const permission: PermissionStatus = await navigator.permissions.query({ name: 'geolocation' })
      geolocationPermission.value = permission.state
    } else {
      navigator.geolocation.getCurrentPosition(() => {
        geolocationPermission.value = 'granted'
      }, ({ code }) => {
        if (code === 1) {
          geolocationPermission.value = 'denied'
        } else {
          geolocationPermission.value = 'prompt'
        }
      })
    }
    const positionRaw: string = localStorage.getItem('position')
    if (positionRaw) {
      const { position, name, address }: Position = JSON.parse(positionRaw)
      if (position && name)
        positionSelected.value = {
          address,
          position,
          name
        }
    }
  }

  const geolocate = (): Promise<{ lat: number, lng: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          resolve({
            lat: coords.latitude,
            lng: coords.longitude
          })
        }, () => {
          reject('Gagal memuat lokasi anda')
        })
      } else {
        reject('Browser anda tidak support geolocation')
      }
    })
  }

  const reverseGeocode = async (payload: {
    lat: number
    lng: number
  }): Promise<string[]> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/main/reverse-geocode?lat=${payload.lat}&lng=${payload.lng}`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      const result: string[] = await response.json()
      return result
    } catch (e) {
      return null
    }
  }

  const setPosition = (payload: Position): void => {
    positionSelected.value = payload
    localStorage.setItem('position', JSON.stringify(payload))
  }

  const getHomeData = async (): Promise<HomeData> => {
    try {
      const response: Response = await $fetch(`${config.public.apiBase}/main`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      const result: HomeData = await response.json()
      homeData.value = result

      return result
    } catch (e) {
      return null
    }
  }

  const getSearchData = async (payload: { text: string }): Promise<SearchData> => {
    try {
      if (!payload.text?.length) throw new Error('INVALID_QUERY')
      searchLoading.value = true
      let urlString: string = `?query=${payload.text}`
      if (positionSelected.value) {
        urlString += `&lat=${positionSelected.value.position.lat}&lng=${positionSelected.value.position.lng}`
      }
      const response: Response = await $fetch(`${config.public.apiBase}/main/search${urlString}`, 'get')
      if (response.status !== 200) throw new Error(await response.text())

      const result: SearchData = await response.json()
      searchData.value = result
      searchLoading.value = false

      return result
    } catch (e) {
      searchLoading.value = false
      return null
    }
  }

  return {
    viewMode,
    homeData,
    notificationPermission,
    geolocationPermission,
    positionCurrent,
    positionSelected,
    searchData,
    searchLoading,
    getHomeData,
    getSearchData,
    loadPermissions,
    geolocate,
    reverseGeocode,
    setPosition
  }
}