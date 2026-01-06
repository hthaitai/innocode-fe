import i18n from "../../i18n/config"

/**
 * Translate API error messages to the current language
 * @param {string|object} error - Error message string or error object from API
 * @param {string} namespace - i18n namespace (default: 'errors')
 * @returns {string} Translated error message
 */
export const translateApiError = (error, namespace = "errors") => {
  if (!error) {
    return i18n.t(`${namespace}:common.unexpectedError`)
  }

  // If error is already a string, try to translate it
  if (typeof error === "string") {
    return translateErrorMessage(error, namespace)
  }

  // If error is an object, extract message
  // Ưu tiên errorMessage từ error.data (RTK Query) trước error.response.data (axios) trước error.message
  const errorMessage =
    error?.data?.errorMessage ||
    error?.data?.message ||
    error?.response?.data?.errorMessage ||
    error?.response?.data?.message ||
    error?.message
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
  // Lấy errorCode từ error.data (RTK Query) trước error.response.data (axios) theo cấu trúc backend
  const errorCode =
    error?.data?.errorCode ||
    error?.response?.data?.errorCode ||
    error?.errorCode
  const statusCode = error?.response?.status || error?.status

  // Nếu ngôn ngữ là tiếng Anh, sử dụng trực tiếp errorMessage từ backend
  // Backend đã gửi errorMessage bằng tiếng Anh, không cần translate
  if (currentLang === "en" || currentLang?.startsWith("en-")) {
    return message
  }

  // Nếu ngôn ngữ là tiếng Việt hoặc ngôn ngữ khác, translate dựa trên errorCode
  // Ưu tiên 1: Translate bằng errorCode (chính xác nhất)
  if (errorCode) {
    const codeTranslation = translateByErrorCode(errorCode, namespace)
    if (codeTranslation) return codeTranslation
  }

  // Ưu tiên 2: Match pattern từ errorMessage (nếu không có errorCode hoặc errorCode không match)
  const commonMessageTranslation = matchCommonMessage(message, namespace)
  if (commonMessageTranslation) return commonMessageTranslation

  // Ưu tiên 3: Translate bằng statusCode
  if (statusCode) {
    const statusTranslation = translateByStatusCode(statusCode, namespace)
    if (statusTranslation) return statusTranslation
  }

  // Fallback: Nếu không translate được, trả về errorMessage gốc (tiếng Anh từ backend)
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
    BADREQUEST: `${namespace}:common.badRequest`,
    BAD_REQUEST: `${namespace}:common.badRequest`,
    DUPLICATE: `${namespace}:common.duplicate`,
    EXISTED: `${namespace}:common.duplicate`,
    CONFLICT: `${namespace}:common.conflict`,
    GONE: `${namespace}:common.gone`,

    // ActivityLog
    LOG_NOT_FOUND: `${namespace}:activityLog.logNotFound`,
    USER_NOT_FOUND: `${namespace}:activityLog.userNotFound`,

    // Appeal
    APPEAL_NOT_FOUND: `${namespace}:appeal.notFound`,
    FORBIDDEN: `${namespace}:appeal.forbidden`,
    NOT_FOUND: `${namespace}:appeal.notFound`,
    DUPLICATE: `${namespace}:appeal.duplicate`,
    BADREQUEST: `${namespace}:appeal.badRequest`,
    INTERNAL_SERVER_ERROR: `${namespace}:appeal.internalServerError`,
    UNAUTHENTICATED: `${namespace}:appeal.unauthenticated`,

    // Attachment
    ATTACHMENT_NOT_FOUND: `${namespace}:attachment.notFound`,

    // Auth codes
    INVALID_CREDENTIALS: `${namespace}:auth.invalidCredentials`,
    ACCOUNT_DISABLED: `${namespace}:auth.accountDisabled`,
    TOO_MANY_ATTEMPTS: `${namespace}:auth.tooManyAttempts`,
    EMAIL_EXISTS: `${namespace}:auth.emailExists`,
    WEAK_PASSWORD: `${namespace}:auth.weakPassword`,
    TOKEN_EXPIRED: `${namespace}:auth.tokenExpired`,
    CONFIRM_PASSWORD_MISMATCH: `${namespace}:auth.confirmPasswordMismatch`,
    SCHOOL_ID_REQUIRED: `${namespace}:auth.schoolIdRequired`,
    SCHOOL_NOT_FOUND: `${namespace}:auth.schoolNotFound`,
    USER_UNVERIFIED: `${namespace}:auth.userUnverified`,
    USER_INACTIVE: `${namespace}:auth.userInactive`,
    UNAUTHENTICATED: `${namespace}:auth.unauthenticated`,
    ALREADY_VERIFIED: `${namespace}:auth.alreadyVerified`,
    INVALID_TOKEN: `${namespace}:auth.invalidToken`,
    INVALID_TOKEN_TYPE: `${namespace}:auth.invalidTokenType`,
    INVALID_REFRESH: `${namespace}:auth.invalidRefresh`,
    USER_NOT_FOUND: `${namespace}:auth.userNotFound`,
    EMAIL_MISMATCH: `${namespace}:auth.emailMismatch`,
    BAD_CURRENT_PASSWORD: `${namespace}:auth.badCurrentPassword`,

    // Certificate
    TEMPLATE_NOT_FOUND: `${namespace}:certificate.templateNotFound`,
    RECIPIENT_INVALID: `${namespace}:certificate.recipientInvalid`,
    STUDENT_NOT_FOUND: `${namespace}:certificate.studentNotFound`,
    TEAM_NOT_FOUND: `${namespace}:certificate.teamNotFound`,
    DUPLICATE_CERTIFICATE: `${namespace}:certificate.duplicate`,
    RENDER_FAILED: `${namespace}:certificate.renderFailed`,
    STORAGE_UPLOAD_FAILED: `${namespace}:certificate.uploadFailed`,
    SAVE_FAILED: `${namespace}:certificate.saveFailed`,
    RECIPIENT_PROCESSING_FAILED: `${namespace}:certificate.recipientProcessingFailed`,
    TEMPLATE_DOWNLOAD_FAILED: `${namespace}:certificate.templateDownloadFailed`,
    ISSUANCE_FAILED: `${namespace}:certificate.issuanceFailed`,
    CERTIFICATE_TYPE_INVALID: `${namespace}:certificate.typeInvalid`,
    CERT_NOT_FOUND: `${namespace}:certificate.certNotFound`,
    CONTEST_NOT_FOUND: `${namespace}:certificate.contestNotFound`,
    UNAUTHORIZED: `${namespace}:certificate.unauthorized`,
    BAD_REQUEST: `${namespace}:certificate.badRequest`,

    // Config
    CONFIG_NOT_FOUND: `${namespace}:config.notFound`,
    CONFIG_EXISTS: `${namespace}:config.exists`,
    INVALID_WINDOW: `${namespace}:config.invalidWindow`,
    INVALID_KEY: `${namespace}:config.invalidKey`,
    INVALID_INPUT: `${namespace}:config.invalidInput`,
    FORBIDDEN: `${namespace}:config.forbidden`,
    NOT_FOUND: `${namespace}:config.notFound`,

    // Contest
    CONTEST_ALREADY_DELETED: `${namespace}:contest.alreadyDeleted`,
    CONTEST_YEAR_INVALID: `${namespace}:contest.yearInvalid`,
    CONTEST_DATE_INVALID: `${namespace}:contest.dateInvalid`,
    CONTEST_NAME_REQUIRED: `${namespace}:contest.nameRequired`,
    TEAM_MEMBERS_INVALID: `${namespace}:contest.teamMembersInvalid`,
    TEAM_LIMIT_INVALID: `${namespace}:contest.teamLimitInvalid`,
    INVALID_IMAGE: `${namespace}:contest.invalidImage`,
    INVALID_STATE: `${namespace}:contest.invalidState`,
    DATE_CONFLICT: `${namespace}:contest.dateConflict`,
    BADREQUEST: `${namespace}:contest.badRequest`,
    NOT_FOUND: `${namespace}:contest.notFound`,
    INTERNAL_SERVER_ERROR: `${namespace}:contest.internalServerError`,
    BADREQUEST_POLICIES: `${namespace}:contest.badRequestPolicies`,
    BADREQUEST_POLICY_KEY: `${namespace}:contest.badRequestPolicyKey`,
    INTERNAL_SERVER_ERROR_DELETE_POLICY: `${namespace}:contest.internalServerErrorDeletePolicy`,
    FORBIDDEN: `${namespace}:contest.forbidden`,
    UNAUTHENTICATED: `${namespace}:contest.unauthenticated`,
    INTERNAL_SERVER_ERROR_CANCEL: `${namespace}:contest.internalServerErrorCancel`,
    INVALID_STATE_ENDED: `${namespace}:contest.invalidStateEnded`,
    INVALID_STATE_NOT_STARTED: `${namespace}:contest.invalidStateNotStarted`,
    UNAUTHENTICATED_INVALID_USER_ID: `${namespace}:contest.unauthenticatedInvalidUserId`,

    // ContestJudge
    UNAUTHENTICATED: `${namespace}:contestJudge.unauthenticated`,
    USER_NOT_FOUND: `${namespace}:contestJudge.userNotFound`,
    FORBIDDEN: `${namespace}:contestJudge.forbidden`,
    USER_INACTIVE: `${namespace}:contestJudge.userInactive`,

    // Judge
    JUDGE_NOT_FOUND: `${namespace}:judge.notFound`,
    JUDGE_INACTIVE: `${namespace}:judge.inactive`,

    // JudgeInvite
    INVITE_NOT_FOUND: `${namespace}:judgeInvite.inviteNotFound`,
    INVITE_NOT_PENDING: `${namespace}:judgeInvite.inviteNotPending`,
    INVITE_EXPIRED: `${namespace}:judgeInvite.inviteExpired`,
    INVALID_INVITE_CODE: `${namespace}:judgeInvite.invalidCode`,
    NOT_FOUND: `${namespace}:judgeInvite.notFound`,
    BADREQUEST: `${namespace}:judgeInvite.badRequest`,
    EXISTED: `${namespace}:judgeInvite.existed`,
    INTERNAL_SERVER_ERROR: `${namespace}:judgeInvite.internalServerError`,
    GONE: `${namespace}:judgeInvite.gone`,
    CONFLICT: `${namespace}:judgeInvite.conflict`,
    UNAUTHORIZED: `${namespace}:judgeInvite.unauthorized`,
    FORBIDDEN: `${namespace}:judgeInvite.forbidden`,

    // Leaderboard
    LEADERBOARD_FROZEN: `${namespace}:leaderboard.frozen`,
    LEADERBOARD_ENTRY_NOT_FOUND: `${namespace}:leaderboard.entryNotFound`,
    TEAM_ALREADY_EXISTS: `${namespace}:leaderboard.teamExists`,
    TEAM_ELIMINATED: `${namespace}:leaderboard.teamEliminated`,
    INVALID_ELIMINATION_RULE: `${namespace}:leaderboard.invalidEliminationRule`,
    NOT_FOUND: `${namespace}:leaderboard.notFound`,
    BADREQUEST: `${namespace}:leaderboard.badRequest`,
    INTERNAL_SERVER_ERROR: `${namespace}:leaderboard.internalServerError`,
    FORBIDDEN: `${namespace}:leaderboard.forbidden`,

    // MCQ Attempt Item
    INTERNAL_SERVER_ERROR_CREATE_ATTEMPT: `${namespace}:mcqAttemptItem.internalServerErrorCreate`,
    INTERNAL_SERVER_ERROR_RETRIEVE: `${namespace}:mcqAttemptItem.internalServerErrorRetrieve`,

    // MCQ Attempt
    INTERNAL_SERVER_ERROR_CREATE_ATTEMPT: `${namespace}:mcqAttempt.internalServerErrorCreate`,
    BADREQUEST: `${namespace}:mcqAttempt.badRequest`,
    INTERNAL_SERVER_ERROR_RETRIEVE: `${namespace}:mcqAttempt.internalServerErrorRetrieve`,

    // MCQ Option
    INTERNAL_SERVER_ERROR_CREATE: `${namespace}:mcqOption.internalServerErrorCreate`,
    NOT_FOUND: `${namespace}:mcqOption.notFound`,
    INTERNAL_SERVER_ERROR_DELETE: `${namespace}:mcqOption.internalServerErrorDelete`,
    INTERNAL_SERVER_ERROR_RETRIEVE: `${namespace}:mcqOption.internalServerErrorRetrieve`,
    INTERNAL_SERVER_ERROR_UPDATE: `${namespace}:mcqOption.internalServerErrorUpdate`,

    // MCQ Question
    INTERNAL_SERVER_ERROR_CREATE: `${namespace}:mcqQuestion.internalServerErrorCreate`,
    NOT_FOUND: `${namespace}:mcqQuestion.notFound`,
    INTERNAL_SERVER_ERROR_DELETE: `${namespace}:mcqQuestion.internalServerErrorDelete`,
    BADREQUEST: `${namespace}:mcqQuestion.badRequest`,
    INTERNAL_SERVER_ERROR_RETRIEVE: `${namespace}:mcqQuestion.internalServerErrorRetrieve`,
    INTERNAL_SERVER_ERROR_UPDATE: `${namespace}:mcqQuestion.internalServerErrorUpdate`,

    // MCQ Test Question
    NOT_FOUND: `${namespace}:mcqTestQuestion.notFound`,
    INTERNAL_SERVER_ERROR_DELETE: `${namespace}:mcqTestQuestion.internalServerErrorDelete`,
    BADREQUEST: `${namespace}:mcqTestQuestion.badRequest`,
    INTERNAL_SERVER_ERROR_RETRIEVE: `${namespace}:mcqTestQuestion.internalServerErrorRetrieve`,
    INTERNAL_SERVER_ERROR_UPDATE: `${namespace}:mcqTestQuestion.internalServerErrorUpdate`,

    // MCQ Test
    NOT_FOUND: `${namespace}:mcqTest.notFound`,
    BADREQUEST: `${namespace}:mcqTest.badRequest`,
    INTERNAL_SERVER_ERROR: `${namespace}:mcqTest.internalServerError`,

    // MentorManagement
    CONFIRM_PASSWORD_MISMATCH: `${namespace}:mentorManagement.confirmPasswordMismatch`,
    SCHOOL_NOT_FOUND: `${namespace}:mentorManagement.schoolNotFound`,
    FORBIDDEN: `${namespace}:mentorManagement.forbidden`,
    EMAIL_EXISTS: `${namespace}:mentorManagement.emailExists`,

    // Mentor
    MENTOR_NOT_FOUND: `${namespace}:mentor.notFound`,
    USER_NOT_MENTOR: `${namespace}:mentor.userNotMentor`,
    USER_INVALID_STATUS: `${namespace}:mentor.userInvalidStatus`,
    USER_ALREADY_MENTOR: `${namespace}:mentor.userAlreadyMentor`,
    MENTOR_IN_USE: `${namespace}:mentor.inUse`,
    USER_NOT_FOUND: `${namespace}:mentor.userNotFound`,
    SCHOOL_NOT_FOUND: `${namespace}:mentor.schoolNotFound`,

    // Notification
    NOTIFICATION_NOT_FOUND: `${namespace}:notification.notFound`,
    RECIPIENT_LIST_EMPTY: `${namespace}:notification.recipientListEmpty`,
    BADREQUEST: `${namespace}:notification.badRequest`,
    USER_NOT_FOUND: `${namespace}:notification.userNotFound`,
    INTERNAL_SERVER_ERROR: `${namespace}:notification.internalServerError`,
    UNAUTHORIZED: `${namespace}:notification.unauthorized`,
    BAD_REQUEST: `${namespace}:notification.badRequest`,
    NOTIFICATION_ID_REQUIRED: `${namespace}:notification.notificationIdRequired`,

    // Problem
    PROBLEM_NOT_FOUND: `${namespace}:problem.notFound`,
    RUBRIC_TEMPLATE_NOT_AVAILABLE: `${namespace}:problem.rubricTemplateNotAvailable`,
    RUBRIC_NOT_FOUND: `${namespace}:problem.rubricNotFound`,
    RUBRIC_CRITERION_NOT_FOUND: `${namespace}:problem.rubricCriterionNotFound`,
    MOCK_TEST_NOT_PROVIDED: `${namespace}:problem.mockTestNotProvided`,
    MOCK_TEST_INVALID_TYPE: `${namespace}:problem.mockTestInvalidType`,
    MOCK_TEST_SIZE_EXCEEDED: `${namespace}:problem.mockTestSizeExceeded`,
    MOCK_TEST_WRONG_TYPE: `${namespace}:problem.mockTestWrongType`,
    INTERNAL_SERVER_ERROR: `${namespace}:problem.internalServerError`,
    NOT_FOUND: `${namespace}:problem.notFound`,
    BADREQUEST: `${namespace}:problem.badRequest`,

    // Province
    PROVINCE_NOT_FOUND: `${namespace}:province.notFound`,
    PROVINCE_IN_USE: `${namespace}:province.inUse`,
    NAME_EXISTS: `${namespace}:province.nameExists`,

    // Quiz
    QUIZ_NOT_FOUND: `${namespace}:quiz.notFound`,
    QUIZ_ALREADY_FINISHED: `${namespace}:quiz.alreadyFinished`,
    OPEN_CODE_REQUIRED: `${namespace}:quiz.openCodeRequired`,
    INVALID_OPEN_CODE: `${namespace}:quiz.invalidOpenCode`,
    BANK_NAME_REQUIRED: `${namespace}:quiz.bankNameRequired`,
    INVALID_CSV: `${namespace}:quiz.invalidCsv`,
    KEY_REQUIRED: `${namespace}:quiz.keyRequired`,
    KEY_MISMATCH: `${namespace}:quiz.keyMismatch`,
    BADREQUEST: `${namespace}:quiz.badRequest`,
    FORBIDDEN: `${namespace}:quiz.forbidden`,
    NOT_FOUND: `${namespace}:quiz.notFound`,
    INTERNAL_SERVER_ERROR: `${namespace}:quiz.internalServerError`,
    UNAUTHORIZED: `${namespace}:quiz.unauthorized`,

    // RoleRegistration
    EVIDENCE_REQUIRED: `${namespace}:roleRegistration.evidenceRequired`,
    REGISTRATION_EXISTS: `${namespace}:roleRegistration.registrationExists`,
    ROLE_REG_NOT_FOUND: `${namespace}:roleRegistration.notFound`,
    NOT_PENDING: `${namespace}:roleRegistration.notPending`,
    MISSING_PASSWORD: `${namespace}:roleRegistration.missingPassword`,
    REASON_REQUIRED: `${namespace}:roleRegistration.reasonRequired`,
    ROLE_REQUIRED: `${namespace}:roleRegistration.roleRequired`,
    INVALID_ROLE: `${namespace}:roleRegistration.invalidRole`,

    // Round
    ROUND_NOT_FOUND: `${namespace}:round.notFound`,
    ROUND_DATA_REQUIRED: `${namespace}:round.dataRequired`,
    ROUND_NAME_REQUIRED: `${namespace}:round.nameRequired`,
    PROBLEM_CONFIG_REQUIRED: `${namespace}:round.problemConfigRequired`,
    MCQ_TEST_CONFIG_REQUIRED: `${namespace}:round.mcqTestConfigRequired`,
    MCQ_TEST_NAME_REQUIRED: `${namespace}:round.mcqTestNameRequired`,
    PENALTY_RATE_INVALID: `${namespace}:round.penaltyRateInvalid`,
    RANK_CUTOFF_INVALID: `${namespace}:round.rankCutoffInvalid`,
    INVALID_PROBLEM_TYPE: `${namespace}:round.invalidProblemType`,
    RETAKE_ROUND_INVALID: `${namespace}:round.retakeRoundInvalid`,
    MAIN_ROUND_NOT_FOUND: `${namespace}:round.mainRoundNotFound`,
    CANNOT_UPDATE_ROUND: `${namespace}:round.cannotUpdate`,
    ROUND_DATE_CONFLICT: `${namespace}:round.dateConflict`,
    ROUND_DATE_INVALID: `${namespace}:round.dateInvalid`,
    TIME_LIMIT_INVALID: `${namespace}:round.timeLimitInvalid`,
    NO_JUDGES_AVAILABLE: `${namespace}:round.noJudgesAvailable`,
    NO_ACTIVE_JUDGES: `${namespace}:round.noActiveJudges`,
    OPEN_CODE_NOT_FOUND: `${namespace}:round.openCodeNotFound`,
    ROUND_ALREADY_ENDED: `${namespace}:round.alreadyEnded`,
    ROUND_NOT_STARTED: `${namespace}:round.notStarted`,
    ROUND_ALREADY_FINISHED: `${namespace}:round.alreadyFinished`,
    CANNOT_END_BEFORE_START: `${namespace}:round.cannotEndBeforeStart`,
    TOP_CUTOFF_REQUIRED: `${namespace}:round.topCutoffRequired`,
    BADREQUEST: `${namespace}:round.badRequest`,
    INTERNAL_SERVER_ERROR: `${namespace}:round.internalServerError`,
    NOT_FOUND: `${namespace}:round.notFound`,
    UNAUTHORIZED: `${namespace}:round.unauthorized`,
    FORBIDDEN: `${namespace}:round.forbidden`,
    UNAUTHENTICATED: `${namespace}:round.unauthenticated`,
    INVALID_STATE: `${namespace}:round.invalidState`,
    DATE_CONFLICT: `${namespace}:round.dateConflict`,

    // SchoolCreationRequest
    EVIDENCE_REQUIRED: `${namespace}:schoolCreationRequest.evidenceRequired`,
    INVALID_EVIDENCE_TYPE: `${namespace}:schoolCreationRequest.invalidEvidenceType`,
    BADREQUEST: `${namespace}:schoolCreationRequest.badRequest`,
    PROVINCE_NOT_FOUND: `${namespace}:schoolCreationRequest.provinceNotFound`,
    REQ_NOT_FOUND: `${namespace}:schoolCreationRequest.reqNotFound`,
    FORBIDDEN: `${namespace}:schoolCreationRequest.forbidden`,
    NOT_PENDING: `${namespace}:schoolCreationRequest.notPending`,
    DENY_REASON_REQUIRED: `${namespace}:schoolCreationRequest.denyReasonRequired`,

    // School
    SCHOOL_IN_USE: `${namespace}:school.inUse`,
    SCHOOL_NAME_EXISTS: `${namespace}:school.nameExists`,
    PROVINCE_NOT_FOUND: `${namespace}:school.provinceNotFound`,
    SCHOOL_NOT_FOUND: `${namespace}:school.schoolNotFound`,
    UNAUTHORIZED: `${namespace}:school.unauthorized`,
    NAME_EXISTS: `${namespace}:school.nameExists`,

    // SchoolCreationRequest
    REQ_NOT_FOUND: `${namespace}:schoolCreationRequest.notFound`,
    DENY_REASON_REQUIRED: `${namespace}:schoolCreationRequest.denyReasonRequired`,
    INVALID_EVIDENCE_TYPE: `${namespace}:schoolCreationRequest.invalidEvidenceType`,

    // Student
    USER_NOT_STUDENT: `${namespace}:student.userNotStudent`,
    USER_ALREADY_STUDENT: `${namespace}:student.userAlreadyStudent`,
    STUDENT_IN_USE: `${namespace}:student.inUse`,
    STUDENT_NOT_FOUND: `${namespace}:student.studentNotFound`,
    USER_NOT_FOUND: `${namespace}:student.userNotFound`,
    USER_INACTIVE: `${namespace}:student.userInactive`,
    SCHOOL_NOT_FOUND: `${namespace}:student.schoolNotFound`,

    // Submission
    SUBMISSION_NOT_FOUND: `${namespace}:submission.notFound`,
    DEADLINE_PASSED: `${namespace}:submission.deadlinePassed`,
    INVALID_FORMAT: `${namespace}:submission.invalidFormat`,
    FILE_REQUIRED: `${namespace}:submission.fileRequired`,
    FILE_TYPE_NOT_SUPPORTED: `${namespace}:submission.fileTypeNotSupported`,
    CODE_REQUIRED: `${namespace}:submission.codeRequired`,
    NO_TEST_CASES: `${namespace}:submission.noTestCases`,
    CANNOT_EXECUTE: `${namespace}:submission.cannotExecute`,
    FILE_NOT_FOUND: `${namespace}:submission.fileNotFound`,
    SUBMISSION_FLAGGED: `${namespace}:submission.flagged`,
    CANNOT_ACCEPT_RESULT: `${namespace}:submission.cannotAcceptResult`,
    RUBRIC_EVALUATION_ONLY: `${namespace}:submission.rubricEvaluationOnly`,
    NO_RUBRIC_CRITERIA: `${namespace}:submission.noRubricCriteria`,
    MISSING_SCORES: `${namespace}:submission.missingScores`,
    DUPLICATE_CRITERIA: `${namespace}:submission.duplicateCriteria`,
    SCORE_EXCEEDS_MAX: `${namespace}:submission.scoreExceedsMax`,
    SCORE_NEGATIVE: `${namespace}:submission.scoreNegative`,
    NO_MANUAL_TEST_SUBMISSION: `${namespace}:submission.noManualTestSubmission`,
    SUBMISSION_DETAILS_MISSING: `${namespace}:submission.detailsMissing`,
    FINGERPRINT_NOT_FOUND: `${namespace}:submission.fingerprintNotFound`,
    PLAGIARISM_NOT_SUSPECTED: `${namespace}:submission.plagiarismNotSuspected`,
    NO_MOCK_TEST: `${namespace}:submission.noMockTest`,
    INTERNAL_SERVER_ERROR: `${namespace}:submission.internalServerError`,
    NOT_FOUND: `${namespace}:submission.notFound`,
    BADREQUEST: `${namespace}:submission.badRequest`,
    FORBIDDEN: `${namespace}:submission.forbidden`,
    UNAUTHORIZED: `${namespace}:submission.unauthorized`,

    // SubmissionArtifact
    SUBMISSION_ARTIFACT_NOT_FOUND: `${namespace}:submissionArtifact.notFound`,
    INTERNAL_SERVER_ERROR: `${namespace}:submissionArtifact.internalServerError`,
    NOT_FOUND: `${namespace}:submissionArtifact.notFound`,

    // SubmissionDetail
    SUBMISSION_DETAIL_NOT_FOUND: `${namespace}:submissionDetail.notFound`,
    INTERNAL_SERVER_ERROR: `${namespace}:submissionDetail.internalServerError`,
    NOT_FOUND: `${namespace}:submissionDetail.notFound`,

    // TeamInvite
    TEAM_NOT_FOUND: `${namespace}:teamInvite.teamNotFound`,
    TEAM_FULL: `${namespace}:teamInvite.teamFull`,
    STUDENT_NOT_FOUND: `${namespace}:teamInvite.studentNotFound`,
    INVALID_INPUT: `${namespace}:teamInvite.invalidInput`,
    ALREADY_ON_TEAM: `${namespace}:teamInvite.alreadyOnTeam`,
    TIME_CONFLICT: `${namespace}:teamInvite.timeConflict`,
    INVITE_NOT_FOUND: `${namespace}:teamInvite.inviteNotFound`,
    INVITE_NOT_PENDING: `${namespace}:teamInvite.inviteNotPending`,
    STUDENT_PROFILE_REQUIRED: `${namespace}:teamInvite.studentProfileRequired`,
    INVITE_NOT_FOR_YOU: `${namespace}:teamInvite.inviteNotForYou`,
    ACCOUNT_REQUIRED: `${namespace}:teamInvite.accountRequired`,
    NOT_STUDENT: `${namespace}:teamInvite.notStudent`,
    REG_CLOSED: `${namespace}:teamInvite.regClosed`,
    INVITE_EXPIRED: `${namespace}:teamInvite.inviteExpired`,
    EMAIL_MISMATCH: `${namespace}:teamInvite.emailMismatch`,

    // TeamMember
    TEAM_NOT_FOUND: `${namespace}:teamMember.teamNotFound`,
    STUDENT_NOT_FOUND: `${namespace}:teamMember.studentNotFound`,

    // Team
    NOT_MENTOR: `${namespace}:team.notMentor`,
    MENTOR_NOT_BELONG_TO_SCHOOL: `${namespace}:team.mentorNotBelongToSchool`,
    TEAM_NAME_EXISTS: `${namespace}:team.nameExists`,
    MENTOR_CONTEST_LIMIT_EXCEEDED: `${namespace}:team.mentorContestLimitExceeded`,
    TEAM_IN_USE: `${namespace}:team.inUse`,
    CONTEST_STARTED: `${namespace}:team.contestStarted`,
    TEAM_MEMBER_NOT_FOUND: `${namespace}:team.memberNotFound`,
    NOT_FOUND: `${namespace}:team.notFound`,
    CONTEST_NOT_FOUND: `${namespace}:team.contestNotFound`,
    SCHOOL_NOT_FOUND: `${namespace}:team.schoolNotFound`,
    NAME_EXISTS: `${namespace}:team.nameExists`,
    FORBIDDEN: `${namespace}:team.forbidden`,
    UNAUTHENTICATED: `${namespace}:team.unauthenticated`,
    CONFLICT: `${namespace}:team.conflict`,


    // TestCase
    TEST_CASE_NOT_FOUND: `${namespace}:testCase.notFound`,
    TEST_CASE_DATA_REQUIRED: `${namespace}:testCase.dataRequired`,
    INPUT_REQUIRED: `${namespace}:testCase.inputRequired`,
    EXPECTED_OUTPUT_REQUIRED: `${namespace}:testCase.expectedOutputRequired`,
    WEIGHT_INVALID: `${namespace}:testCase.weightInvalid`,
    FIELD_TOO_LONG: `${namespace}:testCase.fieldTooLong`,
    TIME_LIMIT_INVALID: `${namespace}:testCase.timeLimitInvalid`,
    TEST_CASE_LIST_EMPTY: `${namespace}:testCase.listEmpty`,
    DUPLICATE_TEST_CASE_IDS: `${namespace}:testCase.duplicateIds`,
    CANNOT_DELETE_TEST_CASE: `${namespace}:testCase.cannotDelete`,
    TEST_CASE_NOT_AVAILABLE: `${namespace}:testCase.notAvailable`,
    BADREQUEST: `${namespace}:testCase.badRequest`,
    NOT_FOUND: `${namespace}:testCase.notFound`,
    INTERNAL_SERVER_ERROR: `${namespace}:testCase.internalServerError`,
    FORBIDDEN: `${namespace}:testCase.forbidden`,

    // User
    INVALID_ROLE: `${namespace}:user.invalidRole`,
    INVALID_STATUS: `${namespace}:user.invalidStatus`,
    INVALID_PROFILE_TYPE: `${namespace}:user.invalidProfileType`,
    PROFILE_NOT_FOUND: `${namespace}:user.profileNotFound`,
    USER_NOT_FOUND: `${namespace}:user.userNotFound`,
    EMAIL_EXISTS: `${namespace}:user.emailExists`,
    FORBIDDEN: `${namespace}:user.forbidden`,
    PROFILE_NOT_FOUND_MENTOR: `${namespace}:user.profileNotFoundMentor`,
    PROFILE_NOT_FOUND_STUDENT: `${namespace}:user.profileNotFoundStudent`,

    // Cloudinary
    NO_FILE_PROVIDED: `${namespace}:cloudinary.noFileProvided`,
    FILE_TYPE_NOT_ALLOWED: `${namespace}:cloudinary.fileTypeNotAllowed`,
    FILE_SIZE_EXCEEDED: `${namespace}:cloudinary.fileSizeExceeded`,
    NO_IMAGE_STREAM: `${namespace}:cloudinary.noImageStream`,
    EVIDENCE_INVALID_TYPE: `${namespace}:cloudinary.evidenceInvalidType`,
    BADREQUEST: `${namespace}:cloudinary.badRequest`,
    INTERNAL_SERVER_ERROR: `${namespace}:cloudinary.internalServerError`,

    // Judge0
    BADREQUEST: `${namespace}:judge0.badRequest`,
    INTERNAL_SERVER_ERROR: `${namespace}:judge0.internalServerError`,

    // MockTestExecutor
    INTERNAL_SERVER_ERROR: `${namespace}:mockTestExecutor.internalServerError`,
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
    410: `${namespace}:common.gone`,
    409: `${namespace}:common.conflict`,
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
      translation: `${namespace}:common.duplicate`,
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
