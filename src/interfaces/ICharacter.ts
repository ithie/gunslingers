import { CARD_TYPES, VALUE_TYPES } from '../enums'
import { type Effect } from './IEffect'

export default interface ICharacter {
  name: string
  type: CARD_TYPES.CHARACTER
  [VALUE_TYPES.HP]: number
  [VALUE_TYPES.ATK]: number
  [VALUE_TYPES.DEF]: number
  [VALUE_TYPES.SPD]: number
  effect: Effect
  effectLabel: string
}
