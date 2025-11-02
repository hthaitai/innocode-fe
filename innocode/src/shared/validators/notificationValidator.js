export const validateNotification = (data) => {
  const errors = {}

  // ----- Type -----
  if (!data.type || !data.type.trim()) {
    errors.type = "Notification type is required"
  } else if (data.type.length > 100) {
    errors.type = "Notification type cannot exceed 100 characters"
  }

  // ----- Channel -----
  if (!data.channel || !data.channel.trim()) {
    errors.channel = "Notification channel is required"
  } else if (!["web", "email", "sms"].includes(data.channel.toLowerCase())) {
    errors.channel = "Invalid notification channel"
  }

  // ----- Payload (Message Content) -----
  if (!data.payload || !data.payload.trim()) {
    errors.payload = "Message content is required"
  } else if (data.payload.length > 500) {
    errors.payload = "Message content cannot exceed 500 characters"
  }

  // ----- Target (optional, e.g., user_id or audience) -----
  if (data.user_id && isNaN(Number(data.user_id))) {
    errors.user_id = "Invalid user ID"
  }

  return errors
}
