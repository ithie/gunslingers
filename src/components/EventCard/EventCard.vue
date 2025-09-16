<template>
  <div>
    {{ ruleLabel }}
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  ruleLabel?: string
}>()
</script>
