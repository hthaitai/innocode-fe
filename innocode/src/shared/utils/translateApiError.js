import i18n from '../../i18n/config'

/**
 * Translate API error messages to the current language
 * @param {string|object} error - Error message string or error object from API
 * @param {string} namespace - i18n namespace (default: 'errors')
 * @returns {string} Translated error message
 */
export const translateApiError = (error, namespace = 'errors') => {
  if (!error) {
    return i18n.t(`${namespace}:common.unexpectedError`)
  }

  // If error is already a string, try to translate it
  if (typeof error === 'string') {
    return translateErrorMessage(error, namespace)
  }

  // If error is an object, extract message
  const errorMessage =
    error?.errorMessage ||
    error?.message ||
    error?.Message ||
    error?.data?.errorMessage ||
    error?.data?.message ||
    error?.response?.data?.errorMessage ||
    error?.response?.data?.message

  if (!errorMessage) {
    return i18n.t(`${namespace}:common.unexpectedError`)
  }

  return translateErrorMessage(errorMessage, namespace, error)
}

/**
 * Translate a specific error message string
 * @param {string} message - Error message to translate
 * @param {string} namespace - i18n namespace
 * @param {object} error - Full error object for context (optional)
 * @returns {string} Translated message
 */
const translateErrorMessage = (message, namespace, error = {}) => {
  const currentLang = i18n.language
  const errorCode = error?.errorCode || error?.code
  const statusCode = error?.status || error?.response?.status

  // Try to translate by error code first
  if (errorCode) {
    const codeTranslation = translateByErrorCode(errorCode, namespace)
    if (codeTranslation) return codeTranslation
  }

  // Try to translate by status code
  if (statusCode) {
    const statusTranslation = translateByStatusCode(statusCode, namespace)
    if (statusTranslation) return statusTranslation
  }

  // Try to match common error messages
  const commonMessageTranslation = matchCommonMessage(message, namespace)
  if (commonMessageTranslation) return commonMessageTranslation

  // If no translation found, return original message
  // (This allows backend to send pre-translated messages if needed)
  return message
}

/**
 * Translate by error code
 */
const translateByErrorCode = (errorCode, namespace) => {
  const codeMap = {
    // Common codes
    NOT_FOUND: `${namespace}:common.notFound`,
    UNAUTHORIZED: `${namespace}:common.unauthorized`,
    FORBIDDEN: `${namespace}:common.forbidden`,
    VALIDATION_ERROR: `${namespace}:common.validationError`,
    INTERNAL_SERVER_ERROR: `${namespace}:common.serverError`,

    // Auth codes
    INVALID_CREDENTIALS: `${namespace}:auth.invalidCredentials`,
    ACCOUNT_DISABLED: `${namespace}:auth.accountDisabled`,
    TOO_MANY_ATTEMPTS: `${namespace}:auth.tooManyAttempts`,
    EMAIL_EXISTS: `${namespace}:auth.emailExists`,
    WEAK_PASSWORD: `${namespace}:auth.weakPassword`,
    TOKEN_EXPIRED: `${namespace}:auth.tokenExpired`,

    // Contest codes
    DUPLICATE: `${namespace}:contest.duplicate`,
    CONTEST_NOT_FOUND: `${namespace}:contest.notFound`,
    ALREADY_STARTED: `${namespace}:contest.alreadyStarted`,
    REGISTRATION_CLOSED: `${namespace}:contest.registrationClosed`,
    ALREADY_REGISTERED: `${namespace}:contest.alreadyRegistered`,

    // Team codes
    TEAM_NOT_FOUND: `${namespace}:team.notFound`,
    ALREADY_MEMBER: `${namespace}:team.alreadyMember`,
    TEAM_FULL: `${namespace}:team.teamFull`,
    INVITE_EXPIRED: `${namespace}:team.inviteExpired`,
    INVITE_NOT_FOUND: `${namespace}:team.inviteNotFound`,
    ALREADY_PROCESSED: `${namespace}:team.alreadyProcessed`,

    // Submission codes
    SUBMISSION_NOT_FOUND: `${namespace}:submission.notFound`,
    DEADLINE_PASSED: `${namespace}:submission.deadlinePassed`,
    INVALID_FORMAT: `${namespace}:submission.invalidFormat`,
  }

  const translationKey = codeMap[errorCode]
  if (translationKey) {
    try {
      return i18n.t(translationKey)
    } catch (e) {
      // Translation key doesn't exist, return null to try other methods
      return null
    }
  }

  return null
}

/**
 * Translate by HTTP status code
 */
const translateByStatusCode = (statusCode, namespace) => {
  const statusMap = {
    400: `${namespace}:common.validationError`,
    401: `${namespace}:common.unauthorized`,
    403: `${namespace}:common.forbidden`,
    404: `${namespace}:common.notFound`,
    500: `${namespace}:common.serverError`,
    503: `${namespace}:common.serverError`,
  }

  const translationKey = statusMap[statusCode]
  if (translationKey) {
    try {
      return i18n.t(translationKey)
    } catch (e) {
      return null
    }
  }

  return null
}

/**
 * Match common error message patterns
 */
const matchCommonMessage = (message, namespace) => {
  const lowerMessage = message.toLowerCase()

  // Common patterns
  const patterns = [
    {
      pattern: /not found|không tìm thấy/i,
      translation: `${namespace}:common.notFound`,
    },
    {
      pattern: /unauthorized|chưa xác thực/i,
      translation: `${namespace}:common.unauthorized`,
    },
    {
      pattern: /forbidden|không có quyền/i,
      translation: `${namespace}:common.forbidden`,
    },
    {
      pattern: /server error|lỗi máy chủ/i,
      translation: `${namespace}:common.serverError`,
    },
    {
      pattern: /network error|lỗi kết nối/i,
      translation: `${namespace}:common.networkError`,
    },
    {
      pattern: /timeout|hết thời gian/i,
      translation: `${namespace}:common.timeout`,
    },
    {
      pattern: /invalid.*password|mật khẩu.*không đúng/i,
      translation: `${namespace}:auth.invalidCredentials`,
    },
    {
      pattern: /email.*exists|email.*đã tồn tại/i,
      translation: `${namespace}:auth.emailExists`,
    },
    {
      pattern: /duplicate|trùng lặp/i,
      translation: `${namespace}:contest.duplicate`,
    },
  ]

  for (const { pattern, translation } of patterns) {
    if (pattern.test(lowerMessage)) {
      try {
        return i18n.t(translation)
      } catch (e) {
        continue
      }
    }
  }

  return null
}

export default translateApiError

