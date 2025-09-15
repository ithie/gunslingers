export default <T = unknown>(array: Array<T>): Array<T> => {
  const toSort = [...array]
  for (let i = toSort.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[toSort[i], toSort[j]] = [toSort[j], toSort[i]]
  }
  return toSort
}
