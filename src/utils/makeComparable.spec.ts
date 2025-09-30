import { describe, expect, it } from 'vitest'
import makeComparable from './makeComparable'
import { CARD_TYPES } from '../enums'

describe('makeComparable', () => {
  it('using initial data', () => {
    expect(
      makeComparable([[], [], [], [], [], [], [], []], {
        HP: 10,
        ATK: 1,
        DEF: 1,
        SPD: 3,
      }),
    ).toEqual('0.-1.-2.-3.-4.-5.-6.-7._10:1:3:1')
  })
  it('using changed data', () => {
    expect(
      makeComparable(
        [
          [],
          [],
          [],
          [],
          [
            {
              name: 'card.modification.lightCaliber',
              type: CARD_TYPES.MODIFICATION,
              ATK: -2,
              SPD: 2,
            },
          ],
          [],
          [],
          [],
        ],
        { HP: 8, ATK: 3, DEF: 2, SPD: 1 },
      ),
    ).toEqual(
      '0.-1.-2.-3.-card.modification.lightCaliber:MODIFICATION.-5.-6.-7._8:3:1:2',
    )
  })
})
