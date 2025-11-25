export const formatScore = (score) => {
  if (score === null || score === undefined) return "—"
  const rounded = Math.round(score * 100) / 100
  return rounded % 1 === 0 ? `${rounded}` : `${rounded.toFixed(2)}`
}
