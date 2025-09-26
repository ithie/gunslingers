<template>
  <div class="container">
    <div v-if="ruleLabel">{{ $t(ruleLabel) }}</div>
    <div class="item" v-for="(modification, key) in modifications" :key="key">
      {{ modification.key }} {{ modification.value }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ComputedRef } from 'vue'

const { ATK, DEF, SPD } = defineProps<{
  ruleLabel?: string
  ATK?: number
  DEF?: number
  SPD?: number
}>()

const modifications: ComputedRef<{ key: string; value: number | undefined }[]> =
  computed(() =>
    [
      {
        key: 'ATK',
        value: ATK,
      },
      {
        key: 'DEF',
        value: DEF,
      },
      {
        key: 'SPD',
        value: SPD,
      },
    ].filter((item): boolean => !!item.value),
  )
</script>
