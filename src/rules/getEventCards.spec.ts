import { describe, expect, it } from 'vitest'
import getEventCards from './getEventCards'

describe('getEventCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getEventCards()

    expect(draftDeck).toHaveLength(10)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      {
        name: 'Schlangenbiss',
        type: 'EVENT',
        effect: { when: 'BEFOREHAND' },
      },
      {
        name: 'Schlangenbiss',
        type: 'EVENT',
        effect: { when: 'BEFOREHAND' },
      },
      { name: 'Kopfnuss', type: 'EVENT', effect: { when: 'BEFOREHAND' } },
      { name: 'Kopfnuss', type: 'EVENT', effect: { when: 'BEFOREHAND' } },
      { name: 'Heilung', type: 'EVENT', effect: { when: 'INSTANT' } },
      { name: 'Heilung', type: 'EVENT', effect: { when: 'INSTANT' } },
      { name: 'Falsches Spiel', type: 'EVENT', effect: { when: 'INSTANT' } },
      { name: 'Falsches Spiel', type: 'EVENT', effect: { when: 'INSTANT' } },
      { name: 'Schwächung', type: 'EVENT', ATK: -2, DEF: -2, SPD: -2 },
      { name: 'Schwächung', type: 'EVENT', ATK: -2, DEF: -2, SPD: -2 },
    ])
  })
})
