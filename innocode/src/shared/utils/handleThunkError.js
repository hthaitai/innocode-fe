import translateApiError from './translateApiError'

export const handleThunkError = (err) => {
  const res = err?.response?.data

  // Translate error message
  const translatedMessage = translateApiError(err, 'errors')

  // Generic 404
  if (err?.response?.status === 404) {
    return { Message: translatedMessage }
  }

  // Return translated error with original structure
  if (res?.Code || res?.Message) {
    return {
      ...res,
      Message: translatedMessage,
      errorMessage: translatedMessage, // Also add errorMessage for consistency
    }
  }
  
  if (res?.message) {
    return { Message: translatedMessage, message: translatedMessage }
  }
  
  if (err?.message) {
    return { Message: translatedMessage }
  }
  
  return { Message: translatedMessage }
}
