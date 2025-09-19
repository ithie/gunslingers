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
    effect: (data) => data, // Reduziert den eingehenden Schaden um 2
  },
  {
    name: 'card.defense.duckAndRoll',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.duckAndRoleRule',
    effect: (data) => data, // Der Angriff läuft ins Leere.
  },
  {
    name: 'card.defense.counterShot',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.counterShotRule',
    effect: (data) => data, // Fügt dem Angreifer 1 Schaden zu
  },
  {
    name: 'card.defense.ricochet',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.ricochetRule',
    effect: (data) => data, // Schaden wird auf Angreifer und Verteidiger 50:50 aufgeteilt (aufgerundet)
  },
  {
    name: 'card.defense.timeDistortion',
    type: CARD_TYPES.DEFENSE,
    ruleLabel: 'card.defense.timeDistortionRule',
    effect: (data) => data, // Verhindert den Angriff, wenn der Gegner einen +2 höheren SPD-Wert hat.
  },
]

export default () => iterateCards<ICard>(cards, AMOUNT_PER_CARD)
