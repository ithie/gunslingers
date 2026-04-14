import { CARD_TYPES, VALUE_TYPES } from './constants'
import { Effect } from './IEffect'
import { ICardTrigger } from './ICardTrigger'

export default interface ICard {
  name: string
  type: keyof typeof CARD_TYPES
  ruleLabel?: string
  effect?: Effect
  triggers?: ICardTrigger[]
  [VALUE_TYPES.ATK]?: number
  [VALUE_TYPES.DEF]?: number
  [VALUE_TYPES.SPD]?: number
}
