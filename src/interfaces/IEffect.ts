import ICardDefense from './ICardDefense'
import ICardEvent from './ICardEvent'
import ICardModification from './ICardModification'
import ICharacterStats from './ICharacterStats'
import IZoneCard from './IZoneCard'

type WHEN =
  | 'BEFOREHAND' // <= at beginning of each round, only
  | 'INSTANT' // <= directly after putting to the table but only once
  | 'DIRECT' // <= is counted if needed

enum TURN_STEP {
  BEGINNING,
  CARDSDRAWN,
  CARDSPLACED,
  ATTACK,
}

interface ITurnStats {
  turnStarted: boolean
  currentTurnStep: TURN_STEP
  // key is the index of the affected player, the record entry is completly removed after being executed!
  turnEffects: Record<
    string,
    {
      [TURN_STEP.BEGINNING]?: IEffect[]
      [TURN_STEP.CARDSDRAWN]?: IEffect[]
      [TURN_STEP.CARDSPLACED]?: IEffect[]
      [TURN_STEP.ATTACK]?: IEffect[]
    }
  >
  roundNumber: number
  // players that are left their turn in the active round
  playersLeft: Array<number>
  zoneCardsStack: IZoneCard[]
  // the stack with the cards left for the game
  cardStack: Array<ICardDefense | ICardModification | ICardEvent>
  playerHandStacks: Array<Array<ICardDefense | ICardModification | ICardEvent>>
  // first level: player
  // second level: fields
  // third level: card stack on field - last card is the active one
  boardStacks: Array<
    Array<Array<ICardDefense | ICardModification | ICardEvent>>
  >
  activePlayerIndex: number
  endTurn: () => void
}

export default interface IEffect {
  when: WHEN
  condition?: (
    oponent: ICharacterStats,
    own: ICharacterStats,
    turnStats: ITurnStats,
  ) => boolean
  /**
   * Executed from the perspective of the placement.
   *
   * E.g. for Defense-Cards: own is then the oponent!
   */
  execution: ([own, oponent, turnStats]: [
    own: ICharacterStats,
    oponent: ICharacterStats,
    turnStats: ITurnStats,
  ]) => [own: ICharacterStats, oponent: ICharacterStats, turnStats: ITurnStats]
}
