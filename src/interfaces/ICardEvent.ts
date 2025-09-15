import { CARD_TYPES } from '../enums'
import IEffect from './IEffect'

export default interface ICardEvent {
  name: string
  type: CARD_TYPES.EVENT
  ruleText: string
  conditions: []
  effect: IEffect
}
