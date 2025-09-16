import { CARD_TYPES, VALUE_TYPES } from '../enums'
import ICard from '../interfaces/ICard'
import ICharacterStats from '../interfaces/ICharacterStats'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 3

const cards: ICard[] = [
  {
    name: 'Blocken',
    type: CARD_TYPES.DEFENSE,
    effect: {
      when: 'INSTANT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: (data) => data, // Reduziert den eingehenden Schaden um 2
    },
  },
  {
    name: 'Ducken und Rollen',
    type: CARD_TYPES.DEFENSE,
    effect: {
      when: 'INSTANT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: (data) => data, // Der Angriff läuft ins Leere.
    },
  },
  {
    name: 'Gegenschuss',
    type: CARD_TYPES.DEFENSE,
    effect: {
      when: 'INSTANT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: (data) => data, // Fügt dem Angreifer 1 Schaden zu
    },
  },
  {
    name: 'Querschläger',
    type: CARD_TYPES.DEFENSE,
    effect: {
      when: 'INSTANT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: (data) => data, // Schaden wird auf Angreifer und Verteidiger 50:50 aufgeteilt (aufgerundet)
    },
  },
  {
    name: 'Zeitverzerrung',
    type: CARD_TYPES.DEFENSE,
    effect: {
      when: 'INSTANT',
      condition: (oponent: ICharacterStats, own: ICharacterStats) => {
        return oponent[VALUE_TYPES.SPD] + 2 > own[VALUE_TYPES.SPD]
      },
      execution: (data) => data, // Verhindert den Angriff, wenn der Gegner einen +2 höheren SPD-Wert hat.
    },
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
