import { CARD_TYPES } from '../enums'
import { type Effect } from './IEffect'

export default interface ICardEvent {
  name: string
  type: CARD_TYPES.EVENT
  ruleText: string
  effect: Effect
}
