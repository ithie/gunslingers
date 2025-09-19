import { Ref, ref, watch } from 'vue'
import IGameTable from '../interfaces/IGameTable'
import getDraftDeck from '../rules/getDraftDeck'
import getZoneCardsDraftDeck from '../rules/getZoneCardsDraftDeck'
import ICharacter from '../interfaces/ICharacter'
import { CARD_TYPES, VALUE_TYPES } from '../enums'
import { TURN_STEP } from '../interfaces/ITurnStats'
import ICard from '../interfaces/ICard'

const getNextPlayer = () => {
  let nextPlayer = gameTable.value.turnStats.activePlayerIndex + 1
  if (nextPlayer >= gameTable.value.players.length) {
    nextPlayer = 0
  }
  return nextPlayer
}

const drawNewCards = (nextPlayer: number) => {
  const newCardDrawn = gameTable.value.draftDeck.pop()

  if (
    newCardDrawn &&
    gameTable.value.players[nextPlayer].hand.filter((item) => item).length !==
      gameTable.value.players[nextPlayer].hand.length
  ) {
    gameTable.value.players[nextPlayer].hand = gameTable.value.players[
      nextPlayer
    ].hand.map((handCard) => {
      if (!handCard) {
        return newCardDrawn!
      }
      return handCard
    })
  }

  if (
    gameTable.value.players[nextPlayer].hand.filter(
      (item) => item && item.type === CARD_TYPES.DEFENSE,
    ).length === 5
  ) {
    gameTable.value.players[nextPlayer].hand = gameTable.value.players[
      nextPlayer
    ].hand.map(() => {
      if (gameTable.value.draftDeck.length >= 1) {
        return gameTable.value.draftDeck.pop()
      }
      return undefined
    })
  }
}

const attack = () => {
  const activePlayer = gameTable.value.turnStats.activePlayerIndex
  const nextPlayer = getNextPlayer()

  const damage =
    gameTable.value.players[activePlayer].vCharacter.ATK -
    gameTable.value.players[nextPlayer].vCharacter.DEF

  if (damage > 0) {
    gameTable.value.players[nextPlayer].vCharacter.HP =
      gameTable.value.players[nextPlayer].vCharacter.HP - damage
  }

  if (gameTable.value.players[nextPlayer].vCharacter.HP <= 0) {
    gameTable.value.players[nextPlayer].vCharacter.HP === 0
    gameTable.value.gameEnds = true
  } else {
    endTurn()
  }
}

const endTurn = () => {
  gameTable.value.activeTurn.cardsPlayed = false

  gameTable.value.players[
    gameTable.value.turnStats.activePlayerIndex
  ].tmpStats = {}

  const nextPlayer = getNextPlayer()
  gameTable.value.turnStats.activePlayerIndex = nextPlayer

  const newZoneCardDrawn = gameTable.value.zoneDraftDeck.pop()!

  if (
    gameTable.value.players[nextPlayer].zoneCards.filter((item) => item)
      .length === 0
  ) {
    gameTable.value.players[nextPlayer].zoneCards[0] = newZoneCardDrawn
    for (let i = 1; i < 5; i++) {
      gameTable.value.players[nextPlayer].zoneCards[i] =
        gameTable.value.zoneDraftDeck.pop()!
    }
  } else if (gameTable.value.players[nextPlayer].zoneCards.length < 5) {
    gameTable.value.players[nextPlayer].zoneCards = gameTable.value.players[
      nextPlayer
    ].zoneCards.map((zoneCard) => {
      if (!zoneCard) {
        return newZoneCardDrawn
      }
      return zoneCard
    })
  }

  gameTable.value.players[nextPlayer].boardStack.forEach(
    (handCard: unknown[]) => {
      if (
        handCard &&
        handCard.length > 0 &&
        (handCard[0] as ICard)?.type === CARD_TYPES.EVENT
      ) {
        if ((handCard[0] as ICard)?.name === 'card.event.snakeBite') {
          gameTable.value.players[nextPlayer].vCharacter.HP =
            gameTable.value.players[nextPlayer].vCharacter.HP - 1

          if (gameTable.value.players[nextPlayer].vCharacter.HP <= 0) {
            gameTable.value.gameEnds = true
            return
          }
        }
      }
    },
  )

  drawNewCards(nextPlayer)
}

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
    zoneCard: null,
    handCard: null,
    cardsPlayed: false,
    attacked: false,
  },
  turnStats: {
    turnStarted: false,
    currentTurnStep: TURN_STEP.BEGINNING,
    turnEffects: undefined,
    roundNumber: 0,
    playersLeft: [],
    activePlayerIndex: 0,
    endTurn,
  },
  players: [],
})

