import { describe, expect, it } from 'vitest'
import getZoneCardsDraftDeck from './getZoneCardsDraftDeck'

describe('getZoneCardsDraftDeck', () => {
  it('should provide a shuffled deck', () => {
    const draftDeck = getZoneCardsDraftDeck()
    expect(draftDeck).toHaveLength(48)
    expect(
      draftDeck.sort((a, b) => {
        if (a.zones[0] < b.zones[0]) {
          return -1
        } else if (a.zones[0] > b.zones[0]) {
          return 1
        }
        return 0
      }),
    ).toEqual([
      { name: '', zones: [0] },
      { name: '', zones: [0] },
      { name: '', zones: [0] },
      { name: '', zones: [0] },
      { name: '', zones: [0] },
      { name: '', zones: [0] },
      { name: '', zones: [1] },
      { name: '', zones: [1] },
      { name: '', zones: [1] },
      { name: '', zones: [1] },
      { name: '', zones: [1] },
      { name: '', zones: [1] },
      { name: '', zones: [2] },
      { name: '', zones: [2] },
      { name: '', zones: [2] },
      { name: '', zones: [2] },
      { name: '', zones: [2] },
      { name: '', zones: [2] },
      { name: '', zones: [3] },
      { name: '', zones: [3] },
      { name: '', zones: [3] },
      { name: '', zones: [3] },
      { name: '', zones: [3] },
      { name: '', zones: [3] },
      { name: '', zones: [4] },
      { name: '', zones: [4] },
      { name: '', zones: [4] },
      { name: '', zones: [4] },
      { name: '', zones: [4] },
      { name: '', zones: [4] },
      { name: '', zones: [5] },
      { name: '', zones: [5] },
      { name: '', zones: [5] },
      { name: '', zones: [5] },
      { name: '', zones: [5] },
      { name: '', zones: [5] },
      { name: '', zones: [6] },
      { name: '', zones: [6] },
      { name: '', zones: [6] },
      { name: '', zones: [6] },
      { name: '', zones: [6] },
      { name: '', zones: [6] },
      { name: '', zones: [7] },
      { name: '', zones: [7] },
      { name: '', zones: [7] },
      { name: '', zones: [7] },
      { name: '', zones: [7] },
      { name: '', zones: [7] },
    ])
  })
})
