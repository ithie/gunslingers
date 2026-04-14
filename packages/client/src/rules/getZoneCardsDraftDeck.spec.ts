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
      { name: '', type: 'ZONE', zones: [0] },
      { name: '', type: 'ZONE', zones: [0] },
      { name: '', type: 'ZONE', zones: [0] },
      { name: '', type: 'ZONE', zones: [0] },
      { name: '', type: 'ZONE', zones: [0] },
      { name: '', type: 'ZONE', zones: [0] },
      { name: '', type: 'ZONE', zones: [1] },
      { name: '', type: 'ZONE', zones: [1] },
      { name: '', type: 'ZONE', zones: [1] },
      { name: '', type: 'ZONE', zones: [1] },
      { name: '', type: 'ZONE', zones: [1] },
      { name: '', type: 'ZONE', zones: [1] },
      { name: '', type: 'ZONE', zones: [2] },
      { name: '', type: 'ZONE', zones: [2] },
      { name: '', type: 'ZONE', zones: [2] },
      { name: '', type: 'ZONE', zones: [2] },
      { name: '', type: 'ZONE', zones: [2] },
      { name: '', type: 'ZONE', zones: [2] },
      { name: '', type: 'ZONE', zones: [3] },
      { name: '', type: 'ZONE', zones: [3] },
      { name: '', type: 'ZONE', zones: [3] },
      { name: '', type: 'ZONE', zones: [3] },
      { name: '', type: 'ZONE', zones: [3] },
      { name: '', type: 'ZONE', zones: [3] },
      { name: '', type: 'ZONE', zones: [4] },
      { name: '', type: 'ZONE', zones: [4] },
      { name: '', type: 'ZONE', zones: [4] },
      { name: '', type: 'ZONE', zones: [4] },
      { name: '', type: 'ZONE', zones: [4] },
      { name: '', type: 'ZONE', zones: [4] },
      { name: '', type: 'ZONE', zones: [5] },
      { name: '', type: 'ZONE', zones: [5] },
      { name: '', type: 'ZONE', zones: [5] },
      { name: '', type: 'ZONE', zones: [5] },
      { name: '', type: 'ZONE', zones: [5] },
      { name: '', type: 'ZONE', zones: [5] },
      { name: '', type: 'ZONE', zones: [6] },
      { name: '', type: 'ZONE', zones: [6] },
      { name: '', type: 'ZONE', zones: [6] },
      { name: '', type: 'ZONE', zones: [6] },
      { name: '', type: 'ZONE', zones: [6] },
      { name: '', type: 'ZONE', zones: [6] },
      { name: '', type: 'ZONE', zones: [7] },
      { name: '', type: 'ZONE', zones: [7] },
      { name: '', type: 'ZONE', zones: [7] },
      { name: '', type: 'ZONE', zones: [7] },
      { name: '', type: 'ZONE', zones: [7] },
      { name: '', type: 'ZONE', zones: [7] },
    ])
  })
})
