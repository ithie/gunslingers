import { Ref, ref, watch } from 'vue'
import IGameTable from '../interfaces/IGameTable'
import getDraftDeck from '../rules/getDraftDeck'
import getZoneCardsDraftDeck from '../rules/getZoneCardsDraftDeck'
import ICharacter from '../interfaces/ICharacter'
import { CARD_TYPES, VALUE_TYPES } from '../enums'
import { TURN_STEP } from '../interfaces/ITurnStats'
import ICard from '../interfaces/ICard'
import IPlayer from '../interfaces/IPlayer'
import useLayerManager from '../components/LayerManager/useLayerManager'
import useHandCards from '../components/HandCards/useHandCards'
import IZoneCard from '../interfaces/IZoneCard'

const getNextPlayer = () => {
  let nextPlayer = gameTable.value.turnStats.activePlayerIndex + 1
  if (nextPlayer >= gameTable.value.players.length) {
    nextPlayer = 0
  }
  return nextPlayer
}

const drawNewCards = (nextPlayer: number) => {
  const { handCards } = useHandCards()

  const newCardDrawn = gameTable.value.draftDeck.pop()
  const currentMaxHand = gameTable.value.players[nextPlayer].currentMaxHand

  if (
    newCardDrawn &&
    handCards.value.hand[nextPlayer].filter((item) => item).length !==
      currentMaxHand
  ) {
    handCards.value.hand[nextPlayer] = handCards.value.hand[nextPlayer].map(
      (handCard) => {
        if (!handCard) {
          return newCardDrawn!
        }
        return handCard
      },
    )
  }

  if (
    handCards.value.hand[nextPlayer].filter(
      (item) => item && item.type === CARD_TYPES.DEFENSE,
    ).length === currentMaxHand
  ) {
    handCards.value.hand[nextPlayer] = handCards.value.hand[nextPlayer].map(
      () => {
        if (gameTable.value.draftDeck.length >= 1) {
          return gameTable.value.draftDeck.pop()
        }
        return undefined
      },
    )
  }
}

const attack = () => {
  const activePlayer = gameTable.value.turnStats.activePlayerIndex
  const nextPlayer = getNextPlayer()

  const damage =
    gameTable.value.players[activePlayer].vCharacter.ATK -
    gameTable.value.players[nextPlayer].vCharacter.DEF

  if (damage > 0) {
    useLayerManager().setLayer('DamageLayer', {
      props: {
        damage,
        nextPlayer: getNextPlayer(),
      },
      next: (data?: unknown) => {
        const defenseCard = data as ICard

        useLayerManager().unsetLayer()

        let calculatedDamage = damage

        if (defenseCard) {
          if (defenseCard.name === 'card.defense.ricochetRule') {
            calculatedDamage = Math.round(calculatedDamage / 2)

            gameTable.value.players[nextPlayer].vCharacter.HP =
              gameTable.value.players[nextPlayer].vCharacter.HP -
              calculatedDamage

            gameTable.value.players[activePlayer].vCharacter.HP =
              gameTable.value.players[activePlayer].vCharacter.HP -
              calculatedDamage
          } else if (defenseCard.name === 'card.defense.counterShotRule') {
            gameTable.value.players[nextPlayer].vCharacter.HP =
              gameTable.value.players[nextPlayer].vCharacter.HP -
              calculatedDamage

            gameTable.value.players[activePlayer].vCharacter.HP =
              gameTable.value.players[activePlayer].vCharacter.HP - 1
          } else if (defenseCard.name === 'card.defense.duckAndRoll') {
            // no further handling - no damage
          } else if (defenseCard.name === 'card.defense.blocking') {
            calculatedDamage = calculatedDamage - 2

            if (calculatedDamage > 0) {
              gameTable.value.players[nextPlayer].vCharacter.HP =
                gameTable.value.players[nextPlayer].vCharacter.HP -
                calculatedDamage
            }
          } else if (defenseCard.name === 'card.defense.timeDistortion') {
            if (
              gameTable.value.players[activePlayer].vCharacter.SPD -
                gameTable.value.players[nextPlayer].vCharacter.SPD <
              2
            ) {
              gameTable.value.players[nextPlayer].vCharacter.HP =
                gameTable.value.players[nextPlayer].vCharacter.HP -
                calculatedDamage
            }
          }
        } else {
          gameTable.value.players[nextPlayer].vCharacter.HP =
            gameTable.value.players[nextPlayer].vCharacter.HP - damage
        }

        calculateStats()

        gameTable.value.turnStats.activePlayerIndex

        if (
          gameTable.value.players[nextPlayer].vCharacter.HP <= 0 ||
          gameTable.value.players[activePlayer].vCharacter.HP <= 0
        ) {
          gameTable.value.players[nextPlayer].vCharacter.HP === 0
          gameTable.value.players[activePlayer].vCharacter.HP === 0
          gameTable.value.gameEnds = true
        } else {
          endTurn()
        }
      },
    })
  } else {
    endTurn()
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

  gameTable.value.players[
    gameTable.value.turnStats.activePlayerIndex
  ].tmpStats = {}

  const nextPlayer = getNextPlayer()
  gameTable.value.turnStats.activePlayerIndex = nextPlayer

  const newZoneCardDrawn = gameTable.value.zoneDraftDeck.pop()!

  if (handCards.value.zone[nextPlayer].filter((item) => item).length === 0) {
    handCards.value.zone[nextPlayer][0] = newZoneCardDrawn
    for (let i = 1; i < 5; i++) {
      handCards.value.zone[nextPlayer][i] = gameTable.value.zoneDraftDeck.pop()!
    }
  } else if (handCards.value.zone[nextPlayer].length < 5) {
    handCards.value.zone[nextPlayer] = handCards.value.zone[nextPlayer].map(
      (zoneCard) => {
        if (!zoneCard) {
          return newZoneCardDrawn
        }
        return zoneCard
      },
    )
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
        }
      }
    }

    gameTable.value.players[playerIndex].vCharacter = tmpVCharacter
  }
}

