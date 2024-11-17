export const getYears = (initialYear: number) => {
  const currentYear = new Date().getFullYear()
  if (initialYear > currentYear) {
    throw new Error('The initial year must be lower than the current year')
  }

  return Array.from(
    { length: currentYear - initialYear + 1 },
    (_, i) => initialYear++,
  )
}
