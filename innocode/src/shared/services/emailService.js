import emailjs from "@emailjs/browser"

export const initEmailJs = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  if (publicKey) {
    emailjs.init(publicKey)
  }
}

export const sendTeamInviteEmail = async ({
  toEmail,
  teamName,
  mentorName,
  contestName,
  acceptUrl,
  declineUrl,
}) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEAM_INVITE_TEMPLATE_ID
  if (!serviceId || !templateId) {
    throw new Error("EmailJs configuration is missing")
  }
  const templateParams = {
    to_email: toEmail,
    team_name: teamName,
    mentor_name: mentorName,
    contest_name: contestName,
    accept_url: acceptUrl,
    decline_url: declineUrl,
  }
  try {
    const response = await emailjs.send(serviceId, templateId, templateParams)
    console.log("✅ Team invite email sent successfully:", response)
    return true
  } catch (error) {
    console.error("❌ Error sending team invite email:", error)
    return false
  }
}

export const sendVerificationEmail = async ({
  toEmail,
  verificationToken,
  fullName,
}) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_VERIFY_EMAIL_TEMPLATE_ID

  if (!serviceId || !templateId) {
    throw new Error("EmailJs configuration is missing")
  }

  // Construct verification URL
  const baseUrl = window.location.origin
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`

  const templateParams = {
    to_email: toEmail,
    user_name: fullName || "User",
    verification_url: verificationUrl,
    verification_token: verificationToken,
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams)
    console.log("✅ Verification email sent successfully:", response)
    return true
  } catch (error) {
    console.error("❌ Error sending verification email:", error)
    throw error
  }
}

export const sendResetPasswordEmail = async ({
  toEmail,
  resetToken,
  fullName,
}) => {
  // Init EmailJS với public key riêng cho reset password
  const resetPasswordPublicKey = import.meta.env
    .VITE_EMAILJS_PUBLIC_KEY_RESET_PASSWORD
  if (resetPasswordPublicKey) {
    emailjs.init(resetPasswordPublicKey)
  }

  const serviceId = import.meta.env.VITE_EMAILJS_RESET_PASSWORD_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_PASSWORD_RESET_TEMPLATE_ID

  if (!serviceId || !templateId) {
    throw new Error("EmailJs configuration is missing")
  }

  // Construct reset password URL
  const baseUrl = window.location.origin
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

  const templateParams = {
    to_email: toEmail,
    user_name: fullName || "User",
    reset_url: resetUrl,
    reset_token: resetToken,
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams)
    console.log("✅ Reset password email sent successfully:", response)
    return true
  } catch (error) {
    console.error("❌ Error sending reset password email:", error)
    throw error
  }
}

export const sendJudgeInviteEmail = async ({
  judgeEmail,
  judgeName,
  contestName,
  acceptUrl,
  declineUrl,
}) => {
  const resetPasswordPublicKey = import.meta.env
    .VITE_EMAILJS_PUBLIC_KEY_RESET_PASSWORD
  if (resetPasswordPublicKey) {
    emailjs.init(resetPasswordPublicKey)
  }

  const serviceId = import.meta.env.VITE_EMAILJS_RESET_PASSWORD_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_JUDGE_INVITE_TEMPLATE_ID
  if (!serviceId || !templateId)
    throw new Error("EmailJs configuration is missing")

  console.log("EmailJS Service ID:", serviceId)
  console.log("EmailJS Template ID:", templateId)

  const templateParams = {
    judge_email: judgeEmail,
    judge_name: judgeName,
    contest_name: contestName,
    accept_url: acceptUrl,
    decline_url: declineUrl,
  }

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams)
    console.log("✅ Judge invite email sent successfully:", response)
    return true
  } catch (error) {
    console.error("❌ Error sending judge invite email:", error)
    return false
  }
}
