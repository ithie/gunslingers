import ICard from './ICard'
import ICharacter from './ICharacter'
import ICharacterStats from './ICharacterStats'
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
  activeTurn: {
    zoneCard: number | null
    handCard: number | null
    cardsPlayed: boolean
    attacked: boolean
  }
  turnStats: ITurnStats
  players: {
    name: string
    hand: ICard[]
    // first level: fields
    // second level: card stack on field - last card is the active one on the stack
    boardStack: ICard[][]
    zoneCards: IZoneCard[]
    character: ICharacter
    vCharacter: ICharacterStats
  }[]
}
