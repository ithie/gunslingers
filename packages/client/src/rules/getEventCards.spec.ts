import { describe, expect, it } from 'vitest'
import getEventCards from './getEventCards'

describe('getEventCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getEventCards()

    expect(draftDeck).toHaveLength(10)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      { name: 'card.event.snakeBite', type: 'EVENT', ruleLabel: 'card.event.snakeBiteRule',
        triggers: [{ on: 'TURN_START', effect: { type: 'DEAL_DAMAGE', amount: 1 } }] },
      { name: 'card.event.snakeBite', type: 'EVENT', ruleLabel: 'card.event.snakeBiteRule',
        triggers: [{ on: 'TURN_START', effect: { type: 'DEAL_DAMAGE', amount: 1 } }] },

      { name: 'card.event.headButt', type: 'EVENT', ruleLabel: 'card.event.headButtRule',
        triggers: [{ on: 'ON_ATTACK', effect: { type: 'PREVENT_ATTACK' } }] },
      { name: 'card.event.headButt', type: 'EVENT', ruleLabel: 'card.event.headButtRule',
        triggers: [{ on: 'ON_ATTACK', effect: { type: 'PREVENT_ATTACK' } }] },

      { name: 'card.event.healing', type: 'EVENT', ruleLabel: 'card.event.healingRule',
        triggers: [{ on: 'ON_PLAY', effect: { type: 'HEAL', amount: 2 } }] },
      { name: 'card.event.healing', type: 'EVENT', ruleLabel: 'card.event.healingRule',
        triggers: [{ on: 'ON_PLAY', effect: { type: 'HEAL', amount: 2 } }] },

      { name: 'card.event.falsePlay', type: 'EVENT', ruleLabel: 'card.event.falsePlayRule',
        triggers: [{ on: 'ON_PLAY', effect: { type: 'FORCE_DISCARD', count: 2 } }] },
      { name: 'card.event.falsePlay', type: 'EVENT', ruleLabel: 'card.event.falsePlayRule',
        triggers: [{ on: 'ON_PLAY', effect: { type: 'FORCE_DISCARD', count: 2 } }] },

      { name: 'card.event.weaken', type: 'EVENT', ATK: -2, DEF: -2, SPD: -2 },
      { name: 'card.event.weaken', type: 'EVENT', ATK: -2, DEF: -2, SPD: -2 },
    ])
  })
})
