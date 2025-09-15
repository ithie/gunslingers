import getDefenseCards from './getDefenseCards'
import getEventCards from './getEventCards'
import getModificationCards from './getModificationCards'
import shuffle from './shuffle'

export default () =>
  shuffle([getDefenseCards(), getModificationCards(), getEventCards()].flat())