const calculateStats = () => {
  for (
    let playerIndex = 0;
    playerIndex < gameTable.value.players.length;
    playerIndex++
  ) {
    // todo: execute Effect of turn!
    const player = gameTable.value.players[playerIndex]

    const { character, vCharacter, boardStack } = player

    let hp = vCharacter[VALUE_TYPES.HP]
    let atk = character[VALUE_TYPES.ATK]
    let def = character[VALUE_TYPES.DEF]
    let spd = character[VALUE_TYPES.SPD]

    const tmpVCharacter = {
      [VALUE_TYPES.HP]: hp,
      [VALUE_TYPES.ATK]: atk,
      [VALUE_TYPES.DEF]: def,
      [VALUE_TYPES.SPD]: spd,
    }

    for (let i = 0; i < boardStack.length; i++) {
      if (boardStack.length > 0) {
        const card = boardStack[i].slice(-1, 1)[0] as ICard

        if (card) {
          tmpVCharacter[VALUE_TYPES.ATK] += card[VALUE_TYPES.ATK] || 0
          tmpVCharacter[VALUE_TYPES.DEF] += card[VALUE_TYPES.DEF] || 0
          tmpVCharacter[VALUE_TYPES.SPD] += card[VALUE_TYPES.SPD] || 0

          if (tmpVCharacter[VALUE_TYPES.ATK] < 0) {
            tmpVCharacter[VALUE_TYPES.ATK] = 0
          }
          if (tmpVCharacter[VALUE_TYPES.DEF] < 0) {
            tmpVCharacter[VALUE_TYPES.DEF] = 0
          }
          if (tmpVCharacter[VALUE_TYPES.SPD] < 0) {
            tmpVCharacter[VALUE_TYPES.SPD] = 0
          }

          if (card.effect && card.effect.when !== 'INSTANT') {
          }
        }
      }
    }

    gameTable.value.players[playerIndex].vCharacter = tmpVCharacter
  }
}

export default () => {
  return {
    init: (
      players: { name: string; character: ICharacter }[],
      additionalRules: {
        startHand: number
        zoneCards: { alwaysFull: boolean; maxZoneCards: number }
      },
    ) => {
      gameTable.value.rules = { ...additionalRules }
      gameTable.value.players = players.map((player) => ({
        name: player.name,
        hand: gameTable.value.draftDeck.splice(-5, 5),
        boardStack: [[], [], [], [], [], [], [], []],
        zoneCards: gameTable.value.zoneDraftDeck.splice(-5, 5),
        character: player.character,
        vCharacter: {
          [VALUE_TYPES.HP]: player.character.HP,
          [VALUE_TYPES.ATK]: player.character.ATK,
          [VALUE_TYPES.DEF]: player.character.DEF,
          [VALUE_TYPES.SPD]: player.character.SPD,
        },
        currentMaxHand: 7,
        tmpStats: {},
      }))
    },
    setZoneCard: (cardIndex: number) => {
      gameTable.value.activeTurn.zoneCard = cardIndex
    },
    setHandCard: (cardIndex: number) => {
      gameTable.value.activeTurn.handCard = cardIndex
    },
    playCharacterEffect: (playerIndex: number) => {
      // todo: play effect of character
    },
    endTurn,
    attack,
    playCards: () => {
      const { zoneCard, handCard } = gameTable.value.activeTurn

      if (zoneCard !== null && handCard !== null) {
        const activePlayerIndex = gameTable.value.turnStats.activePlayerIndex
        const currentPlayer = gameTable.value.players[activePlayerIndex]

        const boardStackTarget = currentPlayer.zoneCards[zoneCard!]!.zones[0]

        const cardToPlace = currentPlayer.hand[handCard!]
        const targetPlayer =
          cardToPlace && cardToPlace.type === CARD_TYPES.EVENT
            ? getNextPlayer()
            : activePlayerIndex

        if (cardToPlace?.type === CARD_TYPES.EVENT) {
          if (cardToPlace?.name === 'card.event.healing') {
            gameTable.value.players[activePlayerIndex].vCharacter.HP =
              gameTable.value.players[activePlayerIndex].vCharacter.HP + 2

            if (
              gameTable.value.players[activePlayerIndex].vCharacter.HP >
              gameTable.value.players[activePlayerIndex].character.HP
            ) {
              gameTable.value.players[activePlayerIndex].vCharacter.HP =
                gameTable.value.players[activePlayerIndex].character.HP
            }
          }
        }

        gameTable.value.players[targetPlayer].boardStack[boardStackTarget].push(
          cardToPlace,
        )

        currentPlayer.zoneCards[zoneCard!] = undefined
        currentPlayer.hand[handCard!] = undefined

        gameTable.value.activeTurn.zoneCard = null
        gameTable.value.activeTurn.handCard = null

        gameTable.value.activeTurn.cardsPlayed = true

        calculateStats()
      }
    },
    gameTable,
    addTempStats: (stats: {
      [VALUE_TYPES.ATK]?: number
      [VALUE_TYPES.DEF]?: number
      [VALUE_TYPES.SPD]?: number
    }) => {
      gameTable.value.players[
        gameTable.value.turnStats.activePlayerIndex
      ].tmpStats = { ...stats }
    },
  }
}
