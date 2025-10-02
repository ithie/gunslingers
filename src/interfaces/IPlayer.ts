import { VALUE_TYPES } from '../constants'
import ICard from './ICard'
import ICharacter from './ICharacter'
import ICharacterStats from './ICharacterStats'
import IZoneCard from './IZoneCard'

export default interface IPlayer {
  tmpStats: {
    [VALUE_TYPES.ATK]?: number
    [VALUE_TYPES.DEF]?: number
    [VALUE_TYPES.SPD]?: number
    cannotDefend?: boolean
  }
  cardsPlayed: boolean
  selectedCards: {
    zoneCard: number | null
    handCard: number | null
  }
  name: string
  currentMaxHand: number
  character: ICharacter
  vCharacter: ICharacterStats
}
