export const validateRound = (
  data,
  contest = null,
  existingRounds = [],
  { isEdit = false, t = (key) => key } = {}
) => {
  const errors = {}
  const now = new Date()

  // ---- Retake Round Validation ----
  if (data.isRetakeRound) {
    if (!data.mainRoundId) {
      errors.mainRoundId = t("round:validation.retakeSelect")
    }
  }

  // ---- Round Name ----
  if (!data.isRetakeRound && !data.name?.trim()) {
    errors.name = t("round:validation.name")
  }

  // ---- Start Time ----
  if (!data.start) {
    errors.start = t("round:validation.start")
  } else if (!isEdit && new Date(data.start) < now) {
    errors.start = t("round:validation.startPast")
  }

  // ---- End Time ----
  if (!data.end) {
    errors.end = t("round:validation.end")
  } else if (data.start && new Date(data.end) <= new Date(data.start)) {
    errors.end = t("round:validation.endAfterStart")
  } else if (!isEdit && new Date(data.end) < now) {
    errors.end = t("round:validation.endPast")
  }

  // ---- Rank Cutoff ----
  if (
    data.rankCutoff !== undefined &&
    data.rankCutoff !== null &&
    data.rankCutoff !== ""
  ) {
    if (!Number.isInteger(Number(data.rankCutoff))) {
      errors.rankCutoff = t("round:validation.rankInteger")
    } else if (Number(data.rankCutoff) < 0) {
      errors.rankCutoff = t("round:validation.rankNegative")
    }
  }

  // ---- Problem Type ----
  if (!data.isRetakeRound && !data.problemType) {
    errors.problemType = t("round:validation.problemType")
  }

  // ---- Problem Configuration ----
  const hasMcqConfig = data.mcqTestConfig && data.problemType === "McqTest"
  const hasProblemConfig =
    data.problemConfig &&
    ["Manual", "AutoEvaluation"].includes(data.problemType)

  if (!data.isRetakeRound && !hasMcqConfig && !hasProblemConfig) {
    errors.problemType = t("round:validation.problemTypeConfig")
  }

  // optional: type check (not strictly needed now because problemType itself is Manual or AutoEvaluation)
  if (
    ["Manual", "AutoEvaluation"].includes(data.problemType) &&
    data.problemConfig &&
    !data.problemConfig.type
  ) {
    errors.problemType = t("round:validation.problemTypeConfig")
  }

  // ---- Validate problemConfig only for Manual/AutoEvaluation ----
  if (
    ["Manual", "AutoEvaluation"].includes(data.problemType) &&
    data.problemConfig
  ) {
    if (!data.problemConfig.description?.trim()) {
      errors.problemConfigDescription = t("round:validation.description")
    }
    // if (!data.problemConfig.language?.trim()) {
    //   errors.problemConfigLanguage = "Language is required"
    // }

    if (data.problemType === "AutoEvaluation" && !data.problemConfig.testType) {
      errors.problemConfigTestType = t("round:validation.testType")
    }

    if (
      data.problemType === "AutoEvaluation" &&
      data.problemConfig.testType === "MockTest"
    ) {
      if (
        data.problemConfig.mockTestWeight === undefined ||
        data.problemConfig.mockTestWeight === null ||
        data.problemConfig.mockTestWeight === ""
      ) {
        errors.mockTestWeight = t("round:validation.mockTestWeight")
      } else if (Number(data.problemConfig.mockTestWeight) < 0) {
        errors.mockTestWeight = t("round:validation.mockTestWeightNegative")
      }
    }

    // Template file validation
    if (!data.TemplateFile) {
      errors.templateFile = t("round:validation.templateFile")
    }
  }

  // ---- Contest Time Bounds ----
  if (contest && data.start && data.end) {
    const contestStart = new Date(contest.start)
    const contestEnd = new Date(contest.end)
    const roundStart = new Date(data.start)
    const roundEnd = new Date(data.end)

    if (roundStart < contestStart) {
      errors.start = t("round:validation.startInContest")
    }
    if (roundEnd > contestEnd) {
      errors.end = t("round:validation.endInContest")
    }
  }

  // ---- Time Limit ----
  if (data.timeLimitSeconds && Number(data.timeLimitSeconds) < 0) {
    errors.timeLimitSeconds = t("round:validation.timeLimitNegative")
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
      errors.start = t("round:validation.overlap")
    }
  }

  return errors
}
