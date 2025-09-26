import { ref } from 'vue'
import ICard from '../../interfaces/ICard'

const handCards = ref<Record<'zone' | 'hand', (ICard | undefined)[][]>>({
  zone: [],
  hand: [],
})

export default () => {
  return {
    setNewCards: (
      playerIndex: number,
      type: 'zone' | 'hand',
      cards: ICard[],
    ) => {
      handCards.value[type][playerIndex] = cards
    },
    removeCards: (
      playerIndex: number,
      type: 'zone' | 'hand',
      indizes: number[],
    ) => {
      handCards.value[type][playerIndex] = handCards.value[type][
        playerIndex
      ].map((card, index) => {
        if (indizes.includes(index)) {
          return undefined
        }
        return card
      })
    },
    handCards,
  }
}
