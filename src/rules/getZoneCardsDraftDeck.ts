import { CARD_TYPES } from '../enums'
import IZoneCard from '../interfaces/IZoneCard'
import shuffle from './shuffle'

// @todo: die Karte für "JEDES FELD" fehlt noch
export default (): IZoneCard[] => {
  const zoneCardsStack: IZoneCard[] = []
  for (let zoneCardPlacement = 0; zoneCardPlacement < 8; zoneCardPlacement++) {
    for (let zoneCardAmount = 0; zoneCardAmount < 6; zoneCardAmount++) {
      zoneCardsStack.push({
        name: '',
        type: CARD_TYPES.ZONE,
        zones: [zoneCardPlacement],
      })
    }
  }
  return shuffle<IZoneCard>(zoneCardsStack)
}
