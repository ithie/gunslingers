import { describe, it, expect, beforeEach } from 'vitest'
import useHandCards from './useHandCards'
import ICard from '../../interfaces/ICard'
import { CARD_TYPES } from '../../enums'

const mockCard1: ICard = { name: 'card1', type: CARD_TYPES.MODIFICATION }
const mockCard2: ICard = { name: 'card2', type: CARD_TYPES.MODIFICATION }
const mockCard3: ICard = { name: 'card3', type: CARD_TYPES.MODIFICATION }

describe('useHandCards', () => {
  let composable: ReturnType<typeof useHandCards>

  beforeEach(() => {
    composable = useHandCards()
    composable.handCards.value = {
      zone: [[], []],
      hand: [[], []],
    }
  })

  it('should expose the handCards ref with the correct initial structure', () => {
    expect(composable.handCards.value.zone).toEqual([[], []])
    expect(composable.handCards.value.hand).toEqual([[], []])
  })

  describe('setNewCards', () => {
    it('should set cards for a player in the hand zone', () => {
      const playerIndex = 0
      const cardsToSet: ICard[] = [mockCard1, mockCard2]

      composable.setNewCards(playerIndex, 'hand', cardsToSet)

      expect(composable.handCards.value.hand[playerIndex]).toEqual(cardsToSet)
      expect(composable.handCards.value.zone[playerIndex]).toEqual([])
    })

    it('should set cards for a player in the zone zone', () => {
      const playerIndex = 1
      const cardsToSet = [mockCard3]

      composable.setNewCards(playerIndex, 'zone', cardsToSet)

      expect(composable.handCards.value.zone[playerIndex]).toEqual(cardsToSet)
      expect(composable.handCards.value.hand[playerIndex]).toEqual([])
    })

    it('should overwrite existing cards', () => {
      const playerIndex = 0
      composable.setNewCards(playerIndex, 'hand', [mockCard1])

      const newCards = [mockCard2, mockCard3]
      composable.setNewCards(playerIndex, 'hand', newCards)

      expect(composable.handCards.value.hand[playerIndex]).toEqual(newCards)
    })
  })

  describe('removeCards', () => {
    beforeEach(() => {
      composable.setNewCards(0, 'hand', [mockCard1, mockCard2, mockCard3])
      composable.setNewCards(1, 'zone', [mockCard1, mockCard2])
    })

    it('should replace cards at specified indices with undefined in the hand zone', () => {
      const playerIndex = 0
      const type = 'hand'
      const indizesToRemove = [0, 2]

      composable.removeCards(playerIndex, type, indizesToRemove)

      const expected = [undefined, mockCard2, undefined]
      expect(composable.handCards.value[type][playerIndex]).toEqual(expected)
    })

    it('should replace cards at specified indices with undefined in the zone zone', () => {
      const playerIndex = 1
      const type = 'zone'
      const indizesToRemove = [1]

      composable.removeCards(playerIndex, type, indizesToRemove)

      const expected = [mockCard1, undefined]
      expect(composable.handCards.value[type][playerIndex]).toEqual(expected)
    })

    it('should handle an empty index array, leaving all cards', () => {
      const playerIndex = 0
      const type = 'hand'
      const initialCards = composable.handCards.value[type][playerIndex]

      composable.removeCards(playerIndex, type, [])

      expect(composable.handCards.value[type][playerIndex]).toEqual(
        initialCards,
      )
    })

    it('should handle indices that are out of bounds (map ignores them naturally)', () => {
      const playerIndex = 0
      const type = 'hand'
      const indizesToRemove = [0, 100]

      composable.removeCards(playerIndex, type, indizesToRemove)

      const expected = [undefined, mockCard2, mockCard3]
      expect(composable.handCards.value[type][playerIndex]).toEqual(expected)
    })

    it('should correctly handle removing all cards', () => {
      const playerIndex = 1
      const type = 'zone'
      const indizesToRemove = [0, 1]

      composable.removeCards(playerIndex, type, indizesToRemove)

      const expected = [undefined, undefined]
      expect(composable.handCards.value[type][playerIndex]).toEqual(expected)
    })
  })
})
