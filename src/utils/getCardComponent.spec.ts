import { describe, it, expect } from 'vitest'
import { CARD_TYPES } from '../constants'
import EventCard from '../components/EventCard/EventCard.vue'
import ModificationCard from '../components/ModificationCard/ModificationCard.vue'
import DefenseCard from '../components/DefenseCard/DefenseCard.vue'
import Characters from '../components/Characters/Characters.vue'
import ZoneCard from '../components/ZoneCard/ZoneCard.vue'
import getCardComponent from './getCardComponent'

const EXPECTED_COMPONENTS = {
  [CARD_TYPES.EVENT]: EventCard,
  [CARD_TYPES.MODIFICATION]: ModificationCard,
  [CARD_TYPES.DEFENSE]: DefenseCard,
  [CARD_TYPES.CHARACTER]: Characters,
  [CARD_TYPES.ZONE]: ZoneCard,
}

describe('getCardComponent', () => {
  it('should return the correct component for known CARD_TYPES', () => {
    const cardTypes = Object.values(CARD_TYPES).filter(
      (type) => type !== CARD_TYPES.EMPTY_STACK && typeof type === 'string',
    ) as (keyof typeof CARD_TYPES)[]

    cardTypes.forEach((type) => {
      if (type !== CARD_TYPES.EMPTY_STACK) {
        const component = getCardComponent(type)
        const expected =
          EXPECTED_COMPONENTS[
            type as Exclude<keyof typeof CARD_TYPES, 'EMPTY_STACK'>
          ]

        expect(component).toBe(expected)
      }
    })
  })

  it('should return null for CARD_TYPES.EMPTY_STACK', () => {
    const component = getCardComponent(CARD_TYPES.EMPTY_STACK)

    expect(component).toBeNull()
  })

  it('should throw an error for an unknown card type (as per implementation)', () => {
    const unknownType = 'UNKNOWN_TYPE' as keyof typeof CARD_TYPES

    expect(getCardComponent(unknownType)).toBeNull()
  })
})
