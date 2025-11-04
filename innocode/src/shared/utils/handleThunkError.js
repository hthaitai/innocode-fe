export const handleThunkError = (err) => {
  const res = err?.response?.data
  if (res?.Code || res?.Message) return res // backend-structured error
  if (res?.message) return { Message: res.message }
  if (err?.message) return { Message: err.message }
  return { Message: "An unexpected error occurred." }
}
