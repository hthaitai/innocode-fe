// Format score with commas and limit to 2 decimal places
export const formatScore = (score) => {
  if (score == null || score === undefined || score === null) return "—"

  // Convert to number and round to 2 decimal places
  const numScore = Number(score)
  if (isNaN(numScore)) return "—"

  // Round to 2 decimal places and remove trailing zeros
  const rounded = parseFloat(numScore.toFixed(2))
  const scoreStr = String(rounded)

  // Check if it's a decimal number
  if (scoreStr.includes(".")) {
    const parts = scoreStr.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".")
  }
  return scoreStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
