<template>
  <div class="handCardsContainer">
    <div v-if="!defense || !cannotDefend" class="cardsContainer">
      <div class="cardItem" v-for="(zoneCard, index) in zoneCards" :key="index">
        <Card
          v-if="zoneCard && zoneCard?.zones"
          :index="index"
          :player-index="playerIndex"
          clickable
          :type="CARD_TYPES.ZONE"
          :name="zoneCard.name"
        >
          <ZoneCard v-bind="zoneCard" />
        </Card>
        <Card
          v-else
          :player-index="playerIndex"
          :index="index"
          :type="CARD_TYPES.EMPTY_STACK"
          name=""
        />
      </div>
    </div>
    <div>
      <template v-if="defense">
        {{ noDefendCardsSelected }}
        <button
          v-if="!cannotDefend"
          :disabled="noDefendCardsSelected"
          @click="callDefend"
        >
          {{ $t('defend') }}
        </button>
        <button v-if="!cannotDefend" @click="callNext">
          {{ $t('noDefense') }}
        </button>
        <button v-if="cannotDefend" @click="callNext">
          {{ $t('endTurn') }}
        </button>
      </template>
      <template v-else>
        <button v-if="!cardsPlayed" @click="() => playCards(playerIndex)">
          Karten legen
        </button>
        <button v-if="cardsPlayed && canAttack" @click="attack">
          Angreifen
        </button>
        <button v-if="cardsPlayed" @click="endTurn">Zug beenden</button>
      </template>
    </div>
    <div v-if="!defense || !cannotDefend" class="cardsContainer">
      <div class="cardItem" v-for="(handCard, index) in hand" :key="index">
        <Card
          v-if="
            (defense && handCard && handCard.type === CARD_TYPES.DEFENSE) ||
            (!defense && handCard && handCard.type)
          "
          :index="index"
          :player-index="playerIndex"
          :clickable="
            defense || (isPlayerActive && handCard.type !== CARD_TYPES.DEFENSE)
          "
          :type="handCard.type"
          :name="isPlayerActive ? handCard.name : ''"
        >
          <component
            v-if="isPlayerActive || defense"
            :is="CARD_MAP[handCard.type!]"
            v-bind="handCard"
          />
        </Card>
        <Card
          v-else-if="!defense"
          :index="index"
          :player-index="playerIndex"
          :type="CARD_TYPES.EMPTY_STACK"
          name=""
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { CARD_TYPES } from '../../enums'
import Card from '../Card/Card.vue'
import ZoneCard from '../ZoneCard/ZoneCard.vue'
import useGameTable from '../../composables/useGameTable'
import ModificationCard from '../ModificationCard/ModificationCard.vue'
import DefenseCard from '../DefenseCard/DefenseCard.vue'
import EventCard from '../EventCard/EventCard.vue'
import Characters from '../Characters/Characters.vue'
import ICard from '../../interfaces/ICard'

const { playerIndex, defense } = defineProps<{
  playerIndex: number
  defense?: boolean
}>()

const CARD_MAP = {
  [CARD_TYPES.EVENT]: EventCard,
  [CARD_TYPES.MODIFICATION]: ModificationCard,
  [CARD_TYPES.DEFENSE]: DefenseCard,
  [CARD_TYPES.CHARACTER]: Characters,
  [CARD_TYPES.ZONE]: ZoneCard,
}

const { gameTable, playCards, attack, endTurn } = useGameTable()

const callNext = () => {
  if (gameTable.value.showDamage && gameTable.value.showDamage.next) {
    gameTable.value.showDamage.next()
  } else {
    endTurn()
  }
}

const callDefend = () => {
  const { handCard } = gameTable.value.players[playerIndex].selectedCards

  let defenseCard

  if (handCard) {
    defenseCard = gameTable.value.players[playerIndex].hand[handCard]
    console.log('DC', defenseCard)
  }

  playCards(playerIndex)

  if (gameTable.value.showDamage) {
    gameTable.value.showDamage.next(defenseCard)
  }
}

const noDefendCardsSelected = computed(() => {
  const { handCard, zoneCard } =
    gameTable.value.players[playerIndex].selectedCards

  return !handCard && !zoneCard
})

const player = computed(() => gameTable.value.players[playerIndex])

const cardsPlayed = computed(
  () => gameTable.value.players[playerIndex].cardsPlayed,
)
const zoneCards = computed(() => player.value.zoneCards)
const hand = computed(() => player.value.hand)

const isPlayerActive = computed(
  () => playerIndex === gameTable.value.turnStats.activePlayerIndex,
)

const cannotDefend = computed(() => {
  return (
    player.value.hand.filter(
      (handCard) => handCard && handCard.type === CARD_TYPES.DEFENSE,
    ).length <= 0
  )
})

const canAttack = computed(() => {
  let noHeadButt = true
  gameTable.value.players[
    gameTable.value.turnStats.activePlayerIndex
  ].boardStack.forEach((handCard: unknown[]) => {
    if (
      handCard &&
      handCard.length > 0 &&
      (handCard[0] as ICard)?.type === CARD_TYPES.EVENT
    ) {
      if ((handCard[0] as ICard)?.name === 'card.event.headButt') {
        noHeadButt = false
      }
    }
  })

  return noHeadButt
})
</script>
<style lang="scss">
.cardsContainer {
  display: flex;
  gap: 5px;
  flex-direction: row;
  flex-wrap: nowrap;
}
.cardItem {
  display: inline-flex;
}
.handCardsContainer {
  display: flex;
  flex-direction: column;
  gap: 15px 50px;
}
</style>
