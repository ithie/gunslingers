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
    playCharacterEffect: (playerIndex: number) => {
      // todo: play effect of character
    },
    playCard: (card: ICard, playerIndex: number, position: number) => {
      gameTable.value.players[playerIndex].boardStack[position].push(card)
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
