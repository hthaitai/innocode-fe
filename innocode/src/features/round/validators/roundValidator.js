export const validateRound = (
  data,
  contest = null,
  existingRounds = [],
  { isEdit = false } = {}
) => {
  const errors = {}
  const now = new Date()

  // ---- Retake Round Validation ----
  if (data.isRetakeRound) {
    if (!data.mainRoundId) {
      errors.mainRoundId = "Please select a round to retake"
    }
  }

  // ---- Round Name ----
  if (!data.isRetakeRound && !data.name?.trim()) {
    errors.name = "Round name is required"
  }

  // ---- Start Time ----
  if (!data.start) {
    errors.start = "Start time is required"
  } else if (!isEdit && new Date(data.start) < now) {
    errors.start = "Start time cannot be in the past"
  }

  // ---- End Time ----
  if (!data.end) {
    errors.end = "End time is required"
  } else if (data.start && new Date(data.end) <= new Date(data.start)) {
    errors.end = "End time must be after start time"
  } else if (!isEdit && new Date(data.end) < now) {
    errors.end = "End time cannot be in the past"
  }

  // ---- Problem Type ----
  if (!data.isRetakeRound && !data.problemType) {
    errors.problemType = "Problem type is required"
  }

  // ---- Problem Configuration ----
  const hasMcqConfig = data.mcqTestConfig && data.problemType === "McqTest"
  const hasProblemConfig =
    data.problemConfig &&
    ["Manual", "AutoEvaluation"].includes(data.problemType)

  if (!data.isRetakeRound && !hasMcqConfig && !hasProblemConfig) {
    errors.problemType = "Please configure the selected problem type"
  }

  // Validate MCQ-specific fields when MCQ is selected
  if (data.problemType === "McqTest") {
    if (!data.mcqTestConfig?.name?.trim()) {
      errors.mcqName = "MCQ test name is required"
    }
  }

  // optional: type check (not strictly needed now because problemType itself is Manual or AutoEvaluation)
  if (
    ["Manual", "AutoEvaluation"].includes(data.problemType) &&
    data.problemConfig &&
    !data.problemConfig.type
  ) {
    errors.problemType = "Please configure the selected problem type"
  }

  // ---- Validate problemConfig only for Manual/AutoEvaluation ----
  if (
    ["Manual", "AutoEvaluation"].includes(data.problemType) &&
    data.problemConfig
  ) {
    if (!data.problemConfig.description?.trim()) {
      errors.problemConfigDescription = "Description is required"
    }
    // if (!data.problemConfig.language?.trim()) {
    //   errors.problemConfigLanguage = "Language is required"
    // }
    // Template file validation
    if (!data.TemplateFile) {
      errors.templateFile = "Template file is required"
    }
  }

  // ---- Contest Time Bounds ----
  if (contest && data.start && data.end) {
    const contestStart = new Date(contest.start)
    const contestEnd = new Date(contest.end)
    const roundStart = new Date(data.start)
    const roundEnd = new Date(data.end)

    if (roundStart < contestStart) {
      errors.start = "Start time must be within contest period"
    }
    if (roundEnd > contestEnd) {
      errors.end = "End time must be within contest period"
    }
  }

  // ---- Overlap with Existing Rounds ----
  if (data.start && data.end && existingRounds.length > 0) {
    const roundStart = new Date(data.start)
    const roundEnd = new Date(data.end)

    const overlap = existingRounds.some((r) => {
      // Skip overlap check if editing the same round
      if (isEdit && r.id === data.id) return false

      const existingStart = new Date(r.start)
      const existingEnd = new Date(r.end)
      return roundStart < existingEnd && roundEnd > existingStart
    })

    if (overlap) {
      errors.start = "Round time overlaps with an existing round"
    }
  }

  return errors
}
