<template>
  <div class="damageContainer">
    {{ $t('damage') }}: {{ damage }}<br /><br />
    <HandCards :player-index="nextPlayer" type="hand" />

    <div class="buttonContainer">
      <button @click="callNext">
        {{ $t('dropCards') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import HandCards from '../HandCards/HandCards.vue'
import { ILayerData } from './useLayerManager'
import useGameTable from '../../composables/useGameTable'

const { props, next } = defineProps<ILayerData>()

const damage = computed(() => props.damage as number)
const nextPlayer = computed(() => props.nextPlayer as number)

const { gameTable } = useGameTable()

const callNext = () => {
  next()
}
</script>

<style lang="scss">
.damageContainer {
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 100%;
  background-color: lightcoral;
  margin: 0 auto;
}
.buttonContainer {
  display: block;
  width: 100%;
  padding: 2px;
}
</style>
