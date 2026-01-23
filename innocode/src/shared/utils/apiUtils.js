/**
 * Checks if an error is a fetch error (network issue).
 *
 * @param {Object} err - The error object
 * @returns {boolean} - True if it is a fetch error
 */
export const isFetchError = (err) =>
  err?.status === "FETCH_ERROR" || err?.status === "TIMEOUT_ERROR"
