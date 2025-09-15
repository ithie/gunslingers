import { describe, expect, it } from 'vitest'
import getDefenseCards from './getDefenseCards'

describe('getDefenseCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getDefenseCards()

    expect(draftDeck).toHaveLength(15)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      { name: 'Blocken', effect: { when: 'INSTANT', type: 'INSTANT' } },
      { name: 'Blocken', effect: { when: 'INSTANT', type: 'INSTANT' } },
      { name: 'Blocken', effect: { when: 'INSTANT', type: 'INSTANT' } },
      {
        name: 'Ducken und Rollen',
        effect: { when: 'INSTANT', type: 'INSTANT' },
      },
      {
        name: 'Ducken und Rollen',
        effect: { when: 'INSTANT', type: 'INSTANT' },
      },
      {
        name: 'Ducken und Rollen',
        effect: { when: 'INSTANT', type: 'INSTANT' },
      },
      { name: 'Gegenschuss', effect: { when: 'INSTANT', type: 'PERMANENT' } },
      { name: 'Gegenschuss', effect: { when: 'INSTANT', type: 'PERMANENT' } },
      { name: 'Gegenschuss', effect: { when: 'INSTANT', type: 'PERMANENT' } },
      { name: 'Querschläger', effect: { when: 'INSTANT', type: 'PERMANENT' } },
      { name: 'Querschläger', effect: { when: 'INSTANT', type: 'PERMANENT' } },
      { name: 'Querschläger', effect: { when: 'INSTANT', type: 'PERMANENT' } },
      {
        name: 'Zeitverzerrung',
        effect: { when: 'INSTANT', type: 'PERMANENT' },
      },
      {
        name: 'Zeitverzerrung',
        effect: { when: 'INSTANT', type: 'PERMANENT' },
      },
      {
        name: 'Zeitverzerrung',
        effect: { when: 'INSTANT', type: 'PERMANENT' },
      },
    ])
  })
})
