export const validateAppeal = (data) => {
  const errors = {}

  // ----- state -----
  if (!data.state || !data.state.trim()) {
    errors.state = "Appeal state is required"
  } else if (
    !["open", "under_review", "accepted", "rejected", "escalated"].includes(
      data.state
    )
  ) {
    errors.state = "Invalid appeal state"
  }

  // ----- decision -----
  if (data.decision && data.decision.length > 1000) {
    errors.decision = "Decision cannot exceed 1000 characters"
  }

  return errors
}
