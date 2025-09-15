import { CARD_TYPES } from '../enums'
import IEffect from './IEffect'

export default interface ICardDefense {
  name: string
  type: CARD_TYPES.DEFENSE
  ruleText: string
  conditions: []
  effect: IEffect
}
