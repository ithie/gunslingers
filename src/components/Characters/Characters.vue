<template>
  <div style="height: 100%; width: 100%; position: relative">
    <div
      class="character"
      :style="{ backgroundImage: 'url(' + imgSrc + ')' }"
    ></div>
    <div class="stats">
      <div>{{ $t('hp') }}: {{ HP }}</div>
      <div>{{ $t('atk') }}: {{ ATK }}</div>
      <div>{{ $t('def') }}:{{ DEF }}</div>
      <div>{{ $t('spd') }}:{{ SPD }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CARD_TYPES } from '../../enums'
import { type Effect } from '../../interfaces/IEffect'
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
  effect?: Effect
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
  position: relative;
  div {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 2px 5px;
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
