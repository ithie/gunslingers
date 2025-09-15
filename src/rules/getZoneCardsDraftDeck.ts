import IZoneCard from '../interfaces/IZoneCard'
import shuffle from './shuffle'

export default (): IZoneCard[] => {
  const zoneCardsStack: IZoneCard[] = []
  for (let zoneCardPlacement = 0; zoneCardPlacement < 8; zoneCardPlacement++) {
    for (let zoneCardAmount = 0; zoneCardAmount < 6; zoneCardAmount++) {
      zoneCardsStack.push({ name: '', zones: [zoneCardPlacement] })
    }
  }
  return shuffle<IZoneCard>(zoneCardsStack)
}
