export const validateContest = (data, existingContests = []) => {
  const errors = {}
  const now = new Date()

  // ---- Year ----
  const yearValue = data.year != null ? String(data.year).trim() : ""
  if (!yearValue) {
    errors.year = "Year is required"
  } else if (isNaN(Number(yearValue))) {
    errors.year = "Year must be a number"
  } else if (Number(yearValue) < 2025) {
    errors.year = "Year must be equal or greater than 2025"
  }

  // ---- Name ----
  const nameValue = String(data.name ?? "").trim()
  if (!nameValue) {
    errors.name = "Contest name is required"
  } else if (
    existingContests.some(
      (c) => c.name === nameValue && c.year === Number(data.year)
    )
  ) {
    errors.name = "A contest with this name already exists for this year"
  }

  // ---- Image URL ----
  if (data.imgUrl && !/^https?:\/\/.+\..+/.test(data.imgUrl)) {
    errors.imgUrl = "Please enter a valid URL (must start with http or https)"
  }

  // ---- Start Date ----
  if (!data.start) {
    errors.start = "Start date is required"
  } else if (new Date(data.start) < now) {
    errors.start = "Start date cannot be in the past"
  }

  // ---- End Date ----
  if (!data.end) {
    errors.end = "End date is required"
  } else if (data.start && new Date(data.end) <= new Date(data.start)) {
    errors.end = "End date must be after the start date"
  } else if (new Date(data.end) < now) {
    errors.end = "End date cannot be in the past"
  }

  return errors
}
