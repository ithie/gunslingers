import { describe, expect, it } from 'vitest'
import getModificationCards from './getModificationCards'

describe('getDefenseCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getModificationCards()

    expect(draftDeck).toHaveLength(32)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      { name: 'Fester Griff', type: 'MODIFICATION', ATK: 2 },
      { name: 'Fester Griff', type: 'MODIFICATION', ATK: 2 },
      { name: 'Fester Griff', type: 'MODIFICATION', ATK: 2 },
      { name: 'Fester Griff', type: 'MODIFICATION', ATK: 2 },
      { name: 'Deckung', type: 'MODIFICATION', DEF: 2 },
      { name: 'Deckung', type: 'MODIFICATION', DEF: 2 },
      { name: 'Deckung', type: 'MODIFICATION', DEF: 2 },
      { name: 'Deckung', type: 'MODIFICATION', DEF: 2 },
      { name: 'Schneller Ritt', type: 'MODIFICATION', SPD: 2 },
      { name: 'Schneller Ritt', type: 'MODIFICATION', SPD: 2 },
      { name: 'Schneller Ritt', type: 'MODIFICATION', SPD: 2 },
      { name: 'Schneller Ritt', type: 'MODIFICATION', SPD: 2 },
      { name: 'Entfesselte Wut', type: 'MODIFICATION', ATK: 2, DEF: -1 },
      { name: 'Entfesselte Wut', type: 'MODIFICATION', ATK: 2, DEF: -1 },
      { name: 'Entfesselte Wut', type: 'MODIFICATION', ATK: 2, DEF: -1 },
      { name: 'Entfesselte Wut', type: 'MODIFICATION', ATK: 2, DEF: -1 },
      { name: 'Stahlweste', type: 'MODIFICATION', DEF: 3, SPD: -2 },
      { name: 'Stahlweste', type: 'MODIFICATION', DEF: 3, SPD: -2 },
      { name: 'Stahlweste', type: 'MODIFICATION', DEF: 3, SPD: -2 },
      { name: 'Stahlweste', type: 'MODIFICATION', DEF: 3, SPD: -2 },
      { name: 'Flinker Finger', type: 'MODIFICATION', ATK: 1, SPD: 1 },
      { name: 'Flinker Finger', type: 'MODIFICATION', ATK: 1, SPD: 1 },
      { name: 'Flinker Finger', type: 'MODIFICATION', ATK: 1, SPD: 1 },
      { name: 'Flinker Finger', type: 'MODIFICATION', ATK: 1, SPD: 1 },
      { name: 'Umgekippter Wagen', type: 'MODIFICATION', DEF: 1, SPD: -1 },
      { name: 'Umgekippter Wagen', type: 'MODIFICATION', DEF: 1, SPD: -1 },
      { name: 'Umgekippter Wagen', type: 'MODIFICATION', DEF: 1, SPD: -1 },
      { name: 'Umgekippter Wagen', type: 'MODIFICATION', DEF: 1, SPD: -1 },
      { name: 'Leichtes Kaliber', type: 'MODIFICATION', ATK: -2, SPD: 2 },
      { name: 'Leichtes Kaliber', type: 'MODIFICATION', ATK: -2, SPD: 2 },
      { name: 'Leichtes Kaliber', type: 'MODIFICATION', ATK: -2, SPD: 2 },
      { name: 'Leichtes Kaliber', type: 'MODIFICATION', ATK: -2, SPD: 2 },
    ])
  })
})
