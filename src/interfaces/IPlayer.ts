import { VALUE_TYPES } from '../enums'
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
  hand: Array<ICard | undefined>
  currentMaxHand: number
  boardStack: Array<ICard | undefined>[]
  zoneCards: Array<IZoneCard | undefined>
  character: ICharacter
  vCharacter: ICharacterStats
}
