import { CARD_TYPES, VALUE_TYPES } from '../enums'
import { Effect } from './IEffect'

export default interface ICard {
  name: string
  type: CARD_TYPES
  ruleLabel?: string
  effect?: Effect
  [VALUE_TYPES.ATK]?: number
  [VALUE_TYPES.DEF]?: number
  [VALUE_TYPES.SPD]?: number
}
