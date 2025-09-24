import { type Effect } from './IEffect'

export enum TURN_STEP {
  BEGINNING,
  CARDSDRAWN,
  CARDSPLACED,
  ATTACK,
  DEFEND,
}

export default interface ITurnStats {
  turnStarted: boolean
  currentTurnStep: TURN_STEP
  // key is the index of the affected player, the record entry is completly removed after being executed!
  turnEffects:
    | Record<
        string,
        {
          [TURN_STEP.BEGINNING]?: Effect[]
          [TURN_STEP.CARDSDRAWN]?: Effect[]
          [TURN_STEP.CARDSPLACED]?: Effect[]
          [TURN_STEP.ATTACK]?: Effect[]
          [TURN_STEP.DEFEND]?: Effect[]
        }
      >
    | undefined
  roundNumber: number
  // players that are left their turn in the active round
  playersLeft: Array<number>
  activePlayerIndex: number
  endTurn: () => void
}
