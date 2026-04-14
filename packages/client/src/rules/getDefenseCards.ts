// Abwehrkarten — Gunslinger Descriptive Cards-Format (siehe CARD_FORMAT.md)

import { CARD_TYPES } from '../../../interfaces/src/constants'
import ICard from '../../../interfaces/src/ICard'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 3

const cards: ICard[] = [
  {
    name: 'card.defense.blocking',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.blockingRule',
    triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'REDUCE_DAMAGE', amount: 2 } }],
  },
  {
    name: 'card.defense.duckAndRoll',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.duckAndRoleRule',
    triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'NEGATE_DAMAGE' } }],
  },
  {
    name: 'card.defense.counterShot',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.counterShotRule',
    triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'COUNTER_DAMAGE', amount: 1 } }],
  },
  {
    name: 'card.defense.ricochet',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.ricochetRule',
    triggers: [{ on: 'ON_DEFEND', requires: { type: 'MIN_SPD', value: 3 }, effect: { type: 'SPLIT_DAMAGE' } }],
  },
  {
    name: 'card.defense.timeDistortion',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.timeDistortionRule',
    triggers: [{ on: 'ON_DEFEND', requires: { type: 'ATTACKER_SPD_DIFF_GTE', value: 2 }, effect: { type: 'NEGATE_DAMAGE' } }],
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
