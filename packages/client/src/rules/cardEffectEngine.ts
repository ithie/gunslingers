import ICard from '../../../interfaces/src/ICard'
import { CardEffectDescriptor, ICardTrigger } from '../../../interfaces/src/ICardTrigger'

// ---------------------------------------------------------------------------
// Interne Hilfsfunktion
// ---------------------------------------------------------------------------

function findTrigger(card: ICard, on: ICardTrigger['on']): ICardTrigger | undefined {
  return card.triggers?.find((t) => t.on === on)
}

// ---------------------------------------------------------------------------
// Abwehrkarten filtern
//
// Ersetzt den hardcodierten DEFENSE_CARDS_REQUIRING_SPD3-Set.
// Eine Karte wird ausgeschlossen, wenn ihre ON_DEFEND-Bedingung nicht erfüllt ist.
// ---------------------------------------------------------------------------

export function filterDefenseCards(cards: ICard[], defenderSpd: number): ICard[] {
  return cards.filter((card) => {
    const trigger = findTrigger(card, 'ON_DEFEND')
    if (!trigger?.requires) return true
    const req = trigger.requires
    if (req.type === 'MIN_SPD') return defenderSpd >= req.value
    return true
  })
}

// ---------------------------------------------------------------------------
// Abwehr auflösen
//
// Ersetzt die if-else-Kette in applyDamage().
// Gibt zurück: wie viel Schaden der Verteidiger und der Angreifer erhält.
// ---------------------------------------------------------------------------

export interface DefenseResult {
  defenderDamage: number
  attackerDamage: number
}

export function resolveDefense(
  defenseCard: ICard | null,
  rawDamage: number,
  defenderSpd: number,
  attackerSpd: number,
): DefenseResult {
  const noop: DefenseResult = { defenderDamage: rawDamage, attackerDamage: 0 }

  if (!defenseCard) return noop

  const trigger = findTrigger(defenseCard, 'ON_DEFEND')
  if (!trigger) return noop

  // Bedingung prüfen
  if (trigger.requires) {
    const req = trigger.requires
    if (req.type === 'MIN_SPD' && defenderSpd < req.value) return noop
    if (req.type === 'ATTACKER_SPD_DIFF_GTE' && attackerSpd - defenderSpd < req.value) return noop
  }

  return applyDefenseEffect(trigger.effect, rawDamage)
}

function applyDefenseEffect(effect: CardEffectDescriptor, rawDamage: number): DefenseResult {
  switch (effect.type) {
    case 'NEGATE_DAMAGE':
      return { defenderDamage: 0, attackerDamage: 0 }

    case 'REDUCE_DAMAGE':
      return { defenderDamage: Math.max(0, rawDamage - effect.amount), attackerDamage: 0 }

    case 'SPLIT_DAMAGE': {
      const half = Math.ceil(rawDamage / 2)
      return { defenderDamage: half, attackerDamage: half }
    }

    case 'COUNTER_DAMAGE':
      return { defenderDamage: rawDamage, attackerDamage: effect.amount }

    default:
      return { defenderDamage: rawDamage, attackerDamage: 0 }
  }
}

// ---------------------------------------------------------------------------
// TURN_START: Schaden durch liegende Karten (z.B. Schlangenbiss)
// ---------------------------------------------------------------------------

export function resolveTurnStartDamage(boardStacks: unknown[][]): number {
  let damage = 0
  for (const stack of boardStacks) {
    if (!stack?.length) continue
    const card = stack[0] as ICard
    const trigger = findTrigger(card, 'TURN_START')
    if (trigger?.effect.type === 'DEAL_DAMAGE') {
      damage += trigger.effect.amount
    }
  }
  return damage
}

// ---------------------------------------------------------------------------
// ON_ATTACK: Angriff verhindert? (z.B. Kopfnuss)
// ---------------------------------------------------------------------------

export function isAttackPrevented(boardStacks: unknown[][]): boolean {
  for (const stack of boardStacks) {
    if (!stack?.length) continue
    const card = stack[0] as ICard
    const trigger = findTrigger(card, 'ON_ATTACK')
    if (trigger?.effect.type === 'PREVENT_ATTACK') return true
  }
  return false
}

// ---------------------------------------------------------------------------
// ON_PLAY: Soforteffekt beim Ausspielen
// ---------------------------------------------------------------------------

export type OnPlayResult =
  | { type: 'HEAL'; amount: number }
  | { type: 'FORCE_DISCARD'; count: number }
  | null

export function resolveOnPlay(card: ICard): OnPlayResult {
  const trigger = findTrigger(card, 'ON_PLAY')
  if (!trigger) return null

  switch (trigger.effect.type) {
    case 'HEAL':          return { type: 'HEAL', amount: trigger.effect.amount }
    case 'FORCE_DISCARD': return { type: 'FORCE_DISCARD', count: trigger.effect.count }
    default:              return null
  }
}
