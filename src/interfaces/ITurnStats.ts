import IEffect from './IEffect'

export enum TURN_STEP {
  BEGINNING,
  CARDSDRAWN,
  CARDSPLACED,
  ATTACK,
}

export default interface ITurnStats {
  turnStarted: boolean
  currentTurnStep: TURN_STEP
  // key is the index of the affected player, the record entry is completly removed after being executed!
  turnEffects:
    | Record<
        string,
        {
          [TURN_STEP.BEGINNING]?: IEffect[]
          [TURN_STEP.CARDSDRAWN]?: IEffect[]
          [TURN_STEP.CARDSPLACED]?: IEffect[]
          [TURN_STEP.ATTACK]?: IEffect[]
        }
      >
    | undefined
  roundNumber: number
  // players that are left their turn in the active round
  playersLeft: Array<number>
  activePlayerIndex: number
  endTurn: () => void
}
