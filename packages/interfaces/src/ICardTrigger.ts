// Gunslinger Descriptive Cards — Trigger-Typen (siehe CARD_FORMAT.md)

/** Wann löst der Trigger aus */
export type CardTriggerType =
  | 'ON_PLAY'     // sofort beim Ausspielen
  | 'TURN_START'  // zu Beginn des Zuges des Karteninhabers
  | 'ON_ATTACK'   // bevor der Karteninhaber angreift (kann Angriff verhindern)
  | 'ON_DEFEND'   // wenn der Karteninhaber angegriffen wird

/** Bedingung, die vor der Ausführung geprüft wird */
export type CardRequirement =
  | { type: 'MIN_SPD'; value: number }             // Verteidiger braucht mind. X GES
  | { type: 'ATTACKER_SPD_DIFF_GTE'; value: number } // Angreifer hat mind. X mehr GES als Verteidiger

/** Was der Effekt bewirkt */
export type CardEffectDescriptor =
  | { type: 'DEAL_DAMAGE'; amount: number }
  | { type: 'HEAL'; amount: number }
  | { type: 'REDUCE_DAMAGE'; amount: number }
  | { type: 'NEGATE_DAMAGE' }
  | { type: 'SPLIT_DAMAGE' }          // Schaden 50:50 auf beide Spieler (aufgerundet)
  | { type: 'COUNTER_DAMAGE'; amount: number } // Schaden geht durch + Angreifer erhält N Schaden
  | { type: 'PREVENT_ATTACK' }
  | { type: 'FORCE_DISCARD'; count: number }

export interface ICardTrigger {
  on: CardTriggerType
  requires?: CardRequirement
  effect: CardEffectDescriptor
}
