import { describe, expect, it } from 'vitest'
import getDefenseCards from './getDefenseCards'

describe('getDefenseCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getDefenseCards()

    expect(draftDeck).toHaveLength(15)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      { name: 'Blocken', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      { name: 'Blocken', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      { name: 'Blocken', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      {
        name: 'Ducken und Rollen',
        type: 'DEFENSE',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'Ducken und Rollen',
        type: 'DEFENSE',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'Ducken und Rollen',
        type: 'DEFENSE',
        effect: { when: 'INSTANT' },
      },
      { name: 'Gegenschuss', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      { name: 'Gegenschuss', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      { name: 'Gegenschuss', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      { name: 'Querschläger', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      { name: 'Querschläger', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      { name: 'Querschläger', type: 'DEFENSE', effect: { when: 'INSTANT' } },
      {
        name: 'Zeitverzerrung',
        type: 'DEFENSE',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'Zeitverzerrung',
        type: 'DEFENSE',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'Zeitverzerrung',
        type: 'DEFENSE',
        effect: { when: 'INSTANT' },
      },
    ])
  })
})
