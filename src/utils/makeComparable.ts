import { VALUE_TYPES } from '../constants'
import ICard from '../interfaces/ICard'
import ICharacterStats from '../interfaces/ICharacterStats'

export default (
  boardStack: (ICard | undefined)[][],
  vCharacter?: ICharacterStats,
) => {
  let vCharacterToken = ''

  if (vCharacter) {
    vCharacterToken = `${vCharacter[VALUE_TYPES.HP]}:${
      vCharacter[VALUE_TYPES.ATK]
    }:${vCharacter[VALUE_TYPES.SPD]}:${vCharacter[VALUE_TYPES.DEF]}`
  }

  return `${boardStack
    .map((item, index) =>
      !!item.length
        ? `${item && item[0] ? item[0].name : '_'}:${
            item && item[0] ? item[0].type : '_'
          }.`
        : `${index}.`,
    )
    .join('-')}_${vCharacterToken}`
}
