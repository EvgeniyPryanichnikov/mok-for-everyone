export function shuffle<T>(source: T[]): T[] {
  const copy = [...source]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    const random = copy[randomIndex]

    if (current === undefined || random === undefined) {
      continue
    }

    copy[index] = random
    copy[randomIndex] = current
  }

  return copy
}
