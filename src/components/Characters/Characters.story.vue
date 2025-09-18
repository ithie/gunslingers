<template>
  <Story title="Characters">
    <Variant title="Gunslinger">
      <Characters
        name="character.gunslinger"
        :HP="20"
        :ATK="3"
        :DEF="3"
        :SPD="1"
        :type="CARD_TYPES.CHARACTER"
      />
    </Variant>
    <Variant title="Gambler">
      <Characters
        name="character.gambler"
        :HP="10"
        :ATK="1"
        :DEF="1"
        :SPD="3"
        :type="CARD_TYPES.CHARACTER"
      />
    </Variant>
    <Variant title="Headhunter">
      <Characters
        name="character.headhunter"
        :HP="5"
        :type="CARD_TYPES.CHARACTER"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { CARD_TYPES } from '../../enums'
import Characters from './Characters.vue'
</script>
