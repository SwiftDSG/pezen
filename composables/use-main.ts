import { ViewMode } from "~~/interfaces/general";

export default function () {
  const viewMode = useState<ViewMode>('view-mode', () => null)

  return { viewMode }
}