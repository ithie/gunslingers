import { CARD_TYPES, VALUE_TYPES } from '../constants'

export default interface ICardModification {
  name: string
  type: typeof CARD_TYPES.MODIFICATION
  [VALUE_TYPES.ATK]: number
  [VALUE_TYPES.SPD]: number
  [VALUE_TYPES.DEF]: number
}
