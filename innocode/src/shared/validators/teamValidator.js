export const validateTeam = (data) => {
  const errors = {}

  // ----- Team Name -----
  if (!data.name || !data.name.trim()) {
    errors.name = "Team name is required"
  } else if (data.name.length > 200) {
    errors.name = "Team name cannot exceed 200 characters"
  }

  // ----- School -----
  if (!data.school_id) {
    errors.school_id = "Please select a school"
  }

  // ----- Mentor -----
  if (!data.mentor_id) {
    errors.mentor_id = "Please select a mentor"
  }

  return errors
}
