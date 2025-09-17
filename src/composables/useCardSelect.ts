import { computed } from 'vue'
import useGameTable from './useGameTable'

export default (cardIndex: number, key: 'zoneCard' | 'handCard') => {
  return {
    isSelected: computed(() => {
      const { gameTable } = useGameTable()
      if (!gameTable.value.activeTurn.cardsPlayed) {
        return cardIndex === gameTable.value.activeTurn[key]
      }
    }),
    select: () => {
      const { gameTable } = useGameTable()
      if (!gameTable.value.activeTurn.cardsPlayed) {
        return (gameTable.value.activeTurn[key] = cardIndex)
      }
    },
  }
}
