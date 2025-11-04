/**
 * Converts a backend ISO datetime string (UTC) into a
 * "datetime-local" compatible string for inputs.
 * e.g. "2025-11-04T20:10:00+00:00" → "2025-11-04T20:10"
 */
export const toDatetimeLocal = (isoString) => {
  if (!isoString) return ""
  const date = new Date(isoString)
  const tzOffset = date.getTimezoneOffset() * 60000 // offset in ms
  const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16)
  return localISOTime
}

/**
 * Converts a "datetime-local" input value (local time)
 * into an ISO string (UTC) for backend submission.
 * e.g. "2025-11-04T20:10" → "2025-11-04T13:10:00.000Z"
 */
export const fromDatetimeLocal = (localString) => {
  if (!localString) return ""
  const date = new Date(localString)
  return date.toISOString()
}
