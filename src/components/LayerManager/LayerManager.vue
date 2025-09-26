<template>
  <div class="layerContainer" v-if="layer">
    <div class="innerLayerContainer">
      <component :is="layer" v-bind="props" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Component, computed } from 'vue'
import useLayerManager from './useLayerManager'
import DamageLayer from './DamageLayer.vue'

const { layerState } = useLayerManager()

const layers: Record<string, Component> = {
  DamageLayer,
}

const props = computed(() => layerState.value?.data || {})
const layer = computed(() => {
  if (!layerState.value.layerName) {
    return null
  }

  return layers[layerState.value.layerName]
})
</script>

<style lang="scss">
.layerContainer {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.innerLayerContainer {
  position: relative;
  background-color: beige;
  width: auto;
  height: auto;
}
</style>
