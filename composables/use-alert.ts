import { Alert } from "~~/interfaces/alerts"

export default () => {
  const alert = useState<Alert>('alert', () => null)

  const setAlert = (data: Alert): Alert => {
    return alert.value = data
  }

  const removeAlert = (): void => {
    return alert.value = null
  }

  return { alert, setAlert, removeAlert }
}