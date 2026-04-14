import { Ref, ref, unref } from 'vue'
import IGameTable from '../../../../interfaces/src/IGameTable'
import getDraftDeck from '../../rules/getDraftDeck'
import getZoneCardsDraftDeck from '../../rules/getZoneCardsDraftDeck'
import ICharacter from '../../../../interfaces/src/ICharacter'
import { CARD_TYPES, VALUE_TYPES } from '../../../../interfaces/src/constants'
import { TURN_STEP } from '../../../../interfaces/src/ITurnStats'
import ICard from '../../../../interfaces/src/ICard'
import IPlayer from '../../../../interfaces/src/IPlayer'
import useLayerManager from '../../components/LayerManager/useLayerManager'
import useHandCards from '../../components/HandCards/useHandCards'
import IZoneCard from '../../../../interfaces/src/IZoneCard'
import usePlayground from '../../components/Playground/usePlayground'
import shuffle from '../../rules/shuffle'
import {
  gunslingerData,
  gamblerData,
  headhunterData,
} from '../../rules/charactersheet'
import { CHARACTER_EFFECTS } from '../../rules/characterEffects'

// ---------------------------------------------------------------------------
// Netzwerk-Typen
// ---------------------------------------------------------------------------

export type NetworkMessage =
  | { type: 'GAME_STATE'; state: SerializedGameState }
  | { type: 'ACTION'; action: GuestAction }
  | { type: 'REQUEST_DEFENSE'; damage: number; defenseCards: ICard[] }
  | { type: 'DEFENSE_CHOICE'; card: ICard | null }
  | { type: 'REQUEST_DISCARD'; count: number }
  | { type: 'DISCARD_CHOICE'; cardIndices: number[] }
  | { type: 'READY' }

export type GuestAction =
  | { type: 'SET_ZONE_CARD'; cardIndex: number }
  | { type: 'SET_HAND_CARD'; cardIndex: number }
  | { type: 'PLAY_CARDS'; zoneCardIndex: number; handCardIndex: number }
  | { type: 'ATTACK' }
  | { type: 'END_TURN' }

// ---------------------------------------------------------------------------
// Serialisierungs-Typen
// ---------------------------------------------------------------------------

type SerializablePlayer = Omit<IPlayer, 'character'> & { characterName: string }

interface SerializedGameState {
  gameTable: {
    draftDeck: ICard[]
    zoneDraftDeck: IZoneCard[]
    rules: IGameTable['rules']
    gameEnds: boolean
    isDraw: boolean
    roundStartInfo?: IGameTable['roundStartInfo']
    activeTurn: IGameTable['activeTurn']
    turnStats: {
      turnStarted: boolean
      currentTurnStep: number
      roundNumber: number
      playersLeft: number[]
      activePlayerIndex: number
    }
    players: SerializablePlayer[]
  }
  handCards: Record<'zone' | 'hand', (ICard | undefined)[][]>
  boardStack: Array<Array<(ICard | undefined)[]>>
}

// ---------------------------------------------------------------------------
// Charakter-Registry (für Deserialisierung)
// ---------------------------------------------------------------------------

const CHARACTER_REGISTRY: Record<string, ICharacter> = {
  'character.gunslinger': gunslingerData,
  'character.gambler': gamblerData,
  'character.headhunter': headhunterData,
}

// ---------------------------------------------------------------------------
// Abwehrkarten mit SPD-Voraussetzung (SPD ≥ 3)
// ---------------------------------------------------------------------------

const DEFENSE_CARDS_REQUIRING_SPD3 = new Set([
  'card.defense.blocking',
  'card.defense.duckAndRoll',
  'card.defense.counterShot',
  'card.defense.ricochet',
])

/** Filtert Abwehrkarten nach den SPD-Anforderungen des Verteidigers */
const filterDefenseCards = (cards: ICard[], defenderSpd: number): ICard[] =>
  cards.filter((c) => {
    if (DEFENSE_CARDS_REQUIRING_SPD3.has(c.name)) return defenderSpd >= 3
    return true // Ausweichen hat eigene Logik, aber kann immer gespielt werden
  })

