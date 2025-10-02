import { CARD_TYPES, VALUE_TYPES } from '../constants'
import ICard from '../interfaces/ICard'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 2

const cards: ICard[] = [
  {
    name: 'card.event.snakeBite',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.snakeBiteRule',
  },
  {
    name: 'card.event.headButt',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.headButtRule',
  },
  {
    name: 'card.event.healing',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.healingRule',
  },
  {
    name: 'card.event.falsePlay',
    type: CARD_TYPES.EVENT,
    ruleLabel: 'card.event.falsePlayRule',
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
