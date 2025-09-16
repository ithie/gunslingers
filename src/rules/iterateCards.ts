export default <T = unknown>(
  cards: Array<T>,
  amountPerCards: number,
): Array<T> => {
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
