import { computed } from 'vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useCardSelect from './useCardSelect'

const MOCK_GAMETABLE = {
  value: {
    players: [
      {
        cardsPlayed: false,
        selectedCards: {
          zoneCard: -1,
          handCard: -1,
        },
      },
      {
        cardsPlayed: false,
        selectedCards: {
          zoneCard: -1,
          handCard: -1,
        },
      },
    ],
  },
}

vi.mock('../useGameTable/useGameTable', () => ({
  default: vi.fn(() => ({
    gameTable: MOCK_GAMETABLE,
  })),
}))

const getSelectedCardIndex = (pIndex: number, key: 'zoneCard' | 'handCard') => {
  return MOCK_GAMETABLE.value.players[pIndex].selectedCards[key]
}

describe('useCardSelection', () => {
  beforeEach(() => {
    MOCK_GAMETABLE.value.players[0].cardsPlayed = false
    MOCK_GAMETABLE.value.players[0].selectedCards.zoneCard = -1
    MOCK_GAMETABLE.value.players[0].selectedCards.handCard = -1
  })

  describe('select', () => {
    const playerIndex = 0
    const cardIndexToSelect = 3
    const cardKey = 'handCard'

    it('should update the selectedCards index when cardsPlayed is false', () => {
      const { select } = useCardSelect(cardIndexToSelect, playerIndex, cardKey)

      select()

      expect(getSelectedCardIndex(playerIndex, cardKey)).toBe(cardIndexToSelect)
    })

    it('should NOT update the selectedCards index when cardsPlayed is true', () => {
      MOCK_GAMETABLE.value.players[playerIndex].cardsPlayed = true
      const initialIndex = getSelectedCardIndex(playerIndex, cardKey)

      const { select } = useCardSelect(cardIndexToSelect, playerIndex, cardKey)

      select()

      expect(getSelectedCardIndex(playerIndex, cardKey)).toBe(initialIndex)
      expect(getSelectedCardIndex(playerIndex, cardKey)).not.toBe(
        cardIndexToSelect,
      )
    })
  })

  describe('isSelected', () => {
    const playerIndex = 0
    const cardIndexToCheck = 5
    const cardKey = 'zoneCard'

    const getResult = () => {
      const { isSelected } = useCardSelect(
        cardIndexToCheck,
        playerIndex,
        cardKey,
      )
      return isSelected.value
    }

    it('should return true when the current cardIndex matches the selectedCards index and cardsPlayed is false', () => {
      MOCK_GAMETABLE.value.players[playerIndex].selectedCards[cardKey] =
        cardIndexToCheck

      expect(getResult()).toBe(true)
    })

    it('should return false when the current cardIndex does NOT match the selectedCards index', () => {
      MOCK_GAMETABLE.value.players[playerIndex].selectedCards[cardKey] = 99

      expect(getResult()).toBe(false)
    })

    it('should return undefined when cardsPlayed is true, regardless of index match', () => {
      MOCK_GAMETABLE.value.players[playerIndex].selectedCards[cardKey] =
        cardIndexToCheck
      MOCK_GAMETABLE.value.players[playerIndex].cardsPlayed = true

      expect(getResult()).toBeUndefined()
    })
  })
})
