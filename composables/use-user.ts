import { CookieRef } from "nuxt/dist/app/composables";
import { UserMin } from "~~/interfaces/users";

export default function () {
  const router = useRouter()
  const { setAlert } = useAlert()
  const { $fetch, $setDefaults } = useNuxtApp()
  const config = useRuntimeConfig()

  const user = useState<UserMin>('user', () => null)
  const atkCookie: CookieRef<string> = useCookie<string>('atk', {
    maxAge: 1800
  })
  const rtkCookie: CookieRef<string> = useCookie<string>('rtk', {
    maxAge: 86400
  })

  const login = async (payload: { email: string; password: string }): Promise<UserMin> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users/login`, 'post', JSON.stringify({ email: payload.email, password: payload.password }))
    if (response.status !== 200) throw new Error(await response.text())

    const result: { atk: string; rtk: string; user: UserMin } = await response.json()
    if (!result.atk || !result.rtk) throw new Error('')
    atkCookie.value = result.atk
    rtkCookie.value = result.rtk
    $setDefaults({
      headers: {
        'Authorization': `Bearer ${result.atk}`
      }
    })
    user.value = result.user
    return result.user
  }

  const refresh = async (): Promise<UserMin> => {
    try {
      if (!rtkCookie.value) throw new Error('')
      const response: Response = await $fetch(`${config.public.apiBase}/users/refresh-token`, 'post', JSON.stringify({ rtk: rtkCookie.value }))
      if (response.status !== 200) throw new Error(await response.text())

      const result: { atk: string; rtk: string; user: UserMin } = await response.json()
      if (!result.atk || !result.rtk) throw new Error('')
      atkCookie.value = result.atk
      rtkCookie.value = result.rtk
      $setDefaults({
        headers: {
          'Authorization': `Bearer ${result.atk}`
        }
      })
      user.value = result.user
      return result.user
    } catch {
      if (rtkCookie.value || atkCookie.value) {
        setAlert({
          type: 'warning',
          title: 'Sesi habis',
          message: 'Silahkan login ulang'
        })
        logout()
        router.push('/auth')
      } else {
        logout()
      }
      return null
    }
  }

  const logout = (): void => {
    atkCookie.value = ''
    rtkCookie.value = ''
    $setDefaults({
      headers: {
        'Authorization': null
      }
    })
    user.value = null
  }

  const sendVerificationCode = async (payload: { email: string }): Promise<boolean> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users/create-code`, 'post', JSON.stringify({ email: payload.email }))
    if (response.status !== 200) throw new Error(await response.text())

    return true
  }

  const verifyEmail = async (payload: { code: string; email: string }): Promise<boolean> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users/verify-email`, 'post', JSON.stringify({ email: payload.email, code: payload.code }))
    if (response.status !== 200) throw new Error(await response.text())

    return true
  }

  const createAccount = async (payload: { code: string; name: string; email: string; password: string }): Promise<string> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users/create`, 'post', JSON.stringify({ name: payload.name, email: payload.email, password: payload.password, code: payload.code }))
    if (response.status !== 200) throw new Error(await response.text())

    const result: string = await response.text()

    return result
  }

  const addAddress = async (payload: { position: { lat: number, lng: number }, name: string, type: string, address: string, phone: string }): Promise<string> => {
    const response: Response = await $fetch(`${config.public.apiBase}/users/add-address`, 'put', JSON.stringify(payload))
    if (response.status !== 200) throw new Error(await response.text())

    const result: string = await response.text()

    return result
  }

  return {
    user,
    login,
    logout,
    refresh,
    sendVerificationCode,
    verifyEmail,
    createAccount,
    addAddress
  }
}