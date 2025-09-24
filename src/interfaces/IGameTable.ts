import ICard from './ICard'
import IPlayer from './IPlayer'
import ITurnStats from './ITurnStats'
import IZoneCard from './IZoneCard'

export default interface IGameTable {
  draftDeck: ICard[]
  zoneDraftDeck: IZoneCard[]
  rules: {
    startHand: number // Anzahl der Karten zum Spielanfang
    zoneCards: {
      alwaysFull: boolean // entweder immer auffüllen oder erst alle wegmachen
      maxZoneCards: number // Anzahl der vor dem Spieler liegenden Karten
    }
  }
  showDamage?: {
    damage: number
    next: (defenseCard?: ICard) => void
  }
  gameEnds: boolean
  activeTurn: {
    attacked: boolean
  }
  turnStats: ITurnStats
  players: IPlayer[]
}
