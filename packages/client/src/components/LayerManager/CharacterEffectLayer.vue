<template>
  <div class="effectContainer">
    <h3 class="headline">{{ headline }}</h3>
    <p class="hint">Bitte genau {{ count }} {{ count === 1 ? 'Karte' : 'Karten' }} auswählen</p>

    <div class="cardsRow">
      <div
        v-for="(card, i) in availableCards"
        :key="i"
        :class="['cardSlot', { selected: selectedIndices.includes(i) }]"
        @click="toggleCard(i)"
      >
        <template v-if="card">
          <component
            :is="getCardComponent(card.type)"
            v-bind="{ ...(card as CardProps) }"
            :player-index="playerIndex"
          />
          <span class="cardName">{{ $t(card.name) }}</span>
        </template>
      </div>
    </div>

    <div class="actions">
      <button
        class="btn-confirm"
        :disabled="selectedIndices.length !== count"
        @click="confirm"
      >
        Bestätigen ({{ selectedIndices.length }}/{{ count }})
      </button>
      <button class="btn-cancel" @click="cancel">Abbrechen</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ILayerData } from './useLayerManager'
import useHandCards from '../HandCards/useHandCards'
import getCardComponent, { CardProps } from '../../utils/getCardComponent'
import ICard from '../../../../interfaces/src/ICard'

const { props, next } = defineProps<ILayerData>()

const playerIndex = computed(() => props.playerIndex as number)
const count = computed(() => props.count as number)
const headline = computed(() => props.headline as string)

const { handCards } = useHandCards()
const availableCards = computed(() =>
  handCards.value.hand[playerIndex.value] ?? [],
)

const selectedIndices = ref<number[]>([])

function toggleCard(i: number) {
  const card = availableCards.value[i]
  if (!card) return

  const pos = selectedIndices.value.indexOf(i)
  if (pos !== -1) {
    selectedIndices.value.splice(pos, 1)
  } else if (selectedIndices.value.length < count.value) {
    selectedIndices.value.push(i)
  }
}

function confirm() {
  if (selectedIndices.value.length === count.value) {
    next([...selectedIndices.value])
  }
}

function cancel() {
  next([])
}
</script>

<style scoped>
.effectContainer {
  background: beige;
  padding: 1.25rem;
  max-width: 600px;
}
.headline {
  margin: 0 0 0.25rem;
}
.hint {
  color: #555;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}
.cardsRow {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.cardSlot {
  border: 3px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.15s, background 0.15s;
  min-width: 80px;
}
.cardSlot:hover {
  border-color: #888;
}
.cardSlot.selected {
  border-color: #b5420a;
  background: #fff0e8;
}
.cardName {
  display: block;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #333;
}
.actions {
  display: flex;
  gap: 0.75rem;
}
.btn-confirm {
  background: #b5420a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-cancel {
  background: transparent;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
