export const validateContest = (
  data,
  { isEdit = false, t = (key) => key } = {}
) => {
  const errors = {}
  const now = new Date()

  if (!data.imgFile && !data.imgUrl) {
    errors.imgFile = t("contest:validation.imgFile")
  }

  // ---- Year ----
  const yearValue = data.year != null ? String(data.year).trim() : ""
  if (!yearValue) {
    errors.year = t("contest:validation.year")
  } else if (isNaN(Number(yearValue))) {
    errors.year = t("contest:validation.yearNumber")
  } else if (Number(yearValue) < 2025) {
    errors.year = t("contest:validation.yearMin")
  }

  // ---- Name ----
  const nameValue = String(data.name ?? "").trim()
  if (!nameValue) {
    errors.name = t("contest:validation.name")
  }

  // ---- Image URL ----
  if (data.imgUrl && !/^https?:\/\/.+\..+/.test(data.imgUrl)) {
    errors.imgUrl = t("contest:validation.imgUrl")
  }

  // ---- Start Date ----
  if (!data.start) {
    errors.start = t("contest:validation.start")
  } else if (!isEdit && new Date(data.start) < now) {
    errors.start = t("contest:validation.startPast")
  }

  // ---- End Date ----
  if (!data.end) {
    errors.end = t("contest:validation.end")
  } else if (data.start && new Date(data.end) <= new Date(data.start)) {
    errors.end = t("contest:validation.endAfterStart")
  } else if (!isEdit && new Date(data.end) < now) {
    errors.end = t("contest:validation.endPast")
  }

  // ---- Registration Dates ----
  if (!data.registrationStart) {
    errors.registrationStart = t("contest:validation.regStart")
  } else if (!isEdit && new Date(data.registrationStart) < now) {
    errors.registrationStart = t("contest:validation.regStartPast")
  }

  if (!data.registrationEnd) {
    errors.registrationEnd = t("contest:validation.regEnd")
  } else if (
    data.registrationStart &&
    new Date(data.registrationEnd) <= new Date(data.registrationStart)
  ) {
    errors.registrationEnd = t("contest:validation.regEndAfterStart")
  } else if (
    data.start &&
    new Date(data.registrationEnd) > new Date(data.start)
  ) {
    errors.registrationEnd = t("contest:validation.regEndAfterContestStart")
  } else if (!isEdit && new Date(data.registrationEnd) < now) {
    errors.registrationEnd = t("contest:validation.regEndPast")
  }

  // ---- Team Members ----
  if (data.teamMembersMin === null || data.teamMembersMin === "") {
    errors.teamMembersMin = t("contest:validation.teamMin")
  } else if (!Number.isInteger(Number(data.teamMembersMin))) {
    errors.teamMembersMin = t("contest:validation.teamMinInteger")
  } else if (data.teamMembersMin < 0) {
    errors.teamMembersMin = t("contest:validation.teamMinNegative")
  }

  if (data.teamMembersMax === null || data.teamMembersMax === "") {
    errors.teamMembersMax = t("contest:validation.teamMax")
  } else if (!Number.isInteger(Number(data.teamMembersMax))) {
    errors.teamMembersMax = t("contest:validation.teamMaxInteger")
  } else if (data.teamMembersMax < 1 || data.teamMembersMax > 50) {
    errors.teamMembersMax = t("contest:validation.teamMaxRange")
  } else if (
    data.teamMembersMin !== "" &&
    Number(data.teamMembersMin) > Number(data.teamMembersMax)
  ) {
    errors.teamMembersMax = t("contest:validation.teamMaxMin")
  }

  // ---- Settings: Appeal & Judge ----
  const settingsFields = [
    { key: "appealSubmitDays", label: "Appeal submit days" },
    { key: "appealReviewDays", label: "Appeal review days" },
    { key: "judgeRescoreDays", label: "Judge rescore days" },
  ]

  settingsFields.forEach(({ key, label }) => {
    if (data[key] === null || data[key] === "") {
      errors[key] = t("contest:validation.fieldRequired", { label })
    } else if (!Number.isInteger(Number(data[key]))) {
      errors[key] = t("contest:validation.fieldInteger", { label })
    } else if (Number(data[key]) < 0) {
      errors[key] = t("contest:validation.fieldNegative", { label })
    } else if (Number(data[key]) > 365) {
      errors[key] = t("contest:validation.fieldMax", { label })
    }
  })

  // ---- Team Limit ----
  if (data.teamLimitMax == null || data.teamLimitMax === "") {
    errors.teamLimitMax = t("contest:validation.teamLimit")
  } else if (data.teamLimitMax < 1 || data.teamLimitMax > 10000) {
    errors.teamLimitMax = t("contest:validation.teamLimitRange")
  }

  return errors
}
