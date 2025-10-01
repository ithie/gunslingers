<template>
  <div class="container">
    <div v-if="ruleLabel" data-testid="rule-label">{{ $t(ruleLabel) }}</div>
    <div class="item" v-for="(modification, key) in modifications" :key="key">
      {{ modification.key }} {{ modification.value }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ComputedRef } from 'vue'
import useCard from '../Card/useCard'

const { ATK, DEF, SPD, playerIndex, hasEffect, name } = defineProps<{
  ruleLabel?: string
  ATK?: number
  DEF?: number
  SPD?: number
  playerIndex: number
  hasEffect?: boolean
  name: string
}>()

useCard(playerIndex, hasEffect, name)

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
