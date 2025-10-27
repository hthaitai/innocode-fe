export const validateContest = (data) => {
  const errors = {}
  if (!data.year?.trim()) errors.year = "Year is required"
  if (!data.name?.trim()) errors.name = "Contest name is required"
  if (!data.description?.trim()) errors.description = "Description is required"
  return errors
}
