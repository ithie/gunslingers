<template>
  <div style="height: 100%; width: 100%; position: relative">
    <div
      class="character"
      :style="{ backgroundImage: 'url(' + imgSrc + ')' }"
    ></div>
    <div class="stats">
      <div>HP: {{ HP }}</div>
      <div>ATK: {{ ATK }}</div>
      <div>DEF:{{ DEF }}</div>
      <div>SPD:{{ SPD }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CARD_TYPES } from '../../enums'
import IEffect from '../../interfaces/IEffect'
import gunslingerImg from './assets/gunslinger.png'
import gamblerImg from './assets/gambler.png'
import headhunterImg from './assets/headhunter.png'
import { computed } from 'vue'

const { name } = defineProps<{
  name: string
  HP: number
  ATK?: number
  DEF?: number
  SPD?: number
  type: CARD_TYPES
  effect?: IEffect
}>()

const imgMap: Record<string, string> = {
  'character.gunslinger': gunslingerImg,
  'character.gambler': gamblerImg,
  'character.headhunter': headhunterImg,
}

const imgSrc = computed(() => imgMap[name])
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
.character {
  position: absolute;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
