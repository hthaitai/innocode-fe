/**
 * Retries an RTK Query mutation trigger function if a network error occurs.
 * useful for cold starts or unstable connections.
 *
 * @param {Function} mutationTrigger - The mutation trigger function (from useMutation hook)
 * @param {any} payload - The payload to pass to the mutation
 * @param {Object} options - Retry options
 * @param {number} [options.maxRetries=2] - Maximum number of retries
 * @param {number} [options.delayMs=1000] - Delay between retries in milliseconds
 * @returns {Promise<any>} - The result of the mutation (unwrapped)
 */
export const executeWithRetry = async (
  mutationTrigger,
  payload,
  options = {},
) => {
  const { maxRetries = 2, delayMs = 1000 } = options
  let attempt = 0

  while (true) {
    try {
      // RTK Query mutations return an object with an `unwrap` property
      return await mutationTrigger(payload).unwrap()
    } catch (err) {
      const isFetchError =
        err.status === "FETCH_ERROR" ||
        err.error?.includes("Failed to fetch") ||
        err.message?.includes("Failed to fetch") ||
        // Sometimes status is undefined for pure network errors if not normalized yet
        (!err.status && !err.originalStatus)

      if (isFetchError && attempt < maxRetries) {
        attempt++
        console.warn(
          `Mutation failed with network error, retrying (${attempt}/${maxRetries})...`,
          err,
        )
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        continue
      }
      throw err
    }
  }
}

/**
 * Checks if an error is a fetch error (network issue).
 *
 * @param {Object} err - The error object
 * @returns {boolean} - True if it is a fetch error
 */
export const isFetchError = (err) => {
  if (
    err.status === "FETCH_ERROR" ||
    err.message?.includes("Failed to fetch") ||
    !err.status
  ) {
    console.log("Server cold start detected, request may need retry")
    return true
  }
  return false
}
