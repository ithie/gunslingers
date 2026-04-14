import { describe, expect, it } from 'vitest'
import getModificationCards from './getModificationCards'

describe('getDefenseCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getModificationCards()

    expect(draftDeck).toHaveLength(32)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      { name: 'card.modification.firmGrip', type: 'MODIFICATION', ATK: 2 },
      { name: 'card.modification.firmGrip', type: 'MODIFICATION', ATK: 2 },
      { name: 'card.modification.firmGrip', type: 'MODIFICATION', ATK: 2 },
      { name: 'card.modification.firmGrip', type: 'MODIFICATION', ATK: 2 },
      { name: 'card.modification.cover', type: 'MODIFICATION', DEF: 2 },
      { name: 'card.modification.cover', type: 'MODIFICATION', DEF: 2 },
      { name: 'card.modification.cover', type: 'MODIFICATION', DEF: 2 },
      { name: 'card.modification.cover', type: 'MODIFICATION', DEF: 2 },
      { name: 'card.modification.rodeFaster', type: 'MODIFICATION', SPD: 2 },
      { name: 'card.modification.rodeFaster', type: 'MODIFICATION', SPD: 2 },
      { name: 'card.modification.rodeFaster', type: 'MODIFICATION', SPD: 2 },
      { name: 'card.modification.rodeFaster', type: 'MODIFICATION', SPD: 2 },
      {
        name: 'card.modification.unleashedRage',
        type: 'MODIFICATION',
        ATK: 2,
        DEF: -1,
      },
      {
        name: 'card.modification.unleashedRage',
        type: 'MODIFICATION',
        ATK: 2,
        DEF: -1,
      },
      {
        name: 'card.modification.unleashedRage',
        type: 'MODIFICATION',
        ATK: 2,
        DEF: -1,
      },
      {
        name: 'card.modification.unleashedRage',
        type: 'MODIFICATION',
        ATK: 2,
        DEF: -1,
      },
      {
        name: 'card.modification.steelVest',
        type: 'MODIFICATION',
        DEF: 3,
        SPD: -2,
      },
      {
        name: 'card.modification.steelVest',
        type: 'MODIFICATION',
        DEF: 3,
        SPD: -2,
      },
      {
        name: 'card.modification.steelVest',
        type: 'MODIFICATION',
        DEF: 3,
        SPD: -2,
      },
      {
        name: 'card.modification.steelVest',
        type: 'MODIFICATION',
        DEF: 3,
        SPD: -2,
      },
      {
        name: 'card.modification.nimbleFinger',
        type: 'MODIFICATION',
        ATK: 1,
        SPD: 1,
      },
      {
        name: 'card.modification.nimbleFinger',
        type: 'MODIFICATION',
        ATK: 1,
        SPD: 1,
      },
      {
        name: 'card.modification.nimbleFinger',
        type: 'MODIFICATION',
        ATK: 1,
        SPD: 1,
      },
      {
        name: 'card.modification.nimbleFinger',
        type: 'MODIFICATION',
        ATK: 1,
        SPD: 1,
      },
      {
        name: 'card.modification.overturnedCarriage',
        type: 'MODIFICATION',
        DEF: 1,
        SPD: -1,
      },
      {
        name: 'card.modification.overturnedCarriage',
        type: 'MODIFICATION',
        DEF: 1,
        SPD: -1,
      },
      {
        name: 'card.modification.overturnedCarriage',
        type: 'MODIFICATION',
        DEF: 1,
        SPD: -1,
      },
      {
        name: 'card.modification.overturnedCarriage',
        type: 'MODIFICATION',
        DEF: 1,
        SPD: -1,
      },
      {
        name: 'card.modification.lightCaliber',
        type: 'MODIFICATION',
        ATK: -2,
        SPD: 2,
      },
      {
        name: 'card.modification.lightCaliber',
        type: 'MODIFICATION',
        ATK: -2,
        SPD: 2,
      },
      {
        name: 'card.modification.lightCaliber',
        type: 'MODIFICATION',
        ATK: -2,
        SPD: 2,
      },
      {
        name: 'card.modification.lightCaliber',
        type: 'MODIFICATION',
        ATK: -2,
        SPD: 2,
      },
    ])
  })
})
