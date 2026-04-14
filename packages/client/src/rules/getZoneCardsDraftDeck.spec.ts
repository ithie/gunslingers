import { describe, expect, it } from 'vitest'
import getZoneCardsDraftDeck, { ALL_ZONES, ZONE_LABELS } from './getZoneCardsDraftDeck'

describe('getZoneCardsDraftDeck', () => {
  it('should provide a shuffled deck', () => {
    const draftDeck = getZoneCardsDraftDeck()
    expect(draftDeck).toHaveLength(54)
    expect(
      draftDeck.sort((a, b) => {
        // Single-zone cards before "ALLE FELDER"
        if (a.zones.length !== b.zones.length) return a.zones.length - b.zones.length
        if (a.zones[0] < b.zones[0]) return -1
        if (a.zones[0] > b.zones[0]) return 1
        return 0
      }),
    ).toEqual([
      { name: ZONE_LABELS[0], type: 'ZONE', zones: [0] },
      { name: ZONE_LABELS[0], type: 'ZONE', zones: [0] },
      { name: ZONE_LABELS[0], type: 'ZONE', zones: [0] },
      { name: ZONE_LABELS[0], type: 'ZONE', zones: [0] },
      { name: ZONE_LABELS[0], type: 'ZONE', zones: [0] },
      { name: ZONE_LABELS[0], type: 'ZONE', zones: [0] },
      { name: ZONE_LABELS[1], type: 'ZONE', zones: [1] },
      { name: ZONE_LABELS[1], type: 'ZONE', zones: [1] },
      { name: ZONE_LABELS[1], type: 'ZONE', zones: [1] },
      { name: ZONE_LABELS[1], type: 'ZONE', zones: [1] },
      { name: ZONE_LABELS[1], type: 'ZONE', zones: [1] },
      { name: ZONE_LABELS[1], type: 'ZONE', zones: [1] },
      { name: ZONE_LABELS[2], type: 'ZONE', zones: [2] },
      { name: ZONE_LABELS[2], type: 'ZONE', zones: [2] },
      { name: ZONE_LABELS[2], type: 'ZONE', zones: [2] },
      { name: ZONE_LABELS[2], type: 'ZONE', zones: [2] },
      { name: ZONE_LABELS[2], type: 'ZONE', zones: [2] },
      { name: ZONE_LABELS[2], type: 'ZONE', zones: [2] },
      { name: ZONE_LABELS[3], type: 'ZONE', zones: [3] },
      { name: ZONE_LABELS[3], type: 'ZONE', zones: [3] },
      { name: ZONE_LABELS[3], type: 'ZONE', zones: [3] },
      { name: ZONE_LABELS[3], type: 'ZONE', zones: [3] },
      { name: ZONE_LABELS[3], type: 'ZONE', zones: [3] },
      { name: ZONE_LABELS[3], type: 'ZONE', zones: [3] },
      { name: ZONE_LABELS[4], type: 'ZONE', zones: [4] },
      { name: ZONE_LABELS[4], type: 'ZONE', zones: [4] },
      { name: ZONE_LABELS[4], type: 'ZONE', zones: [4] },
      { name: ZONE_LABELS[4], type: 'ZONE', zones: [4] },
      { name: ZONE_LABELS[4], type: 'ZONE', zones: [4] },
      { name: ZONE_LABELS[4], type: 'ZONE', zones: [4] },
      { name: ZONE_LABELS[5], type: 'ZONE', zones: [5] },
      { name: ZONE_LABELS[5], type: 'ZONE', zones: [5] },
      { name: ZONE_LABELS[5], type: 'ZONE', zones: [5] },
      { name: ZONE_LABELS[5], type: 'ZONE', zones: [5] },
      { name: ZONE_LABELS[5], type: 'ZONE', zones: [5] },
      { name: ZONE_LABELS[5], type: 'ZONE', zones: [5] },
      { name: ZONE_LABELS[6], type: 'ZONE', zones: [6] },
      { name: ZONE_LABELS[6], type: 'ZONE', zones: [6] },
      { name: ZONE_LABELS[6], type: 'ZONE', zones: [6] },
      { name: ZONE_LABELS[6], type: 'ZONE', zones: [6] },
      { name: ZONE_LABELS[6], type: 'ZONE', zones: [6] },
      { name: ZONE_LABELS[6], type: 'ZONE', zones: [6] },
      { name: ZONE_LABELS[7], type: 'ZONE', zones: [7] },
      { name: ZONE_LABELS[7], type: 'ZONE', zones: [7] },
      { name: ZONE_LABELS[7], type: 'ZONE', zones: [7] },
      { name: ZONE_LABELS[7], type: 'ZONE', zones: [7] },
      { name: ZONE_LABELS[7], type: 'ZONE', zones: [7] },
      { name: ZONE_LABELS[7], type: 'ZONE', zones: [7] },
      { name: 'zone.allFields', type: 'ZONE', zones: ALL_ZONES },
      { name: 'zone.allFields', type: 'ZONE', zones: ALL_ZONES },
      { name: 'zone.allFields', type: 'ZONE', zones: ALL_ZONES },
      { name: 'zone.allFields', type: 'ZONE', zones: ALL_ZONES },
      { name: 'zone.allFields', type: 'ZONE', zones: ALL_ZONES },
      { name: 'zone.allFields', type: 'ZONE', zones: ALL_ZONES },
    ])
  })
})
