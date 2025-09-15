import { VALUE_TYPES } from '../enums'

export default interface ICharacterStats {
  [VALUE_TYPES.HP]: number
  [VALUE_TYPES.ATK]: number
  [VALUE_TYPES.DEF]: number
  [VALUE_TYPES.SPD]: number
}
