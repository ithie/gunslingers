import { describe, expect, it } from 'vitest'
import iterateCards from './iterateCards'

describe('iterateCards', () => {
  it('should iterate', () => {
    expect(iterateCards(['1', '5', '3', '4'], 2)).toEqual([
      '1',
      '1',
      '5',
      '5',
      '3',
      '3',
      '4',
      '4',
    ])

    expect(iterateCards([{ name: 'e' }, { game: 'd' }], 1)).toEqual([
      { name: 'e' },
      { game: 'd' },
    ])
  })
})