const INITIAL_MAX_HAND = 7

export default () => {
  const { handCards, setNewCards } = useHandCards()

  return {
    getNextPlayer,
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
        currentMaxHand: INITIAL_MAX_HAND,
        cardsPlayed: false,
        selectedCards: {
          zoneCard: null,
          handCard: null,
        },
        boardStack: [[], [], [], [], [], [], [], []],

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
          gameTable.value.draftDeck.splice(
            INITIAL_MAX_HAND * -1,
            INITIAL_MAX_HAND,
          ),
        )
      })
    },
    setZoneCard: (cardIndex: number, playerIndex: number) => {
      gameTable.value.players[playerIndex].selectedCards.zoneCard = cardIndex
    },
    setHandCard: (cardIndex: number, playerIndex: number) => {
      gameTable.value.players[playerIndex].selectedCards.handCard = cardIndex
    },
    playCharacterEffect: (playerIndex: number) => {
      // todo: play effect of character
    },
    endTurn,
    attack,
    playCards: (playerIndex: number) => {
      const { handCards } = useHandCards()

      const { zoneCard, handCard } =
        gameTable.value.players[playerIndex].selectedCards

      if (zoneCard !== null && handCard !== null) {
        const currentPlayer = gameTable.value.players[playerIndex]

        const boardStackTarget = (
          handCards.value['zone'][playerIndex][zoneCard!]! as IZoneCard
        ).zones[0]
        const cardToPlace = handCards.value['hand'][playerIndex][handCard!]

        const targetPlayer =
          cardToPlace && cardToPlace.type === CARD_TYPES.EVENT
            ? getNextPlayer()
            : playerIndex

        if (cardToPlace?.type === CARD_TYPES.EVENT) {
          if (cardToPlace?.name === 'card.event.healing') {
            gameTable.value.players[playerIndex].vCharacter.HP =
              gameTable.value.players[playerIndex].vCharacter.HP + 2

            if (
              gameTable.value.players[playerIndex].vCharacter.HP >
              gameTable.value.players[playerIndex].character.HP
            ) {
              gameTable.value.players[playerIndex].vCharacter.HP =
                gameTable.value.players[playerIndex].character.HP
            }
          }
        }

        gameTable.value.players[targetPlayer].boardStack[boardStackTarget].push(
          cardToPlace,
        )

        handCards.value['zone'][playerIndex][zoneCard!] = undefined
        handCards.value['hand'][playerIndex][handCard!] = undefined

        gameTable.value.players[playerIndex].selectedCards = {
          zoneCard: null,
          handCard: null,
        }

        gameTable.value.players[playerIndex].cardsPlayed = true

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
