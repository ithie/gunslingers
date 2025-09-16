import { CARD_TYPES, VALUE_TYPES } from '../enums'
import ICard from '../interfaces/ICard'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 4

const cards: ICard[] = [
  {
    name: 'Fester Griff',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: 2,
  },
  {
    name: 'Deckung',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.DEF]: 2,
  },
  {
    name: 'Schneller Ritt',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.SPD]: 2,
  },
  {
    name: 'Entfesselte Wut',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: 2,
    [VALUE_TYPES.DEF]: -1,
  },
  {
    name: 'Stahlweste',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.DEF]: 3,
    [VALUE_TYPES.SPD]: -2,
  },
  {
    name: 'Flinker Finger',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: 1,
    [VALUE_TYPES.SPD]: 1,
  },
  {
    name: 'Umgekippter Wagen',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.DEF]: 1,
    [VALUE_TYPES.SPD]: -1,
  },
  {
    name: 'Leichtes Kaliber',
    type: CARD_TYPES.MODIFICATION,
    [VALUE_TYPES.ATK]: -2,
    [VALUE_TYPES.SPD]: 2,
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
