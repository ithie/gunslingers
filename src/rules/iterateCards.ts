export default (
  cards: Array<unknown>,
  amountPerCards: number,
): Array<unknown> => {
  return cards
    .map((card) => {
      const cardSet = []
      for (let i = 0; i < amountPerCards; i++) {
        cardSet.push(card)
      }

      return cardSet
    })
    .flat()
}
