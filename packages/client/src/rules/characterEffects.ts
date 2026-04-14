import ICard from '../../../interfaces/src/ICard'
import IGameTable from '../../../interfaces/src/IGameTable'
import { VALUE_TYPES } from '../../../interfaces/src/constants'

// ---------------------------------------------------------------------------
// Trigger-Typen: Wann wird ein Effekt ausgelöst?
// ---------------------------------------------------------------------------

export type EffectTrigger = 'TURN_START' | 'AFTER_ATTACK'

// ---------------------------------------------------------------------------
// Kontext: was der Effekt "anfassen" darf
// ---------------------------------------------------------------------------

export interface EffectContext {
  playerIndex: number
  opponentIndex: number
  gameTable: IGameTable
  handCards: Record<'zone' | 'hand', (ICard | undefined)[][]>

  /** Nur bei AFTER_ATTACK: wie viel Schaden wurde tatsächlich gemacht */
  attackDamageDealt?: number

  // --- Mutations -------------------------------------------------------

  /** Temporären Stat-Bonus für diesen Zug setzen */
  setTmpStat(
    playerIndex: number,
    key: typeof VALUE_TYPES[keyof typeof VALUE_TYPES] | 'cannotDefend',
    value: number | boolean,
  ): void

  /** Eine Handkarte abwerfen (Karte verschwindet) */
  discardHandCard(playerIndex: number, cardIndex: number): void

  /** Eine Handkarte in den Nachziehstapel zurückmischen */
  returnCardToDeck(playerIndex: number, cardIndex: number): void

  /** Eine Karte vom Nachziehstapel nachziehen */
  drawCard(playerIndex: number): void

  /** Zug sofort beenden (kein Angriff mehr möglich) */
  endTurnImmediately(): void

  /**
   * UI öffnen, in der der Spieler N Karten aus seiner Hand auswählt.
   * Nach Bestätigung wird onConfirm mit den gewählten Indizes aufgerufen.
   */
  showSelectCardsUI(
    playerIndex: number,
    count: number,
    headline: string,
    onConfirm: (selectedIndices: number[]) => void,
  ): void
}

// ---------------------------------------------------------------------------
// Effekt-Definition
// ---------------------------------------------------------------------------

export interface CharacterEffectDefinition {
  /** Wann löst der Effekt aus */
  trigger: EffectTrigger

  /**
   * true  = Spieler muss bewusst aktivieren (Button erscheint in PlayerZone)
   * false = läuft automatisch
   */
  optional: boolean

  /** Label für den Aktivierungsbutton (nur bei optional: true) */
  actionLabel?: string

  execute(ctx: EffectContext): void
}

// ---------------------------------------------------------------------------
// Registry: Character-Name → Effekt-Definition
//
// Neue Charaktere oder Regel-Varianten können hier einfach eingetragen
// werden, ohne die Spiellogik selbst anfassen zu müssen.
// ---------------------------------------------------------------------------

export const CHARACTER_EFFECTS: Record<string, CharacterEffectDefinition> = {

  'character.gunslinger': {
    trigger: 'TURN_START',
    optional: true,
    actionLabel: 'Tausche 2 Karten → +2 ATK',
    execute(ctx) {
      ctx.showSelectCardsUI(
        ctx.playerIndex,
        2,
        'Wähle 2 Karten, die Du tauschst (einmalig +2 ATK)',
        (indices) => {
          indices.forEach((i) => ctx.discardHandCard(ctx.playerIndex, i))
          indices.forEach(() => ctx.drawCard(ctx.playerIndex))
          ctx.setTmpStat(ctx.playerIndex, VALUE_TYPES.ATK, 2)
        },
      )
    },
  },

  'character.gambler': {
    trigger: 'TURN_START',
    optional: true,
    actionLabel: 'Alle Karten tauschen (Zug endet sofort)',
    execute(ctx) {
      const hand = ctx.handCards.hand[ctx.playerIndex]
      const cardCount = hand.filter(Boolean).length

      hand.forEach((card, i) => {
        if (card) ctx.returnCardToDeck(ctx.playerIndex, i)
      })

      const drawCount = Math.min(cardCount, 5)
      for (let i = 0; i < drawCount; i++) {
        ctx.drawCard(ctx.playerIndex)
      }

      ctx.endTurnImmediately()
    },
  },

  'character.headhunter': {
    trigger: 'AFTER_ATTACK',
    optional: false,
    execute(ctx) {
      // Nur bei erfolgreichem Angriff (Schaden > 0)
      if ((ctx.attackDamageDealt ?? 0) > 0) {
        ctx.setTmpStat(ctx.opponentIndex, 'cannotDefend', true)
      }
    },
  },
}
