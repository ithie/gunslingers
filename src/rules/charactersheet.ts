import { Ref } from 'vue'
import { CARD_TYPES, VALUE_TYPES } from '../enums'
import ICharacter from '../interfaces/ICharacter'
import IGameTable from '../interfaces/IGameTable'
import ICard from '../interfaces/ICard'
import useHandCards from '../components/HandCards/useHandCards'

export const gunslingerData: ICharacter = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 3,
  [VALUE_TYPES.DEF]: 2,
  [VALUE_TYPES.SPD]: 1,
  name: 'character.gunslinger',
  type: CARD_TYPES.CHARACTER,
  effect: (data) => {
    /* const { hand } = useHandCards()
    // @todo: korrigieren! Hand ist nun in useHand
    data.own.hand = data.own.hand.map((card?: ICard) => {
      if (card) {
        data.own.tmpStats = {
          ATK: 2,
        }
        return undefined
      }
      return card
    })*/
  },
  effectLabel: 'Tausche am Anfang zwei Karten gegen einmalig +2',
}

export const gamblerData: ICharacter = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 1,
  [VALUE_TYPES.DEF]: 1,
  [VALUE_TYPES.SPD]: 3,
  name: 'character.gambler',
  type: CARD_TYPES.CHARACTER,
  effect: (data) => {
    //
  },
  effectLabel:
    'tausche am Anfange alle Karten gegen maximal 5 neue - runde ist sofort beendet',
}

export const headhunterData: ICharacter = {
  [VALUE_TYPES.HP]: 10,
  [VALUE_TYPES.ATK]: 2,
  [VALUE_TYPES.DEF]: 1,
  [VALUE_TYPES.SPD]: 2,
  name: 'character.headhunter',
  type: CARD_TYPES.CHARACTER,
  effect: (data) => {
    //
  },
  effectLabel:
    'Wenn Du erfolgreich angreifst, kann der Gegner in der nächsten Runde keine Abwehrkarten spielen.',
}
