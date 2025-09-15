import { VALUE_TYPES } from '../enums'
import ICharacterStats from '../interfaces/ICharacterStats'
import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 3

const cards = [
  {
    name: 'Blocken',
    effect: {
      when: 'INSTANT',
      type: 'INSTANT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: () => {}, // Reduziert den eingehenden Schaden um 2
    },
  },
  {
    name: 'Ducken und Rollen',
    effect: {
      when: 'INSTANT',
      type: 'INSTANT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: () => {}, // Der Angriff läuft ins Leere.
    },
  },
  {
    name: 'Gegenschuss',
    effect: {
      when: 'INSTANT',
      type: 'PERMANENT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: () => {}, // Fügt dem Angreifer 1 Schaden zu
    },
  },
  {
    name: 'Querschläger',
    effect: {
      when: 'INSTANT',
      type: 'PERMANENT',
      condition: (characterStats: ICharacterStats) => {
        return characterStats[VALUE_TYPES.SPD] >= 3
      },
      execution: () => {}, // Schaden wird auf Angreifer und Verteidiger 50:50 aufgeteilt (aufgerundet)
    },
  },
  {
    name: 'Zeitverzerrung',
    effect: {
      when: 'INSTANT',
      type: 'PERMANENT',
      condition: (oponent: ICharacterStats, own: ICharacterStats) => {
        return oponent[VALUE_TYPES.SPD] + 2 > own[VALUE_TYPES.SPD]
      },
      execution: () => {}, // Verhindert den Angriff, wenn der Gegner einen +2 höheren SPD-Wert hat.
    },
  },
]

export default () => iterateCards(cards, AMOUNT_PER_CARD)
