import { CARD_TYPES } from '../constants'
import { type Effect } from './IEffect'

export default interface ICardDefense {
  name: string
  type: typeof CARD_TYPES.DEFENSE
  ruleText: string
  effect: Effect
}
