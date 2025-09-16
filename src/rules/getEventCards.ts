import { CARD_TYPES, VALUE_TYPES } from '../enums'
import ICard from '../interfaces/ICard'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 2

const cards: ICard[] = [
  {
    name: 'Schlangenbiss',
    type: CARD_TYPES.EVENT,
    effect: {
      when: 'BEFOREHAND',
      execution: (data) => data, // Der gegnerische Charakter erleidet zu Beginn jeder Runde 1 Schaden
    },
  },
  {
    name: 'Kopfnuss',
    type: CARD_TYPES.EVENT,
    effect: {
      when: 'BEFOREHAND',
      execution: (data) => data, // Der gegnerische Charakter kann nicht angreifen
    },
  },
  {
    name: 'Heilung',
    type: CARD_TYPES.EVENT,
    effect: {
      when: 'INSTANT',
      execution: (data) => data, // Heilt EINMALIG den eigenen Charakter um 2 Lebenspunkte, bis zum Startwert
    },
  },
  {
    name: 'Falsches Spiel',
    type: CARD_TYPES.EVENT,
    effect: {
      when: 'INSTANT',
      execution: (data) => data, // Der Gegner muss einmalig 2 Karten ablegen
    },
  },
  {
    name: 'Schwächung',
    type: CARD_TYPES.EVENT,
    [VALUE_TYPES.ATK]: -2,
    [VALUE_TYPES.DEF]: -2,
    [VALUE_TYPES.SPD]: -2,
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
