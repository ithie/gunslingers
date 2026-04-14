// Fintenkarten — Gunslinger Descriptive Cards-Format (siehe CARD_FORMAT.md)

import { CARD_TYPES, VALUE_TYPES } from '../../../interfaces/src/constants'
import ICard from '../../../interfaces/src/ICard'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 2

const cards: ICard[] = [
  {
    name: 'card.event.snakeBite',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.snakeBiteRule',
    triggers: [{ on: 'TURN_START', effect: { type: 'DEAL_DAMAGE', amount: 1 } }],
  },
  {
    name: 'card.event.headButt',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.headButtRule',
    triggers: [{ on: 'ON_ATTACK', effect: { type: 'PREVENT_ATTACK' } }],
  },
  {
    name: 'card.event.healing',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.healingRule',
    triggers: [{ on: 'ON_PLAY', effect: { type: 'HEAL', amount: 2 } }],
  },
  {
    name: 'card.event.falsePlay',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.falsePlayRule',
    triggers: [{ on: 'ON_PLAY', effect: { type: 'FORCE_DISCARD', count: 2 } }],
  },
  {
    name: 'card.event.weaken',
    type: CARD_TYPES.EVENT,
    [VALUE_TYPES.ATK]: -2,
    [VALUE_TYPES.DEF]: -2,
    [VALUE_TYPES.SPD]: -2,
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
