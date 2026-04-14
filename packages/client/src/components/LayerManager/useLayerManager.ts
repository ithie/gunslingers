import { ref } from 'vue'

export interface ILayerData {
  props: Record<string, unknown>
  next: (data?: unknown) => void
}
interface ILayerState {
  layerName?: string
  data?: ILayerData
}

const layerState = ref<ILayerState>({})

export default () => {
  return {
    layerState,
    setLayer: (layerName: string, data: ILayerData) => {
      layerState.value = {
        layerName,
        data,
      }
    },
    unsetLayer: () => {
      layerState.value = {}
    },
  }
}
