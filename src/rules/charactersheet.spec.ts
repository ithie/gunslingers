import { describe, it, expect } from 'vitest'
import { gunslingerData, gamblerData, headhunterData } from './charactersheet'
import { CARD_TYPES, VALUE_TYPES } from '../constants'

const ALL_CHARACTERS = [gunslingerData, gamblerData, headhunterData]

describe('Character Data Integrity', () => {
  it.each(ALL_CHARACTERS)(
    'should ensure character $name has correct base structure',
    (character) => {
      expect(character.type).toBe(CARD_TYPES.CHARACTER)

      expect(character.name).toBeTypeOf('string')
      expect(character.name.length).toBeGreaterThan(0)

      expect(character.effect).toBeTypeOf('function')

      expect(character.effectLabel).toBeTypeOf('string')
      expect(character.effectLabel.length).toBeGreaterThan(0)

      expect(character[VALUE_TYPES.HP]).toBeTypeOf('number')
      expect(character[VALUE_TYPES.ATK]).toBeTypeOf('number')
      expect(character[VALUE_TYPES.DEF]).toBeTypeOf('number')
      expect(character[VALUE_TYPES.SPD]).toBeTypeOf('number')

      expect(character[VALUE_TYPES.HP]).toBeGreaterThan(0)
    },
  )

  it('should verify the base stats for Gunslinger', () => {
    expect(gunslingerData[VALUE_TYPES.HP]).toBe(10)
    expect(gunslingerData[VALUE_TYPES.ATK]).toBe(3)
    expect(gunslingerData[VALUE_TYPES.DEF]).toBe(2)
    expect(gunslingerData[VALUE_TYPES.SPD]).toBe(1)
  })

  /*
  it('should apply the Gunslinger ATK buff correctly', () => {
      const mockGameData = {
          own: { hand: [{ id: 1 }, { id: 2 }] },
          opponent: {},
      } as any;
      
      gunslingerData.effect(mockGameData)
      
      expect(mockGameData.own.tmpStats.ATK).toBe(2)
  })
  */
})
