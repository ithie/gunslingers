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
  gameEnds: boolean
  activeTurn: {
    zoneCard: number | null
    handCard: number | null
    cardsPlayed: boolean
    attacked: boolean
  }
  turnStats: ITurnStats
  players: IPlayer[]
}
