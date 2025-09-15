import { describe, expect, it } from 'vitest'
import getDraftDeck from './getDraftDeck'

describe('getDraftDeck', () => {
  it('should provide shuffled deck', () => {
    const draftDeck = getDraftDeck()

    expect(draftDeck).toHaveLength(57)
  })
})
