<template>
  <Story title="Card">
    <Variant title="Type Defense">
      <Card :index="2" :type="CARD_TYPES.DEFENSE">DEFENSE</Card>
    </Variant>
    <Variant title="Type Modification">
      <Card :index="2" :type="CARD_TYPES.MODIFICATION">MODIFICATION</Card>
    </Variant>
    <Variant title="Type Event">
      <Card :index="2" :type="CARD_TYPES.EVENT">EVENT</Card>
    </Variant>
    <Variant title="Type Character">
      <Card :index="2" :type="CARD_TYPES.CHARACTER">CHARACTER</Card>
    </Variant>
    <Variant title="Type Zone">
      <Card :index="2" :type="CARD_TYPES.ZONE">ZONE</Card>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { CARD_TYPES } from '../../enums'
import Card from './Card.vue'
</script>