// ---------------------------------------------------------------------------
// Modul-Level State (Singleton)
// ---------------------------------------------------------------------------

const gameTable: Ref<IGameTable> = ref({
  draftDeck: getDraftDeck(),
  zoneDraftDeck: getZoneCardsDraftDeck(),
  rules: {
    startHand: 7,
    zoneCards: { alwaysFull: false, maxZoneCards: 4 },
  },
  gameEnds: false,
  isDraw: false,
  activeTurn: { attacked: false },
  turnStats: {
    turnStarted: false,
    currentTurnStep: TURN_STEP.BEGINNING,
    turnEffects: undefined,
    roundNumber: 0,
    playersLeft: [],
    activePlayerIndex: 0,
    endTurn: () => endTurn(),
  },
  players: [],
})

const localPlayerIndex = ref<number>(-1)
let sendNetworkMessage: ((msg: NetworkMessage) => void) | null = null
let pendingDefenseResolve: ((card: ICard | null) => void) | null = null
let pendingDiscardResolve: ((indices: number[]) => void) | null = null

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

const getNextPlayer = () => {
  let next = gameTable.value.turnStats.activePlayerIndex + 1
  if (next >= gameTable.value.players.length) next = 0
  return next
}

/**
 * Ermittelt wer die Initiative hat.
 * Tiebreaker: GES → ANG → VER → zufällig
 */
const determineInitiative = (): number => {
  const players = gameTable.value.players
  if (players.length < 2) return 0

  const [a, b] = [players[0].vCharacter, players[1].vCharacter]

  if (a[VALUE_TYPES.SPD] !== b[VALUE_TYPES.SPD])
    return a[VALUE_TYPES.SPD] > b[VALUE_TYPES.SPD] ? 0 : 1
  if (a[VALUE_TYPES.ATK] !== b[VALUE_TYPES.ATK])
    return a[VALUE_TYPES.ATK] > b[VALUE_TYPES.ATK] ? 0 : 1
  if (a[VALUE_TYPES.DEF] !== b[VALUE_TYPES.DEF])
    return a[VALUE_TYPES.DEF] > b[VALUE_TYPES.DEF] ? 0 : 1

  return Math.random() < 0.5 ? 0 : 1
}

const calculateStats = () => {
  for (let i = 0; i < gameTable.value.players.length; i++) {
    const player = gameTable.value.players[i]
    const { character, vCharacter } = player

    const tmp = {
      [VALUE_TYPES.HP]: vCharacter[VALUE_TYPES.HP],
      [VALUE_TYPES.ATK]: character[VALUE_TYPES.ATK],
      [VALUE_TYPES.DEF]: character[VALUE_TYPES.DEF],
      [VALUE_TYPES.SPD]: character[VALUE_TYPES.SPD],
    }

    const boardStack = unref(usePlayground().get(i).boardStack)
    for (let j = 0; j < boardStack.length; j++) {
      const card = boardStack[j].slice(-1)[0] as ICard
      if (card) {
        tmp[VALUE_TYPES.ATK] += card[VALUE_TYPES.ATK] || 0
        tmp[VALUE_TYPES.DEF] += card[VALUE_TYPES.DEF] || 0
        tmp[VALUE_TYPES.SPD] += card[VALUE_TYPES.SPD] || 0
      }
    }

    // tmpStats (Charakter-Fähigkeiten, Einmaleffekte)
    const ts = player.tmpStats
    tmp[VALUE_TYPES.ATK] += ts[VALUE_TYPES.ATK] ?? 0
    tmp[VALUE_TYPES.DEF] += ts[VALUE_TYPES.DEF] ?? 0
    tmp[VALUE_TYPES.SPD] += ts[VALUE_TYPES.SPD] ?? 0

    if (tmp[VALUE_TYPES.ATK] <= 0) tmp[VALUE_TYPES.ATK] = 0
    if (tmp[VALUE_TYPES.DEF] <= 0) tmp[VALUE_TYPES.DEF] = 0
    if (tmp[VALUE_TYPES.SPD] <= 0) tmp[VALUE_TYPES.SPD] = 0

    gameTable.value.players[i].vCharacter = tmp
  }
}

