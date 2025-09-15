import { describe, expect, it } from 'vitest'
import getEventCards from './getEventCards'

describe('getEventCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getEventCards()

    expect(draftDeck).toHaveLength(10)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      {
        name: 'Schlangenbiss',
        effect: { when: 'BEFOREHAND', type: 'PERMANENT' },
      },
      {
        name: 'Schlangenbiss',
        effect: { when: 'BEFOREHAND', type: 'PERMANENT' },
      },
      { name: 'Kopfnuss', effect: { when: 'BEFOREHAND', type: 'PERMANENT' } },
      { name: 'Kopfnuss', effect: { when: 'BEFOREHAND', type: 'PERMANENT' } },
      { name: 'Heilung', effect: { when: 'INSTANT', type: 'INSTANT' } },
      { name: 'Heilung', effect: { when: 'INSTANT', type: 'INSTANT' } },
      { name: 'Falsches Spiel', effect: { when: 'INSTANT', type: 'INSTANT' } },
      { name: 'Falsches Spiel', effect: { when: 'INSTANT', type: 'INSTANT' } },
      { name: 'Schwächung', effect: { when: 'BEFOREHAND', type: 'PERMANENT' } },
      { name: 'Schwächung', effect: { when: 'BEFOREHAND', type: 'PERMANENT' } },
    ])
  })
})
