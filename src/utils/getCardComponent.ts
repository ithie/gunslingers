import Characters from '../components/Characters/Characters.vue'
import DefenseCard from '../components/DefenseCard/DefenseCard.vue'
import EventCard from '../components/EventCard/EventCard.vue'
import ModificationCard from '../components/ModificationCard/ModificationCard.vue'
import ZoneCard from '../components/ZoneCard/ZoneCard.vue'
import { CARD_TYPES } from '../constants'

const CARD_MAP: {
  [key in Exclude<keyof typeof CARD_TYPES, 'EMPTY_STACK'>]:
    | typeof EventCard
    | typeof ModificationCard
    | typeof DefenseCard
    | typeof Characters
    | typeof ZoneCard
} = {
  [CARD_TYPES.EVENT]: EventCard,
  [CARD_TYPES.MODIFICATION]: ModificationCard,
  [CARD_TYPES.DEFENSE]: DefenseCard,
  [CARD_TYPES.CHARACTER]: Characters,
  [CARD_TYPES.ZONE]: ZoneCard,
} as const

const getCardComponent = (type: keyof typeof CARD_TYPES) => {
  if (type === CARD_TYPES.EMPTY_STACK || !CARD_TYPES[type]) {
    return null
  }

  return CARD_MAP[type]
}

type CardComponentType = NonNullable<ReturnType<typeof getCardComponent>>

export type CardProps = InstanceType<CardComponentType>['$props']

export default getCardComponent
