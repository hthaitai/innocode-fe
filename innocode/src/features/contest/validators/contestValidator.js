export const validateContest = (data, { isEdit = false } = {}) => {
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
  }

  // ---- Image URL ----
  if (data.imgUrl && !/^https?:\/\/.+\..+/.test(data.imgUrl)) {
    errors.imgUrl = "Please enter a valid URL (must start with http or https)"
  }

  // ---- Start Date ----
  if (!data.start) {
    errors.start = "Start date is required"
  } else if (!isEdit && new Date(data.start) < now) {
    errors.start = "Start date cannot be in the past"
  }

  // ---- End Date ----
  if (!data.end) {
    errors.end = "End date is required"
  } else if (data.start && new Date(data.end) <= new Date(data.start)) {
    errors.end = "End date must be after the start date"
  } else if (!isEdit && new Date(data.end) < now) {
    errors.end = "End date cannot be in the past"
  }

  // ---- Registration Dates ----
  if (!data.registrationStart) {
    errors.registrationStart = "Registration start date is required"
  } else if (!isEdit && new Date(data.registrationStart) < now) {
    errors.registrationStart = "Registration start cannot be in the past"
  }

  if (!data.registrationEnd) {
    errors.registrationEnd = "Registration end date is required"
  } else if (
    data.registrationStart &&
    new Date(data.registrationEnd) <= new Date(data.registrationStart)
  ) {
    errors.registrationEnd = "Registration end must be after registration start"
  } else if (
    data.start &&
    new Date(data.registrationEnd) > new Date(data.start)
  ) {
    errors.registrationEnd =
      "Registration end cannot be after contest start date"
  } else if (!isEdit && new Date(data.registrationEnd) < now) {
    errors.registrationEnd = "Registration end cannot be in the past"
  }

  // ---- Team Members ----
  if (data.teamMembersMax == null || data.teamMembersMax === "") {
    errors.teamMembersMax = "Team member limit is required"
  } else if (data.teamMembersMax < 1 || data.teamMembersMax > 50) {
    errors.teamMembersMax = "Team members must be between 1 and 50"
  }

  // ---- Team Limit ----
  if (data.teamLimitMax == null || data.teamLimitMax === "") {
    errors.teamLimitMax = "Team limit is required"
  } else if (data.teamLimitMax < 1 || data.teamLimitMax > 10000) {
    errors.teamLimitMax = "Team limit must be between 1 and 10000"
  }

  return errors
}
