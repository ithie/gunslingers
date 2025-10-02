import { CARD_TYPES, VALUE_TYPES } from '../constants'
import { type Effect } from './IEffect'

export default interface ICharacter {
  name: string
  type: typeof CARD_TYPES.CHARACTER
  [VALUE_TYPES.HP]: number
  [VALUE_TYPES.ATK]: number
  [VALUE_TYPES.DEF]: number
  [VALUE_TYPES.SPD]: number
  effect: Effect
  effectLabel: string
}
