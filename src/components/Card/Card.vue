<template>
  <div :class="styleClasses"><slot /></div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { CARD_TYPES } from '../../enums'

const { type } = defineProps<{ type: CARD_TYPES }>()

const styleClasses = computed(() => ['card', `type-${type}`])
</script>
<style lang="scss">
.card {
  height: 140px;
  width: 100px;
  background-color: white;
  border: 3px solid black;
  border-radius: 10px;
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
