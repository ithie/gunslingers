import { describe, expect, it } from 'vitest'
import shuffle from './shuffle'

describe('zone cards draft stack', () => {
  it('should provide a shuffled deck', () => {
    const toBeSorted = [0, 1, 2, 3, 4, 5, 6]

    const shuffled = shuffle(toBeSorted)

    expect(shuffled).toHaveLength(7)
    expect(shuffled).toHaveLength(toBeSorted.length)
    expect(shuffled).not.toEqual(toBeSorted)
    expect(shuffled.sort()).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(shuffled).not.toEqual(shuffle(toBeSorted))
  })
})
