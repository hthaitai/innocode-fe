import { useTranslation } from 'react-i18next'
import translateApiError from '../utils/translateApiError'

/**
 * Hook to translate API errors
 * @returns {Function} Function to translate error messages
 */
export const useApiError = () => {
  const { t } = useTranslation('errors')

  /**
   * Translate an API error
   * @param {string|object} error - Error message or error object
   * @returns {string} Translated error message
   */
  const translateError = (error) => {
    return translateApiError(error, 'errors')
  }

  return { translateError, t }
}

export default useApiError

