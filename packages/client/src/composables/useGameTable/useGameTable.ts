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
  | { type: 'READY' }

export type GuestAction =
  | { type: 'SET_ZONE_CARD'; cardIndex: number }
  | { type: 'SET_HAND_CARD'; cardIndex: number }
  | { type: 'PLAY_CARDS'; zoneCardIndex: number; handCardIndex: number }
  | { type: 'ATTACK' }
  | { type: 'END_TURN' }

type SerializablePlayer = Omit<IPlayer, 'character'> & { characterName: string }

interface SerializedGameState {
  gameTable: {
    draftDeck: ICard[]
    zoneDraftDeck: IZoneCard[]
    rules: IGameTable['rules']
    gameEnds: boolean
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
// Modul-Level State (Singleton)
// ---------------------------------------------------------------------------

const gameTable: Ref<IGameTable> = ref({
  draftDeck: getDraftDeck(),
  zoneDraftDeck: getZoneCardsDraftDeck(),
  rules: {
    startHand: 7,
    zoneCards: {
      alwaysFull: false,
      maxZoneCards: 4,
    },
  },
  gameEnds: false,
  activeTurn: {
    attacked: false,
  },
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

// Welcher Spieler ist lokal: 0 = Host, 1 = Gast, -1 = lokal (kein Netz)
const localPlayerIndex = ref<number>(-1)

// Callback zum Senden von Nachrichten (wird von außen gesetzt)
let sendNetworkMessage: ((msg: NetworkMessage) => void) | null = null

// Ausstehende Verteidigungswahl (Promise-Resolver)
let pendingDefenseResolve: ((card: ICard | null) => void) | null = null

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

const getNextPlayer = () => {
  let next = gameTable.value.turnStats.activePlayerIndex + 1
  if (next >= gameTable.value.players.length) {
    next = 0
  }
  return next
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

    // tmpStats (z.B. Charakter-Fähigkeiten) einrechnen
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

const checkGameEnd = () => {
  const activePlayer = gameTable.value.turnStats.activePlayerIndex
  const nextPlayer = getNextPlayer()
  if (
    gameTable.value.players[nextPlayer].vCharacter.HP <= 0 ||
    gameTable.value.players[activePlayer].vCharacter.HP <= 0
  ) {
    gameTable.value.gameEnds = true
    return true
  }
  return false
}

// Charakter-Effekt für AFTER_ATTACK auslösen (z.B. Headhunter)
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
    showSelectCardsUI: () => { /* AFTER_ATTACK-Effekte brauchen kein UI */ },
  })
}

// Schadensberechnung – wird sowohl lokal als auch nach Remote-Antwort genutzt
const applyDamage = (
  activePlayer: number,
  nextPlayer: number,
  damage: number,
  defenseCard: ICard | null,
) => {
  let calculatedDamage = damage

  if (defenseCard) {
    if (defenseCard.name === 'card.defense.ricochetRule') {
      calculatedDamage = Math.round(calculatedDamage / 2)
      gameTable.value.players[nextPlayer].vCharacter.HP -= calculatedDamage
      gameTable.value.players[activePlayer].vCharacter.HP -= calculatedDamage
    } else if (defenseCard.name === 'card.defense.counterShotRule') {
      gameTable.value.players[nextPlayer].vCharacter.HP -= calculatedDamage
      gameTable.value.players[activePlayer].vCharacter.HP -= 1
    } else if (defenseCard.name === 'card.defense.duckAndRoll') {
      // kein Schaden
    } else if (defenseCard.name === 'card.defense.blocking') {
      calculatedDamage -= 2
      if (calculatedDamage > 0) {
        gameTable.value.players[nextPlayer].vCharacter.HP -= calculatedDamage
      }
    } else if (defenseCard.name === 'card.defense.timeDistortion') {
      if (
        gameTable.value.players[activePlayer].vCharacter.SPD -
          gameTable.value.players[nextPlayer].vCharacter.SPD <
        2
      ) {
        gameTable.value.players[nextPlayer].vCharacter.HP -= calculatedDamage
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
// Spielzug-Logik
// ---------------------------------------------------------------------------

const drawNewCards = (nextPlayer: number) => {
  const { handCards } = useHandCards()
  const currentMaxHand = gameTable.value.players[nextPlayer].currentMaxHand
  const newCard = gameTable.value.draftDeck.pop()

  if (
    newCard &&
    handCards.value.hand[nextPlayer].filter((c) => c).length !== currentMaxHand
  ) {
    handCards.value.hand[nextPlayer] = handCards.value.hand[nextPlayer].map(
      (c) => (c ? c : newCard),
    )
  }

  if (
    handCards.value.hand[nextPlayer].filter(
      (c) => c && c.type === CARD_TYPES.DEFENSE,
    ).length === currentMaxHand
  ) {
    handCards.value.hand[nextPlayer] = handCards.value.hand[nextPlayer].map(
      () => (gameTable.value.draftDeck.length >= 1 ? gameTable.value.draftDeck.pop() : undefined),
    )
  }
}

const endTurn = () => {
  const { handCards } = useHandCards()

  gameTable.value.showDamage = undefined
  gameTable.value.players.forEach((player: IPlayer) => {
    player.cardsPlayed = false
    player.selectedCards.handCard = null
    player.selectedCards.zoneCard = null
  })
  gameTable.value.players[gameTable.value.turnStats.activePlayerIndex].tmpStats = {}

  const nextPlayer = getNextPlayer()
  gameTable.value.turnStats.activePlayerIndex = nextPlayer

  const newZoneCard = gameTable.value.zoneDraftDeck.pop()!

  if (handCards.value.zone[nextPlayer].filter((c) => c).length === 0) {
    handCards.value.zone[nextPlayer][0] = newZoneCard
    for (let i = 1; i < 5; i++) {
      handCards.value.zone[nextPlayer][i] = gameTable.value.zoneDraftDeck.pop()!
    }
  } else if (handCards.value.zone[nextPlayer].length < 5) {
    handCards.value.zone[nextPlayer] = handCards.value.zone[nextPlayer].map(
      (z) => (z ? z : newZoneCard),
    )
  }

  const { boardStack } = usePlayground().get(nextPlayer)
  unref(boardStack).forEach((stack: unknown[]) => {
    if (stack?.length > 0 && (stack[0] as ICard)?.name === 'card.event.snakeBite') {
      gameTable.value.players[nextPlayer].vCharacter.HP -= 1
      if (gameTable.value.players[nextPlayer].vCharacter.HP <= 0) {
        gameTable.value.gameEnds = true
      }
    }
  })

  drawNewCards(nextPlayer)
}

// Kernlogik Angriff, nach Verteidigungswahl
const resolveAttack = (
  activePlayer: number,
  nextPlayer: number,
  damage: number,
  defenseCard: ICard | null,
) => {
  useLayerManager().unsetLayer()
  applyDamage(activePlayer, nextPlayer, damage, defenseCard)

  // Charakter-Effekt nach Angriff (z.B. Headhunter)
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
  const damage =
    gameTable.value.players[activePlayer].vCharacter.ATK -
    gameTable.value.players[nextPlayer].vCharacter.DEF

  if (damage <= 0) {
    endTurn()
    broadcastState()
    return
  }

  const isRemoteDefender =
    localPlayerIndex.value !== -1 && nextPlayer !== localPlayerIndex.value

  if (isRemoteDefender) {
    // Gast muss Verteidigungskarte wählen
    const { handCards } = useHandCards()
    const defenseCards = (handCards.value.hand[nextPlayer] ?? []).filter(
      (c): c is ICard => !!c && c.type === CARD_TYPES.DEFENSE,
    )
    sendNetworkMessage?.({ type: 'REQUEST_DEFENSE', damage, defenseCards })

    new Promise<ICard | null>((resolve) => {
      pendingDefenseResolve = resolve
    }).then((defenseCard) => {
      resolveAttack(activePlayer, nextPlayer, damage, defenseCard)
    })
  } else {
    useLayerManager().setLayer('DamageLayer', {
      props: { damage, nextPlayer },
      next: (data?: unknown) => {
        resolveAttack(activePlayer, nextPlayer, damage, (data as ICard) ?? null)
      },
    })
  }
}

const playCardsInternal = (playerIndex: number) => {
  const { handCards } = useHandCards()
  const { zoneCard, handCard } = gameTable.value.players[playerIndex].selectedCards

  if (zoneCard === null || handCard === null) return

  const boardStackTarget = (
    handCards.value['zone'][playerIndex][zoneCard!]! as IZoneCard
  ).zones[0]
  const cardToPlace = handCards.value['hand'][playerIndex][handCard!]

  const targetPlayer =
    cardToPlace && cardToPlace.type === CARD_TYPES.EVENT ? getNextPlayer() : playerIndex

  if (cardToPlace?.type === CARD_TYPES.EVENT) {
    if (cardToPlace.name === 'card.event.healing') {
      gameTable.value.players[playerIndex].vCharacter.HP = Math.min(
        gameTable.value.players[playerIndex].vCharacter.HP + 2,
        gameTable.value.players[playerIndex].character.HP,
      )
    }
  }

  if (cardToPlace) {
    usePlayground().set(targetPlayer, boardStackTarget, cardToPlace)
  }

  handCards.value['zone'][playerIndex][zoneCard!] = undefined
  handCards.value['hand'][playerIndex][handCard!] = undefined
  gameTable.value.players[playerIndex].selectedCards = { zoneCard: null, handCard: null }
  gameTable.value.players[playerIndex].cardsPlayed = true

  calculateStats()
}

// ---------------------------------------------------------------------------
// Netzwerk: eingehende Nachrichten verarbeiten
// ---------------------------------------------------------------------------

const handleNetworkMessage = (msg: NetworkMessage) => {
  if (msg.type === 'READY') {
    // Gast ist bereit: Host schickt sofort den aktuellen State
    if (localPlayerIndex.value === 0) {
      broadcastState()
    }
    return
  }

  if (msg.type === 'GAME_STATE') {
    // Nur der Gast empfängt State-Updates vom Host
    if (localPlayerIndex.value === 1) {
      loadState(msg.state)
    }
    return
  }

  if (msg.type === 'ACTION') {
    // Nur der Host verarbeitet Aktionen des Gastes
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
      // broadcastState wird innerhalb von resolveAttack/endTurn aufgerufen
    } else if (action.type === 'END_TURN') {
      endTurn()
      broadcastState()
    }
    return
  }

  if (msg.type === 'REQUEST_DEFENSE') {
    // Nur der Gast empfängt Verteidigungsanfragen
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
    // Nur der Host empfängt die Antwort des Gastes
    if (localPlayerIndex.value !== 0) return

    pendingDefenseResolve?.(msg.card)
    pendingDefenseResolve = null
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

    /** Netzwerk-Sender registrieren (wird von Game.vue gesetzt) */
    setNetworkSender(sender: (msg: NetworkMessage) => void) {
      sendNetworkMessage = sender
    },

    /** Eingehende Netzwerk-Nachricht verarbeiten */
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
      gameTable.value.rules = { ...additionalRules }
      gameTable.value.turnStats.activePlayerIndex = 0
      gameTable.value.turnStats.roundNumber = 0

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
      // todo: Charakter-Spezialeffekte
    },
  }
}
