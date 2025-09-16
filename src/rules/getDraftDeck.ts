import ICard from '../interfaces/ICard'
import getDefenseCards from './getDefenseCards'
import getEventCards from './getEventCards'
import getModificationCards from './getModificationCards'
import shuffle from './shuffle'

export default (): ICard[] =>
  shuffle<ICard>(
    [getDefenseCards(), getModificationCards(), getEventCards()].flat(),
  )
