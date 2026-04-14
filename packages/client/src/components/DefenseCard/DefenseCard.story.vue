<template>
  <Story title="Defense Card">
    <Variant title="With rule">
      <DefenseCard
        :player-index="1"
        rule-label="defense card rule label"
        name="card.defense.blocking"
      />
    </Variant>
    <Variant title="Without rule">
      <DefenseCard :player-index="1" name="card.defense.blocking" />
    </Variant>
    <Variant title="With rule, wrapped by Card">
      <Card
        :player-index="1"
        :index="1"
        :type="CARD_TYPES.DEFENSE"
        name="card.defense.blocking"
      >
        <DefenseCard
          :player-index="1"
          rule-label="defense card rule label"
          name="card.defense.blocking"
        />
      </Card>
    </Variant>
    <Variant title="Without rule, wrapped by Card">
      <Card
        :player-index="1"
        :index="1"
        :type="CARD_TYPES.DEFENSE"
        name="card.defense.blocking"
      >
        <DefenseCard :player-index="1" name="card.defense.blocking" />
      </Card>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { CARD_TYPES } from '../../../../interfaces/src/constants'
import Card from '../Card/Card.vue'
import DefenseCard from './DefenseCard.vue'
</script>
