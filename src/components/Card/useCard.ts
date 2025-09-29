import { onBeforeUnmount, ref, watch, WatchStopHandle } from 'vue'
import ICard from '../../interfaces/ICard'

const cards = ref<string[]>([])

export default (playerIndex: number, hasEffect: boolean, name: string) => {
  const watchStopHandle: WatchStopHandle = watch(
    () => name,
    (curr, prev) => {
      if (hasEffect && prev !== curr) {
        console.log(
          'CHANGED VALUE:',
          playerIndex,
          '>',
          curr,
          !!hasEffect ? 'TRUE' : 'FALSE',
        )
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    if (watchStopHandle) {
      watchStopHandle()
    }
  })
}
