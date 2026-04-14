import { describe, expect, it } from 'vitest'
import getDefenseCards from './getDefenseCards'

describe('getDefenseCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getDefenseCards()

    expect(draftDeck).toHaveLength(15)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      { name: 'card.defense.blocking', type: 'DEFENSE', ruleLabel: 'card.defense.blockingRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'REDUCE_DAMAGE', amount: 2 } }] },
      { name: 'card.defense.blocking', type: 'DEFENSE', ruleLabel: 'card.defense.blockingRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'REDUCE_DAMAGE', amount: 2 } }] },
      { name: 'card.defense.blocking', type: 'DEFENSE', ruleLabel: 'card.defense.blockingRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'REDUCE_DAMAGE', amount: 2 } }] },

      { name: 'card.defense.duckAndRoll', type: 'DEFENSE', ruleLabel: 'card.defense.duckAndRoleRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'NEGATE_DAMAGE' } }] },
      { name: 'card.defense.duckAndRoll', type: 'DEFENSE', ruleLabel: 'card.defense.duckAndRoleRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'NEGATE_DAMAGE' } }] },
      { name: 'card.defense.duckAndRoll', type: 'DEFENSE', ruleLabel: 'card.defense.duckAndRoleRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'NEGATE_DAMAGE' } }] },

      { name: 'card.defense.counterShot', type: 'DEFENSE', ruleLabel: 'card.defense.counterShotRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'COUNTER_DAMAGE', amount: 1 } }] },
      { name: 'card.defense.counterShot', type: 'DEFENSE', ruleLabel: 'card.defense.counterShotRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'COUNTER_DAMAGE', amount: 1 } }] },
      { name: 'card.defense.counterShot', type: 'DEFENSE', ruleLabel: 'card.defense.counterShotRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'COUNTER_DAMAGE', amount: 1 } }] },

      { name: 'card.defense.ricochet', type: 'DEFENSE', ruleLabel: 'card.defense.ricochetRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'SPLIT_DAMAGE' } }] },
      { name: 'card.defense.ricochet', type: 'DEFENSE', ruleLabel: 'card.defense.ricochetRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'SPLIT_DAMAGE' } }] },
      { name: 'card.defense.ricochet', type: 'DEFENSE', ruleLabel: 'card.defense.ricochetRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'SPLIT_DAMAGE' } }] },

      { name: 'card.defense.timeDistortion', type: 'DEFENSE', ruleLabel: 'card.defense.timeDistortionRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'ATTACKER_SPD_DIFF_GTE', value: 2 }, effect: { type: 'NEGATE_DAMAGE' } }] },
      { name: 'card.defense.timeDistortion', type: 'DEFENSE', ruleLabel: 'card.defense.timeDistortionRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'ATTACKER_SPD_DIFF_GTE', value: 2 }, effect: { type: 'NEGATE_DAMAGE' } }] },
      { name: 'card.defense.timeDistortion', type: 'DEFENSE', ruleLabel: 'card.defense.timeDistortionRule',
        triggers: [{ on: 'ON_DEFEND', requires: { type: 'ATTACKER_SPD_DIFF_GTE', value: 2 }, effect: { type: 'NEGATE_DAMAGE' } }] },
    ])
  })
})
