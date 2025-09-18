import { describe, expect, it } from 'vitest'
import getEventCards from './getEventCards'

describe('getEventCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getEventCards()

    expect(draftDeck).toHaveLength(10)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      {
        name: 'card.event.snakeBite',
        type: 'EVENT',
        ruleLabel: 'card.event.snakeBiteRule',
        effect: { when: 'BEFOREHAND' },
      },
      {
        name: 'card.event.snakeBite',
        type: 'EVENT',
        ruleLabel: 'card.event.snakeBiteRule',
        effect: { when: 'BEFOREHAND' },
      },
      {
        name: 'card.event.headButt',
        type: 'EVENT',
        ruleLabel: 'card.event.headButtRule',
        effect: { when: 'BEFOREHAND' },
      },
      {
        name: 'card.event.headButt',
        type: 'EVENT',
        ruleLabel: 'card.event.headButtRule',
        effect: { when: 'BEFOREHAND' },
      },
      {
        name: 'card.event.healing',
        type: 'EVENT',
        ruleLabel: 'card.event.healingRule',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'card.event.healing',
        type: 'EVENT',
        ruleLabel: 'card.event.healingRule',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'card.event.falsePlay',
        type: 'EVENT',
        ruleLabel: 'card.event.falsePlayRule',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'card.event.falsePlay',
        type: 'EVENT',
        ruleLabel: 'card.event.falsePlayRule',
        effect: { when: 'INSTANT' },
      },
      {
        name: 'card.event.weaken',
        type: 'EVENT',
        ATK: -2,
        DEF: -2,
        SPD: -2,
      },
      {
        name: 'card.event.weaken',
        type: 'EVENT',
        ATK: -2,
        DEF: -2,
        SPD: -2,
      },
    ])
  })
})
