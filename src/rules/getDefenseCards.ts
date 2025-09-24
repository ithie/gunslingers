import { CARD_TYPES, VALUE_TYPES } from '../enums'
import ICard from '../interfaces/ICard'
import ICharacterStats from '../interfaces/ICharacterStats'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 3

const cards: ICard[] = [
  {
    name: 'card.defense.blocking',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.blockingRule',
  },
  {
    name: 'card.defense.duckAndRoll',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.duckAndRoleRule',
  },
  {
    name: 'card.defense.counterShot',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.counterShotRule',
  },
  {
    name: 'card.defense.ricochet',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.ricochetRule',
  },
  {
    name: 'card.defense.timeDistortion',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.timeDistortionRule',
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
