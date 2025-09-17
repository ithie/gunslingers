import { CARD_TYPES, VALUE_TYPES } from '../enums'
import ICard from '../interfaces/ICard'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 4

const cards: ICard[] = [
  {
    name: 'card.modification.firmGrip',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: 2,
  },
  {
    name: 'card.modification.cover',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.DEF]: 2,
  },
  {
    name: 'card.modification.rodeFaster',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.SPD]: 2,
  },
  {
    name: 'card.modification.unleashedRage',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: 2,
    [VALUE_TYPES.DEF]: -1,
  },
  {
    name: 'card.modification.steelVest',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.DEF]: 3,
    [VALUE_TYPES.SPD]: -2,
  },
  {
    name: 'card.modification.nimbleFinger',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: 1,
    [VALUE_TYPES.SPD]: 1,
  },
  {
    name: 'card.modification.overturnedCarriage',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.DEF]: 1,
    [VALUE_TYPES.SPD]: -1,
  },
  {
    name: 'card.modification.lightCaliber',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: -2,
    [VALUE_TYPES.SPD]: 2,
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
