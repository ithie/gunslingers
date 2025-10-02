<template>
  <div
    :class="styleClasses"
    :style="`height: ${height}px; width: ${width}px`"
    @click="onClick"
  >
    <div class="card-container">
      <div class="name" v-if="name">{{ $t(name) }}</div>
      <div class="content"><slot /></div>
      <div class="name" v-if="name">{{ $t(name) }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { CARD_TYPES } from '../../constants'
import useCardSelect from '../../composables/useCardSelect/useCardSelect'

const {
  type,
  name,
  clickable = false,
  index,
  playerIndex,
} = defineProps<{
  type: keyof typeof CARD_TYPES
  name?: string
  clickable?: boolean
  index: number
  playerIndex: number
}>()

const { select, isSelected } = useCardSelect(
  index,
  playerIndex,
  type === CARD_TYPES.ZONE ? 'zoneCard' : 'handCard',
)

const onClick = () => {
  if (clickable) {
    select()
  }
}

const ratio = 1.4
const height = 150
const width = height / ratio

const styleClasses = computed(() => [
  'card',
  `type-${type}`,
  { selected: clickable && isSelected.value },
])
</script>
<style lang="scss">
.card-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-weight: bold;
  .name {
    font-size: 12px;
    flex-grow: 0;
  }
  .content {
    height: auto;
    width: 100%;
    flex-grow: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
.selected {
  opacity: 0.5;
}
.card {
  cursor: pointer;
  background-color: white;
  border: 3px solid black;
  border-radius: 10px;
  overflow: hidden;
  display: block;
}
.type-DEFENSE {
  border-color: blue;
}
.type-MODIFICATION {
  border-color: green;
}
.type-EVENT {
  border-color: red;
}
.type-CHARACTER {
  border-color: black;
}
.type-EMPTY_STACK {
  border-style: dashed;
}
</style>
