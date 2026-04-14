import ICard from './ICard'

export default interface IZoneCard extends ICard {
  name: string
  zones: number[]
}
