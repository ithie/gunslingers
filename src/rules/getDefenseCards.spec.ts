import { describe, expect, it } from 'vitest'
import getDefenseCards from './getDefenseCards'

describe('getDefenseCards', () => {
  it('should provide a deck of event cards', () => {
    const draftDeck = getDefenseCards()

    expect(draftDeck).toHaveLength(15)

    expect(JSON.parse(JSON.stringify(draftDeck))).toEqual([
      {
        name: 'card.defense.blocking',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.blockingRule',
      },
      {
        name: 'card.defense.blocking',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.blockingRule',
      },
      {
        name: 'card.defense.blocking',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.blockingRule',
      },
      {
        name: 'card.defense.duckAndRoll',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.duckAndRoleRule',
      },
      {
        name: 'card.defense.duckAndRoll',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.duckAndRoleRule',
      },
      {
        name: 'card.defense.duckAndRoll',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.duckAndRoleRule',
      },
      {
        name: 'card.defense.counterShot',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.counterShotRule',
      },
      {
        name: 'card.defense.counterShot',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.counterShotRule',
      },
      {
        name: 'card.defense.counterShot',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.counterShotRule',
      },
      {
        name: 'card.defense.ricochet',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.ricochetRule',
      },
      {
        name: 'card.defense.ricochet',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.ricochetRule',
      },
      {
        name: 'card.defense.ricochet',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.ricochetRule',
      },
      {
        name: 'card.defense.timeDistortion',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.timeDistortionRule',
      },
      {
        name: 'card.defense.timeDistortion',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.timeDistortionRule',
      },
      {
        name: 'card.defense.timeDistortion',
        type: 'DEFENSE',
        ruleLabel: 'card.defense.timeDistortionRule',
      },
    ])
  })
})
