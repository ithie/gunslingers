import iterateCards from './iterateCards'

export const AMOUNT_PER_CARD = 2

const cards = [
  {
    name: 'Schlangenbiss',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      execution: () => {}, // Der gegnerische Charakter erleidet zu Beginn jeder Runde 1 Schaden
    },
  },
  {
    name: 'Kopfnuss',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      execution: () => {}, // Der gegnerische Charakter kann nicht angreifen
    },
  },
  {
    name: 'Heilung',
    effect: {
      when: 'INSTANT',
      type: 'INSTANT',
      execution: () => {}, // Heilt EINMALIG den eigenen Charakter um 2 Lebenspunkte, bis zum Startwert
    },
  },
  {
    name: 'Falsches Spiel',
    effect: {
      when: 'INSTANT',
      type: 'INSTANT',
      execution: () => {}, // Der Gegner muss einmalig 2 Karten abwehren
    },
  },
  {
    name: 'Schwächung',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      execution: () => {}, // Der gegnerische Charakter erhält -2 auf alle Werte
    },
  },
]

export default () => iterateCards(cards, AMOUNT_PER_CARD)
