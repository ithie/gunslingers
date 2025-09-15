import { VALUE_TYPES } from '../enums'

export const AMOUNT_PER_CARD = 4

export default [
  {
    name: 'Fester Griff',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.ATK]: 2,
      },
    },
  },
  {
    name: 'Deckung',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.DEF]: 2,
      },
    },
  },
  {
    name: 'Schneller Ritt',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.SPD]: 2,
      },
    },
  },
  {
    name: 'Entfesselte Wut',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.ATK]: 2,
        [VALUE_TYPES.DEF]: -1,
      },
    },
  },
  {
    name: 'Stahlweste',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.DEF]: 3,
        [VALUE_TYPES.SPD]: -2,
      },
    },
  },
  {
    name: 'Flinker Finger',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.ATK]: 1,
        [VALUE_TYPES.SPD]: 1,
      },
    },
  },
  {
    name: 'Umgekippter Wagen',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.DEF]: 1,
        [VALUE_TYPES.SPD]: -1,
      },
    },
  },
  {
    name: 'Leichtes Kaliber',
    effect: {
      when: 'BEFOREHAND',
      type: 'PERMANENT',
      values: {
        [VALUE_TYPES.ATK]: -2,
        [VALUE_TYPES.SPD]: 2,
      },
    },
  },
]
