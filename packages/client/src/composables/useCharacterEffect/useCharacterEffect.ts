import useGameTable from '../useGameTable/useGameTable'
import useHandCards from '../../components/HandCards/useHandCards'
import useLayerManager from '../../components/LayerManager/useLayerManager'
import {
  CHARACTER_EFFECTS,
  EffectContext,
  EffectTrigger,
} from '../../rules/characterEffects'
import { VALUE_TYPES } from '../../../../interfaces/src/constants'

/**
 * Baut den EffectContext und führt den Charakter-Effekt aus,
 * sofern einer für den Trigger registriert ist.
 */
export default () => {
  const {
    gameTable,
    getNextPlayer,
    endTurn,
  } = useGameTable()

  const { handCards } = useHandCards()

  function buildContext(
    playerIndex: number,
    attackDamageDealt?: number,
  ): EffectContext {
    const opponentIndex = getNextPlayer()

    return {
      playerIndex,
      opponentIndex,
      gameTable: gameTable.value,
      handCards: handCards.value,
      attackDamageDealt,

      setTmpStat(idx, key, value) {
        gameTable.value.players[idx].tmpStats = {
          ...gameTable.value.players[idx].tmpStats,
          [key]: value,
        }
      },

      discardHandCard(idx, cardIndex) {
        handCards.value.hand[idx][cardIndex] = undefined
      },

      returnCardToDeck(idx, cardIndex) {
        const card = handCards.value.hand[idx][cardIndex]
        if (!card) return
        handCards.value.hand[idx][cardIndex] = undefined
        const insertAt = Math.floor(Math.random() * (gameTable.value.draftDeck.length + 1))
        gameTable.value.draftDeck.splice(insertAt, 0, card)
      },

      drawCard(idx) {
        const newCard = gameTable.value.draftDeck.pop()
        if (!newCard) return
        const slot = handCards.value.hand[idx].findIndex((c) => !c)
        if (slot !== -1) {
          handCards.value.hand[idx][slot] = newCard
        } else {
          handCards.value.hand[idx].push(newCard)
        }
      },

      endTurnImmediately() {
        endTurn()
      },

      showSelectCardsUI(idx, count, headline, onConfirm) {
        useLayerManager().setLayer('CharacterEffectLayer', {
          props: { playerIndex: idx, count, headline },
          next: (data?: unknown) => {
            useLayerManager().unsetLayer()
            const selectedIndices = data as number[]
            if (selectedIndices?.length) {
              onConfirm(selectedIndices)
            }
          },
        })
      },
    }
  }

  return {
    /**
     * Führt den Effekt des aktiven Spielers für den angegebenen Trigger aus.
     * Gibt true zurück wenn ein Effekt ausgeführt wurde.
     */
    triggerEffect(trigger: EffectTrigger, playerIndex: number, attackDamageDealt?: number): boolean {
      const characterName = gameTable.value.players[playerIndex]?.character?.name
      if (!characterName) return false

      const effectDef = CHARACTER_EFFECTS[characterName]
      if (!effectDef || effectDef.trigger !== trigger) return false
      if (effectDef.optional) return false  // optionale Effekte werden per Button ausgelöst

      const ctx = buildContext(playerIndex, attackDamageDealt)
      effectDef.execute(ctx)
      return true
    },

    /**
     * Gibt die Definition des optionalen TURN_START-Effekts zurück,
     * falls der Charakter einen hat (für den Button in PlayerZone).
     */
    getOptionalTurnStartEffect(playerIndex: number) {
      const characterName = gameTable.value.players[playerIndex]?.character?.name
      if (!characterName) return null

      const effectDef = CHARACTER_EFFECTS[characterName]
      if (!effectDef || effectDef.trigger !== 'TURN_START' || !effectDef.optional) return null

      return effectDef
    },

    /**
     * Aktiviert den optionalen Effekt eines Spielers (nach Button-Klick).
     */
    activateOptionalEffect(playerIndex: number) {
      const characterName = gameTable.value.players[playerIndex]?.character?.name
      if (!characterName) return

      const effectDef = CHARACTER_EFFECTS[characterName]
      if (!effectDef || !effectDef.optional) return

      const ctx = buildContext(playerIndex)
      effectDef.execute(ctx)
    },
  }
}
