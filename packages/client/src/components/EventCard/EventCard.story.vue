<template>
  <Story title="Event Card">
    <Variant title="With all fields">
      <EventCard
        :player-index="1"
        rule-label="event card rule label"
        name="card.event.weaken"
      />
      <EventCard
        :HP="10"
        :ATK="-3"
        :SPD="4"
        :DEF="-1"
        :player-index="1"
        rule-label="event card rule label"
        name="card.event.weaken"
      />
    </Variant>
    <Variant title="Without all fields">
      <EventCard :player-index="1" name="card.event.ewaken" />
    </Variant>
    <Variant title="With all fields, wrapped by Card">
      <Card
        :player-index="1"
        :index="1"
        :type="CARD_TYPES.EVENT"
        name="card.event.weaken"
      >
        <EventCard
          :player-index="1"
          rule-label="event card rule label"
          name="card.event.weaken"
        />
      </Card>
      <Card
        :player-index="1"
        :index="1"
        :type="CARD_TYPES.EVENT"
        name="card.event.weaken"
      >
        <EventCard
          :HP="10"
          :ATK="-3"
          :SPD="4"
          :DEF="-1"
          :player-index="1"
          rule-label="event card rule label"
          name="card.event.weaken"
        />
      </Card>
    </Variant>
    <Variant title="Without any fields, wrapped by Card">
      <Card
        :player-index="1"
        :index="1"
        :type="CARD_TYPES.EVENT"
        name="card.event.weaken"
      >
        <EventCard :player-index="1" name="card.event.weaken" />
      </Card>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { CARD_TYPES } from '../../../../interfaces/src/constants'
import Card from '../Card/Card.vue'
import EventCard from './EventCard.vue'
</script>
