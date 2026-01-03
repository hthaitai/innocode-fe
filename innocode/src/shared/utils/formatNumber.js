// Format score with commas (no rounding, display as backend sends)
export const formatScore = (score) => {
  if (score == null || score === undefined || score === null) return "—"
  // Convert to string and add thousand separators without rounding
  const scoreStr = String(score)
  // Check if it's a decimal number
  if (scoreStr.includes('.')) {
    const parts = scoreStr.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join('.')
  }
  return scoreStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
