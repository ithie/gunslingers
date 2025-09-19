import { CARD_TYPES } from '../enums'
import { type Effect } from './IEffect'

export default interface ICardDefense {
  name: string
  type: CARD_TYPES.DEFENSE
  ruleText: string
  effect: Effect
}