const checkGameEnd = (): boolean => {
  const active = gameTable.value.turnStats.activePlayerIndex
  const next = getNextPlayer()
  if (
    gameTable.value.players[next].vCharacter.HP <= 0 ||
    gameTable.value.players[active].vCharacter.HP <= 0
  ) {
    gameTable.value.gameEnds = true
    return true
  }
  return false
}

const checkDrawCondition = (): boolean => {
  if (gameTable.value.draftDeck.length === 0 || gameTable.value.zoneDraftDeck.length === 0) {
    gameTable.value.gameEnds = true
    gameTable.value.isDraw = true
    return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Charakter-Effekte: AFTER_ATTACK
// ---------------------------------------------------------------------------

const triggerAfterAttackEffect = (activePlayer: number, damageDealt: number) => {
  const characterName = gameTable.value.players[activePlayer]?.character?.name
  if (!characterName) return

  const effectDef = CHARACTER_EFFECTS[characterName]
  if (!effectDef || effectDef.trigger !== 'AFTER_ATTACK' || effectDef.optional) return

  const opponentIndex = getNextPlayer()
  const { handCards } = useHandCards()

  effectDef.execute({
    playerIndex: activePlayer,
    opponentIndex,
    gameTable: gameTable.value,
    handCards: handCards.value,
    attackDamageDealt: damageDealt,
    setTmpStat(idx, key, value) {
      gameTable.value.players[idx].tmpStats = {
        ...gameTable.value.players[idx].tmpStats,
        [key]: value,
      }
    },
    discardHandCard(idx, cardIndex) {
      handCards.value.hand[idx][cardIndex] = undefined
    },
    drawCard(idx) {
      const card = gameTable.value.draftDeck.pop()
      if (!card) return
      const slot = handCards.value.hand[idx].findIndex((c) => !c)
      if (slot !== -1) handCards.value.hand[idx][slot] = card
    },
    endTurnImmediately: endTurn,
    showSelectCardsUI: () => { /* AFTER_ATTACK braucht kein UI */ },
  })
}

// ---------------------------------------------------------------------------
// Schadensberechnung
// ---------------------------------------------------------------------------

const applyDamage = (
  activePlayer: number,
  nextPlayer: number,
  damage: number,
  defenseCard: ICard | null,
) => {
  if (defenseCard) {
    if (defenseCard.name === 'card.defense.ricochet') {
      const half = Math.round(damage / 2)
      gameTable.value.players[nextPlayer].vCharacter.HP -= half
      gameTable.value.players[activePlayer].vCharacter.HP -= half
    } else if (defenseCard.name === 'card.defense.counterShot') {
      gameTable.value.players[nextPlayer].vCharacter.HP -= damage
      gameTable.value.players[activePlayer].vCharacter.HP -= 1
    } else if (defenseCard.name === 'card.defense.duckAndRoll') {
      // kein Schaden
    } else if (defenseCard.name === 'card.defense.blocking') {
      const reduced = damage - 2
      if (reduced > 0) gameTable.value.players[nextPlayer].vCharacter.HP -= reduced
    } else if (defenseCard.name === 'card.defense.timeDistortion') {
      // Nur wirksam wenn Angreifer ≥ +2 GES hat
      if (
        gameTable.value.players[activePlayer].vCharacter.SPD -
          gameTable.value.players[nextPlayer].vCharacter.SPD >= 2
      ) {
        // Karte verhindert Schaden — kein Schaden
      } else {
        gameTable.value.players[nextPlayer].vCharacter.HP -= damage
      }
    }
  } else {
    gameTable.value.players[nextPlayer].vCharacter.HP -= damage
  }

  calculateStats()
}

// ---------------------------------------------------------------------------
// Netzwerk: Serialisierung / Deserialisierung
// ---------------------------------------------------------------------------

const serializeState = (): SerializedGameState => {
  const { handCards } = useHandCards()
  const { boardStack } = usePlayground()

  return {
    gameTable: {
      draftDeck: gameTable.value.draftDeck,
      zoneDraftDeck: gameTable.value.zoneDraftDeck,
      rules: gameTable.value.rules,
      gameEnds: gameTable.value.gameEnds,
      isDraw: gameTable.value.isDraw,
      roundStartInfo: gameTable.value.roundStartInfo,
      activeTurn: gameTable.value.activeTurn,
      turnStats: {
        turnStarted: gameTable.value.turnStats.turnStarted,
        currentTurnStep: gameTable.value.turnStats.currentTurnStep,
        roundNumber: gameTable.value.turnStats.roundNumber,
        playersLeft: gameTable.value.turnStats.playersLeft,
        activePlayerIndex: gameTable.value.turnStats.activePlayerIndex,
      },
      players: gameTable.value.players.map((p) => ({
        name: p.name,
        currentMaxHand: p.currentMaxHand,
        cardsPlayed: p.cardsPlayed,
        selectedCards: p.selectedCards,
        characterName: p.character.name,
        vCharacter: p.vCharacter,
        tmpStats: p.tmpStats,
      })),
    },
    handCards: handCards.value,
    boardStack: boardStack.value,
  }
}

const loadState = (state: SerializedGameState) => {
  const { handCards } = useHandCards()
  const { loadStack } = usePlayground()

  gameTable.value = {
    ...state.gameTable,
    turnStats: {
      ...state.gameTable.turnStats,
      turnEffects: undefined,
      endTurn: () => endTurn(),
    },
    players: state.gameTable.players.map((p) => ({
      ...p,
      character: CHARACTER_REGISTRY[p.characterName] ?? gunslingerData,
    })),
    showDamage: undefined,
  }

  handCards.value = state.handCards
  loadStack(state.boardStack)
}

const broadcastState = () => {
  if (localPlayerIndex.value === 0 && sendNetworkMessage) {
    sendNetworkMessage({ type: 'GAME_STATE', state: serializeState() })
  }
}

// ---------------------------------------------------------------------------
// Karten nachziehen
// ---------------------------------------------------------------------------

const drawNewCards = (playerIndex: number) => {
  const { handCards } = useHandCards()
  const maxHand = gameTable.value.players[playerIndex].currentMaxHand
  const newCard = gameTable.value.draftDeck.pop()

  if (newCard && handCards.value.hand[playerIndex].filter((c) => c).length !== maxHand) {
    handCards.value.hand[playerIndex] = handCards.value.hand[playerIndex].map(
      (c) => (c ? c : newCard),
    )
  }

  // Nur Abwehrkarten auf der Hand → komplett tauschen
  if (
    handCards.value.hand[playerIndex].filter(
      (c) => c && c.type === CARD_TYPES.DEFENSE,
    ).length === maxHand
  ) {
    handCards.value.hand[playerIndex] = handCards.value.hand[playerIndex].map(
      () => (gameTable.value.draftDeck.length >= 1 ? gameTable.value.draftDeck.pop() : undefined),
    )
  }
}

// ---------------------------------------------------------------------------
// Rundenstart-Overlay
// ---------------------------------------------------------------------------

const showRoundStartOverlay = (initiativeIdx: number) => {
  const player = gameTable.value.players[initiativeIdx]
  gameTable.value.roundStartInfo = {
    roundNumber: gameTable.value.turnStats.roundNumber,
    initiativePlayerIndex: initiativeIdx,
    initiativePlayerName: player.name,
  }

  useLayerManager().setLayer('RoundStartLayer', {
    props: {
      roundNumber: gameTable.value.turnStats.roundNumber,
      initiativePlayerName: player.name,
      ges: player.vCharacter[VALUE_TYPES.SPD],
    },
    next: () => {
      useLayerManager().unsetLayer()
      gameTable.value.roundStartInfo = undefined
      broadcastState()
    },
  })
}

// ---------------------------------------------------------------------------
// Zugende + Initiative
// ---------------------------------------------------------------------------

const endTurn = () => {
  const { handCards } = useHandCards()

  gameTable.value.showDamage = undefined
  gameTable.value.players.forEach((player: IPlayer) => {
    player.cardsPlayed = false
    player.selectedCards.handCard = null
    player.selectedCards.zoneCard = null
  })
  gameTable.value.players[gameTable.value.turnStats.activePlayerIndex].tmpStats = {}

  // Prüfen ob eine neue Runde beginnt (nach dem letzten Spieler)
  const wasLastInRound = getNextPlayer() === 0

  const nextPlayer = getNextPlayer()
  gameTable.value.turnStats.activePlayerIndex = nextPlayer

  if (wasLastInRound) {
    gameTable.value.turnStats.roundNumber++

    // Nachziehstapel leer? → Unentschieden
    if (checkDrawCondition()) {
      broadcastState()
      return
    }

    // Initiative für neue Runde bestimmen
    calculateStats() // Stats aktuell halten für Initiative-Berechnung
    const initiativeIdx = determineInitiative()
    gameTable.value.turnStats.activePlayerIndex = initiativeIdx

    broadcastState()
    showRoundStartOverlay(initiativeIdx)
  }

  // Zonenkarten für nächsten Spieler auffüllen
  const activeNext = gameTable.value.turnStats.activePlayerIndex
  const newZoneCard = gameTable.value.zoneDraftDeck.pop()!

  if (handCards.value.zone[activeNext].filter((c) => c).length === 0) {
    handCards.value.zone[activeNext][0] = newZoneCard
    for (let i = 1; i < 5; i++) {
      handCards.value.zone[activeNext][i] = gameTable.value.zoneDraftDeck.pop()!
    }
  } else if (handCards.value.zone[activeNext].length < 5) {
    handCards.value.zone[activeNext] = handCards.value.zone[activeNext].map(
      (z) => (z ? z : newZoneCard),
    )
  }

  // Schlangenbiss-Effekt
  const { boardStack } = usePlayground().get(activeNext)
  unref(boardStack).forEach((stack: unknown[]) => {
    if (stack && (stack as unknown[]).length > 0 && (stack[0] as ICard)?.name === 'card.event.snakeBite') {
      gameTable.value.players[activeNext].vCharacter.HP -= 1
      if (gameTable.value.players[activeNext].vCharacter.HP <= 0) {
        gameTable.value.gameEnds = true
      }
    }
  })

  drawNewCards(activeNext)
}

// ---------------------------------------------------------------------------
// Angriff
// ---------------------------------------------------------------------------

const resolveAttack = (
  activePlayer: number,
  nextPlayer: number,
  damage: number,
  defenseCard: ICard | null,
) => {
  useLayerManager().unsetLayer()
  applyDamage(activePlayer, nextPlayer, damage, defenseCard)

  const actualDamage = defenseCard?.name === 'card.defense.duckAndRoll' ? 0 : damage
  triggerAfterAttackEffect(activePlayer, actualDamage)

  if (!checkGameEnd()) {
    endTurn()
  }

  broadcastState()
}

const attack = () => {
  const activePlayer = gameTable.value.turnStats.activePlayerIndex
  const nextPlayer = getNextPlayer()

  // Kopfnuss: Angreifer kann nicht angreifen
  const activeBoardStack = unref(usePlayground().get(activePlayer).boardStack)
  const hasHeadButt = activeBoardStack.some(
    (stack) => (stack as unknown[]).length > 0 && (stack[0] as ICard)?.name === 'card.event.headButt',
  )
  if (hasHeadButt) {
    endTurn()
    broadcastState()
    return
  }

  // Regel: GES ≤ 1 → kein Angriff möglich
  if (gameTable.value.players[activePlayer].vCharacter[VALUE_TYPES.SPD] <= 1) {
    endTurn()
    broadcastState()
    return
  }

  const damage =
    gameTable.value.players[activePlayer].vCharacter.ATK -
    gameTable.value.players[nextPlayer].vCharacter.DEF

  if (damage <= 0) {
    endTurn()
    broadcastState()
    return
  }

  const defenderSpd = gameTable.value.players[nextPlayer].vCharacter[VALUE_TYPES.SPD]
  const cannotDefend = !!gameTable.value.players[nextPlayer].tmpStats.cannotDefend
  const isRemoteDefender =
    localPlayerIndex.value !== -1 && nextPlayer !== localPlayerIndex.value

  if (isRemoteDefender) {
    const { handCards } = useHandCards()
    const rawDefenseCards = (handCards.value.hand[nextPlayer] ?? []).filter(
      (c): c is ICard => !!c && c.type === CARD_TYPES.DEFENSE,
    )
    const defenseCards = cannotDefend ? [] : filterDefenseCards(rawDefenseCards, defenderSpd)
    sendNetworkMessage?.({ type: 'REQUEST_DEFENSE', damage, defenseCards })

    new Promise<ICard | null>((resolve) => {
      pendingDefenseResolve = resolve
    }).then((defenseCard) => {
      resolveAttack(activePlayer, nextPlayer, damage, defenseCard)
    })
  } else {
    const { handCards } = useHandCards()
    const rawDefenseCards = (handCards.value.hand[nextPlayer] ?? []).filter(
      (c): c is ICard => !!c && c.type === CARD_TYPES.DEFENSE,
    )
    const availableDefenseCards = cannotDefend ? [] : filterDefenseCards(rawDefenseCards, defenderSpd)

    useLayerManager().setLayer('DamageLayer', {
      props: { damage, nextPlayer, availableDefenseCards },
      next: (data?: unknown) => {
        resolveAttack(activePlayer, nextPlayer, damage, (data as ICard) ?? null)
      },
    })
  }
}

// ---------------------------------------------------------------------------
// Karte spielen
// ---------------------------------------------------------------------------

const triggerFalsePlay = (targetPlayerIndex: number) => {
  const isRemoteTarget =
    localPlayerIndex.value !== -1 && targetPlayerIndex !== localPlayerIndex.value

  if (isRemoteTarget) {
    sendNetworkMessage?.({ type: 'REQUEST_DISCARD', count: 2 })
    new Promise<number[]>((resolve) => {
      pendingDiscardResolve = resolve
    }).then((indices) => {
      const { handCards } = useHandCards()
      indices.forEach((i) => { handCards.value.hand[targetPlayerIndex][i] = undefined })
      broadcastState()
    })
  } else {
    useLayerManager().setLayer('CharacterEffectLayer', {
      props: { playerIndex: targetPlayerIndex, count: 2, headline: 'Falsches Spiel! Wähle 2 Karten zum Abwerfen.' },
      next: (data?: unknown) => {
        useLayerManager().unsetLayer()
        const { handCards } = useHandCards()
        const indices = (data as number[]) ?? []
        indices.forEach((i) => { handCards.value.hand[targetPlayerIndex][i] = undefined })
        broadcastState()
      },
    })
  }
}

const playCardsInternal = (playerIndex: number) => {
  const { handCards } = useHandCards()
  const { zoneCard, handCard } = gameTable.value.players[playerIndex].selectedCards

  if (zoneCard === null || handCard === null) return

  const zoneCardObj = handCards.value['zone'][playerIndex][zoneCard!] as IZoneCard
  const cardToPlace = handCards.value['hand'][playerIndex][handCard!]

  const targetPlayer =
    cardToPlace && cardToPlace.type === CARD_TYPES.EVENT ? getNextPlayer() : playerIndex

  // Sofort-Effekte beim Ausspielen
  if (cardToPlace?.type === CARD_TYPES.EVENT) {
    if (cardToPlace.name === 'card.event.healing') {
      gameTable.value.players[playerIndex].vCharacter.HP = Math.min(
        gameTable.value.players[playerIndex].vCharacter.HP + 2,
        gameTable.value.players[playerIndex].character.HP,
      )
    }
    // "Falsches Spiel" wird nach dem Ablegen ausgelöst
  }

  // Karte auf alle Zielfelder legen ("ALLE FELDER" oder normales Feld)
  if (cardToPlace) {
    for (const zone of zoneCardObj.zones) {
      usePlayground().set(targetPlayer, zone, cardToPlace)
    }
  }

  handCards.value['zone'][playerIndex][zoneCard!] = undefined
  handCards.value['hand'][playerIndex][handCard!] = undefined
  gameTable.value.players[playerIndex].selectedCards = { zoneCard: null, handCard: null }
  gameTable.value.players[playerIndex].cardsPlayed = true

  calculateStats()

  // "Falsches Spiel" → Gegner muss 2 Karten abwerfen (nach calculateStats)
  if (cardToPlace?.name === 'card.event.falsePlay') {
    triggerFalsePlay(targetPlayer)
  }
}

// ---------------------------------------------------------------------------
// Netzwerk: eingehende Nachrichten
// ---------------------------------------------------------------------------

const handleNetworkMessage = (msg: NetworkMessage) => {
  if (msg.type === 'READY') {
    if (localPlayerIndex.value === 0) broadcastState()
    return
  }

  if (msg.type === 'GAME_STATE') {
    if (localPlayerIndex.value === 1) {
      loadState(msg.state)
      // Rundenstart-Overlay auf Gast-Seite zeigen falls vorhanden
      if (msg.state.gameTable.roundStartInfo) {
        const info = msg.state.gameTable.roundStartInfo
        const player = gameTable.value.players[info.initiativePlayerIndex]
        useLayerManager().setLayer('RoundStartLayer', {
          props: {
            roundNumber: info.roundNumber,
            initiativePlayerName: info.initiativePlayerName,
            ges: player?.vCharacter?.[VALUE_TYPES.SPD] ?? 0,
          },
          next: () => useLayerManager().unsetLayer(),
        })
      }
    }
    return
  }

  if (msg.type === 'ACTION') {
    if (localPlayerIndex.value !== 0) return
    const action = msg.action
    const guestIndex = 1

    if (action.type === 'PLAY_CARDS') {
      gameTable.value.players[guestIndex].selectedCards = {
        zoneCard: action.zoneCardIndex,
        handCard: action.handCardIndex,
      }
      playCardsInternal(guestIndex)
      broadcastState()
    } else if (action.type === 'ATTACK') {
      attack()
    } else if (action.type === 'END_TURN') {
      endTurn()
      broadcastState()
    }
    return
  }

  if (msg.type === 'REQUEST_DEFENSE') {
    if (localPlayerIndex.value !== 1) return
    const { damage, defenseCards } = msg
    useLayerManager().setLayer('DamageLayer', {
      props: { damage, nextPlayer: localPlayerIndex.value, availableDefenseCards: defenseCards },
      next: (data?: unknown) => {
        useLayerManager().unsetLayer()
        sendNetworkMessage?.({ type: 'DEFENSE_CHOICE', card: (data as ICard) ?? null })
      },
    })
    return
  }

  if (msg.type === 'DEFENSE_CHOICE') {
    if (localPlayerIndex.value !== 0) return
    pendingDefenseResolve?.(msg.card)
    pendingDefenseResolve = null
    return
  }

  if (msg.type === 'REQUEST_DISCARD') {
    if (localPlayerIndex.value !== 1) return
    useLayerManager().setLayer('CharacterEffectLayer', {
      props: {
        playerIndex: localPlayerIndex.value,
        count: msg.count,
        headline: 'Falsches Spiel! Wähle 2 Karten zum Abwerfen.',
      },
      next: (data?: unknown) => {
        useLayerManager().unsetLayer()
        sendNetworkMessage?.({ type: 'DISCARD_CHOICE', cardIndices: (data as number[]) ?? [] })
      },
    })
    return
  }

  if (msg.type === 'DISCARD_CHOICE') {
    if (localPlayerIndex.value !== 0) return
    pendingDiscardResolve?.(msg.cardIndices)
    pendingDiscardResolve = null
    return
  }
}

// ---------------------------------------------------------------------------
// Konstanten
// ---------------------------------------------------------------------------

const INITIAL_MAX_HAND = 7

// ---------------------------------------------------------------------------
// Exportierter Composable
// ---------------------------------------------------------------------------

export default () => {
  const { setNewCards } = useHandCards()

  return {
    gameTable,
    localPlayerIndex,

    setNetworkSender(sender: (msg: NetworkMessage) => void) {
      sendNetworkMessage = sender
    },

    handleNetworkMessage,
    getNextPlayer,

    init(
      players: { name: string; character: ICharacter }[],
      additionalRules: {
        startHand: number
        zoneCards: { alwaysFull: boolean; maxZoneCards: number }
      },
    ) {
      usePlayground().initStack(players.length)

      gameTable.value.draftDeck = getDraftDeck()
      gameTable.value.zoneDraftDeck = getZoneCardsDraftDeck()
      gameTable.value.gameEnds = false
      gameTable.value.isDraw = false
      gameTable.value.roundStartInfo = undefined
      gameTable.value.rules = { ...additionalRules }
      gameTable.value.turnStats.roundNumber = 1

      // Initiative für Runde 1 bestimmen
      // Wir initialisieren zunächst mit Basiswerten, dann Initiative bestimmen
      gameTable.value.players = players.map((player) => ({
        name: player.name,
        currentMaxHand: INITIAL_MAX_HAND,
        cardsPlayed: false,
        selectedCards: { zoneCard: null, handCard: null },
        character: player.character,
        vCharacter: {
          [VALUE_TYPES.HP]: player.character.HP,
          [VALUE_TYPES.ATK]: player.character.ATK,
          [VALUE_TYPES.DEF]: player.character.DEF,
          [VALUE_TYPES.SPD]: player.character.SPD,
        },
        tmpStats: {},
      }))

      const initiativeIdx = determineInitiative()
      gameTable.value.turnStats.activePlayerIndex = initiativeIdx

      players.forEach((_, index) => {
        setNewCards(
          index,
          'zone',
          gameTable.value.zoneDraftDeck.splice(-5, 5) as unknown as ICard[],
        )
        setNewCards(
          index,
          'hand',
          gameTable.value.draftDeck.splice(INITIAL_MAX_HAND * -1, INITIAL_MAX_HAND),
        )
      })

      broadcastState()
      showRoundStartOverlay(initiativeIdx)
    },

    setZoneCard(cardIndex: number, playerIndex: number) {
      gameTable.value.players[playerIndex].selectedCards.zoneCard = cardIndex
    },

    setHandCard(cardIndex: number, playerIndex: number) {
      gameTable.value.players[playerIndex].selectedCards.handCard = cardIndex
    },

    playCards(playerIndex: number) {
      playCardsInternal(playerIndex)
      broadcastState()
    },

    attack,
    endTurn,

    addTempStats(stats: {
      [VALUE_TYPES.ATK]?: number
      [VALUE_TYPES.DEF]?: number
      [VALUE_TYPES.SPD]?: number
    }) {
      gameTable.value.players[
        gameTable.value.turnStats.activePlayerIndex
      ].tmpStats = { ...stats }
    },

    playCharacterEffect(_playerIndex: number) {
      // Wird über useCharacterEffect ausgelöst
    },
  }
}
