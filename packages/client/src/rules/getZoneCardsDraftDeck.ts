import { CARD_TYPES } from '../../../interfaces/src/constants'
import IZoneCard from '../../../interfaces/src/IZoneCard'
import shuffle from './shuffle'

// Slot-Positionen 0–7 entsprechen den 8 benannten Feldern
// Slot 8 = Sonderkarte "ALLE FELDER" (belegt alle 8 Felder gleichzeitig)
export const ALL_ZONES = [0, 1, 2, 3, 4, 5, 6, 7]

export const ZONE_LABELS: Record<number, string> = {
  0: 'zone.topRight',
  1: 'zone.topCenter',
  2: 'zone.topLeft',
  3: 'zone.middleRight',
  4: 'zone.middleLeft',
  5: 'zone.bottomRight',
  6: 'zone.bottomCenter',
  7: 'zone.bottomLeft',
}

export default (): IZoneCard[] => {
  const stack: IZoneCard[] = []

  // 8 normale Positionen × 6 Karten
  for (let pos = 0; pos < 8; pos++) {
    for (let n = 0; n < 6; n++) {
      stack.push({
        name: ZONE_LABELS[pos] ?? '',
        type: CARD_TYPES.ZONE,
        zones: [pos],
      })
    }
  }

  // "ALLE FELDER" × 6 Karten
  for (let n = 0; n < 6; n++) {
    stack.push({
      name: 'zone.allFields',
      type: CARD_TYPES.ZONE,
      zones: ALL_ZONES,
    })
  }

  return shuffle<IZoneCard>(stack)
}
