import { VALUE_TYPES } from '../enums'

export const gunslingerData = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 3,
  [VALUE_TYPES.DEF]: 2,
  [VALUE_TYPES.SPD]: 1,
  effect: {
    when: 'BEFOREHAND',
    type: 'DIALOG',
    label: '',
    execution: () => {}, // tausche am Anfang zwei Karten gegen einmalig +2
  },
}

export const gamblerData = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 1,
  [VALUE_TYPES.DEF]: 1,
  [VALUE_TYPES.SPD]: 3,
  effect: {
    when: 'BEFOREHAND',
    type: 'DIRECTACTION',
    label: '',
    execution: () => {}, // tausche am Anfange alle Karten gegen maximal 5 neue - runde ist sofort beendet
  },
}

export const headhunterData = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 2,
  [VALUE_TYPES.DEF]: 1,
  [VALUE_TYPES.SPD]: 2,
  effect: {
    when: 'AFTERATTACK',
    type: 'NEXTROUND',
    label: '',
    execution: () => {}, // Wenn Du erfolgreich angreifst, kann der Gegner in der nächsten Runde keine Abwehrkarten spielen.
  },
}
