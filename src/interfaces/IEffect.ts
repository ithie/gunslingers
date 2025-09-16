import ICardDefense from './ICardDefense'
import ICardEvent from './ICardEvent'
import ICardModification from './ICardModification'
import ICharacterStats from './ICharacterStats'
import ITurnStats from './ITurnStats'
import IZoneCard from './IZoneCard'

type WHEN =
  | 'BEFOREHAND' // <= at beginning of each round, only
  | 'INSTANT' // <= directly after putting to the table but only once
  | 'DIRECT' // <= is counted if needed

export default interface IEffect {
  when: WHEN
  label?: string
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
