import { computed } from 'vue'
import useGameTable from '../useGameTable/useGameTable'

export default (
  cardIndex: number,
  playerIndex: number,
  key: 'zoneCard' | 'handCard',
) => {
  return {
    isSelected: computed(() => {
      const { gameTable } = useGameTable()
      if (!gameTable.value.players[playerIndex].cardsPlayed) {
        return (
          cardIndex === gameTable.value.players[playerIndex].selectedCards[key]
        )
      }
    }),
    select: () => {
      const { gameTable } = useGameTable()
      if (!gameTable.value.players[playerIndex].cardsPlayed) {
        return (gameTable.value.players[playerIndex].selectedCards[key] =
          cardIndex)
      }
    },
  }
}
