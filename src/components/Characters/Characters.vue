<template>
  <div style="position: relative">
    <Gunslinger v-if="name === 'character.gunslinger'" />
    <Gambler v-if="name === 'character.gambler'" />
    <Headhunter v-if="name === 'character.headhunter'" />
    <div class="stats">
      <div>HP: {{ HP }}</div>
      <div>ATK: {{ ATK }}</div>
      <div>DEF:{{ DEF }}</div>
      <div>SPD:{{ SPD }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Gunslinger from './Gunslinger.vue'
import Gambler from './Gambler.vue'
import Headhunter from './Headhunter.vue'
import { CARD_TYPES } from '../../enums'
import IEffect from '../../interfaces/IEffect'

defineProps<{
  name: string
  HP: number
  ATK?: number
  DEF?: number
  SPD?: number
  type: CARD_TYPES
  effect: IEffect
}>()
</script>
<style lang="scss">
.stats {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  background-color: none;
  div {
    padding: 2px;
    background-color: white;
    opacity: 0.8;
  }
}
</style>
