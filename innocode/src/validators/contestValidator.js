export const validateContest = (data) => {
  const errors = {}

  // ---- Year ----
  const yearValue = data.year != null ? String(data.year).trim() : ""
  if (!yearValue) {
    errors.year = "Year is required"
  } else if (isNaN(Number(yearValue))) {
    errors.year = "Year must be a number"
  }

  // ---- Name ----
  if (!String(data.name ?? "").trim()) {
    errors.name = "Contest name is required"
  }

  // ---- Description ----
  if (!String(data.description ?? "").trim()) {
    errors.description = "Description is required"
  }

  return errors
}
