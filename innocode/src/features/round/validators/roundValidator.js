export const validateRound = (data, contest = null, existingRounds = []) => {
  const errors = {}
  if (!data.name?.trim()) errors.name = "Round name is required"
  if (!data.start) errors.start = "Start time is required"
  if (!data.end) errors.end = "End time is required"
  if (data.start && data.end && new Date(data.start) > new Date(data.end))
    errors.end = "End time must be after start time"
  
  // Validate problemType is selected
  if (!data.problemType) {
    errors.problemType = "Problem type is required"
  }
  
  // Validate that only one config is provided
  const hasMcqConfig = data.mcqTestConfig && data.problemType === "McqTest"
  const hasProblemConfig = data.problemConfig && data.problemType === "Problem"
  
  if (!hasMcqConfig && !hasProblemConfig) {
    errors.problemType = "Please configure the selected problem type"
  }
  
  // If Problem is selected, validate that a type (Manual/AutoEvaluation) is chosen
  if (data.problemType === "Problem" && data.problemConfig && !data.problemConfig.type) {
    errors.problemType = "Please select Manual or AutoEvaluation type"
  }
  
  // Validate contest time bounds
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
  
  // Validate overlap with existing rounds
  if (data.start && data.end && existingRounds.length > 0) {
    const roundStart = new Date(data.start)
    const roundEnd = new Date(data.end)
    
    const overlap = existingRounds.some((r) => {
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
