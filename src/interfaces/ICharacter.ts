import { CARD_TYPES } from '../enums'
import IEffect from './IEffect'

export default interface ICharacter {
  name: string
  type: CARD_TYPES.CHARACTER
  effect: IEffect
}
