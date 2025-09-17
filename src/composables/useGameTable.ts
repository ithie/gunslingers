import { computed, Ref, ref } from 'vue'
import IGameTable from '../interfaces/IGameTable'
import getDraftDeck from '../rules/getDraftDeck'
import getZoneCardsDraftDeck from '../rules/getZoneCardsDraftDeck'
import ICharacter from '../interfaces/ICharacter'
import { VALUE_TYPES } from '../enums'
import ICard from '../interfaces/ICard'
import { TURN_STEP } from '../interfaces/ITurnStats'
import { M } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js'

const endTurn = () => {
  console.log('END TURN')
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
      }))
    },
    setZoneCard: (cardIndex: number) => {
      const activePlayerIndex = gameTable.value.turnStats.activePlayerIndex
      const playerData = gameTable.value.players[activePlayerIndex]

      gameTable.value.activeTurn.zoneCard = cardIndex
    },
    setHandCard: (cardIndex: number) => {
      const activePlayerIndex = gameTable.value.turnStats.activePlayerIndex
      const playerData = gameTable.value.players[activePlayerIndex]

      gameTable.value.activeTurn.handCard = cardIndex
    },
    playCharacterEffect: (playerIndex: number) => {
      // todo: play effect of character
    },
    endTurn: () => {},
    attack: () => {
      // gameTable.value.activeTurn.attacked: false,
    },
    playCards: () => {
      const { zoneCard, handCard } = gameTable.value.activeTurn

      if (zoneCard !== null && handCard !== null) {
        const currentPlayer =
          gameTable.value.players[gameTable.value.turnStats.activePlayerIndex]

        const boardStackTarget = currentPlayer.zoneCards[zoneCard!].zones[0]
        const boardStackCard = currentPlayer.hand[handCard!]

        gameTable.value.players[
          gameTable.value.turnStats.activePlayerIndex
        ].boardStack[boardStackTarget].push(currentPlayer.hand[handCard!])

        delete currentPlayer.zoneCards[zoneCard!]
        delete currentPlayer.hand[handCard!]

        gameTable.value.activeTurn.zoneCard = null
        gameTable.value.activeTurn.handCard = null

        gameTable.value.activeTurn.cardsPlayed = true
      }
    },
    calculateStats: () => {
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
            const card = boardStack[i].slice(-1, 1)[0]

            tmpVCharacter[VALUE_TYPES.ATK] += card[VALUE_TYPES.ATK] || 0
            tmpVCharacter[VALUE_TYPES.DEF] += card[VALUE_TYPES.DEF] || 0
            tmpVCharacter[VALUE_TYPES.SPD] += card[VALUE_TYPES.SPD] || 0

            if (card.effect && card.effect.when !== 'INSTANT') {
            }
          }
        }

        gameTable.value.players[playerIndex].vCharacter = tmpVCharacter
      }
    },
    gameTable,
  }
}
