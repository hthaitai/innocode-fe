/**
 * Flatten nested objects for i18next interpolation
 */
export const flattenObject = (obj, prefix = "") => {
  if (!obj || typeof obj !== "object") return {}

  const flattened = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key

      if (value === null || value === undefined) continue

      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        Object.assign(flattened, flattenObject(value, newKey))
      } else {
        flattened[newKey] = value
      }
    }
  }
  return flattened
}

/**
 * Extract name from raw message for team invitation notifications
 */
export const extractNameFromMessage = (rawMsg) => {
  if (!rawMsg || typeof rawMsg !== "string") return null

  const patterns = [
    /^(.+?)\s+(?:accepted|declined)\s+your\s+team\s+invitation/i,
    /^(.+?)\s+(?:đã\s+chấp\s+nhận|đã\s+từ\s+chối)\s+lời\s+mời/i,
    /^(.+?)\s+(?:accepted|declined)/i,
  ]

  for (const pattern of patterns) {
    const match = rawMsg.match(pattern)
    if (match?.[1]) {
      const name = match[1].trim()
      if (name.length > 1 && name.length < 100) return name
    }
  }
  return null
}

/**
 * Build interpolation values for notification translation
 */
export const buildInterpolationValues = (
  parsedPayload,
  translationKey,
  rawMessage,
) => {
  const flattenedPayload = flattenObject(parsedPayload)
  const targetType = parsedPayload.targetType || translationKey?.split(".")[0]

  // Extract name from message if needed
  const extractedName =
    translationKey?.includes("invitation") &&
    !parsedPayload.user?.Fullname &&
    !parsedPayload.studentName
      ? extractNameFromMessage(rawMessage)
      : null

  const values = { ...flattenedPayload }

  // Round name
  if (parsedPayload.round?.Name) values["round.Name"] = parsedPayload.round.Name
  if (parsedPayload.round?.name) values["round.Name"] = parsedPayload.round.name
  if (parsedPayload.name && targetType === "round") {
    values["round.Name"] = parsedPayload.name
    values.roundName = parsedPayload.name
  }
  if (parsedPayload.roundName) {
    values["round.Name"] = parsedPayload.roundName
    values.roundName = parsedPayload.roundName
  }

  // Contest name
  if (parsedPayload.contest?.Name)
    values["contest.Name"] = parsedPayload.contest.Name
  if (parsedPayload.contest?.name)
    values["contest.Name"] = parsedPayload.contest.name
  if (parsedPayload.name && targetType === "contest")
    values["contest.Name"] = parsedPayload.name
  if (parsedPayload.contestName)
    values["contest.Name"] = parsedPayload.contestName

  // User fullname
  if (parsedPayload.user?.Fullname)
    values["user.Fullname"] = parsedPayload.user.Fullname
  if (parsedPayload.user?.fullname)
    values["user.Fullname"] = parsedPayload.user.fullname
  if (parsedPayload.user?.FullName)
    values["user.Fullname"] = parsedPayload.user.FullName
  if (parsedPayload.studentName)
    values["user.Fullname"] = parsedPayload.studentName
  if (extractedName) values["user.Fullname"] = extractedName

  // Invite properties
  if (parsedPayload.invite?.Contest?.Name)
    values["invite.Contest.Name"] = parsedPayload.invite.Contest.Name
  if (parsedPayload.invite?.Contest?.name)
    values["invite.Contest.Name"] = parsedPayload.invite.Contest.name
  if (parsedPayload.invite?.Judge?.Fullname)
    values["invite.Judge.Fullname"] = parsedPayload.invite.Judge.Fullname
  if (parsedPayload.invite?.Judge?.fullname)
    values["invite.Judge.Fullname"] = parsedPayload.invite.Judge.fullname

  // Registration properties
  if (parsedPayload.reg?.Fullname)
    values["reg.Fullname"] = parsedPayload.reg.Fullname
  if (parsedPayload.reg?.fullname)
    values["reg.Fullname"] = parsedPayload.reg.fullname
  if (parsedPayload.reg?.RequestedRole)
    values["reg.RequestedRole"] = parsedPayload.reg.RequestedRole
  if (parsedPayload.reg?.requestedRole)
    values["reg.RequestedRole"] = parsedPayload.reg.requestedRole

  // Direct registration fields (for role_registration.submitted)
  if (parsedPayload.fullname) values.fullname = parsedPayload.fullname
  if (parsedPayload.requestedRole)
    values.requestedRole = parsedPayload.requestedRole

  // Team name
  if (parsedPayload.team?.Name) values["team.Name"] = parsedPayload.team.Name
  if (parsedPayload.team?.name) values["team.Name"] = parsedPayload.team.name
  if (parsedPayload.teamName) values["team.Name"] = parsedPayload.teamName

  // Request name
  if (parsedPayload.req?.Name) values["req.Name"] = parsedPayload.req.Name
  if (parsedPayload.req?.name) values["req.Name"] = parsedPayload.req.name

  // Direct name field (for school.creation_request.submitted)
  if (
    parsedPayload.name &&
    !values["req.Name"] &&
    targetType === "school_creation_request"
  ) {
    values.name = parsedPayload.name
  }

  // School name - handle both direct schoolName field and name field for school notifications
  if (parsedPayload.schoolName) {
    values.schoolName = parsedPayload.schoolName
  } else if (
    parsedPayload.name &&
    (targetType === "school" || targetType === "school_creation_request")
  ) {
    // For school.approved, school.rejected, school.creation_request.approved/denied notifications
    values.schoolName = parsedPayload.name
  }

  return values
}

/**
 * Parse notification payload
 */
export const parseNotificationPayload = (notification) => {
  let parsedPayload = {}
  try {
    parsedPayload =
      typeof notification.payload === "string"
        ? JSON.parse(notification.payload)
        : notification.payload || {}
  } catch {
    // ignore
  }
  return parsedPayload
}

/**
 * Get translation key from notification
 */
export const getTranslationKey = (notification, parsedPayload) => {
  return notification.type || parsedPayload.type || parsedPayload.Type
}
