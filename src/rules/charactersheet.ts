import { CARD_TYPES, VALUE_TYPES } from '../enums'
import ICharacter from '../interfaces/ICharacter'

export const gunslingerData: ICharacter = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 3,
  [VALUE_TYPES.DEF]: 2,
  [VALUE_TYPES.SPD]: 1,
  name: 'gunslinger',
  type: CARD_TYPES.CHARACTER,
  effect: {
    when: 'BEFOREHAND',
    label: '',
    execution: (data) => data, // tausche am Anfang zwei Karten gegen einmalig +2
  },
}

export const gamblerData: ICharacter = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 1,
  [VALUE_TYPES.DEF]: 1,
  [VALUE_TYPES.SPD]: 3,
  name: 'gambler',
  type: CARD_TYPES.CHARACTER,
  effect: {
    when: 'BEFOREHAND',
    label: '',
    execution: (data) => data, // tausche am Anfange alle Karten gegen maximal 5 neue - runde ist sofort beendet
  },
}

export const headhunterData: ICharacter = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 2,
  [VALUE_TYPES.DEF]: 1,
  [VALUE_TYPES.SPD]: 2,
  name: 'headhunter',
  type: CARD_TYPES.CHARACTER,
  effect: {
    when: 'INSTANT',
    label: '',
    execution: (data) => data, // Wenn Du erfolgreich angreifst, kann der Gegner in der nächsten Runde keine Abwehrkarten spielen.
  },
}
