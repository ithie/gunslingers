import { CARD_TYPES } from '../constants'
import { type Effect } from './IEffect'

export default interface ICardEvent {
  name: string
  type: typeof CARD_TYPES.EVENT
  ruleText: string
  effect: Effect
}
