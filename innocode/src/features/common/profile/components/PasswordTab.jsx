import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"
import { authApi } from "../../../../api/authApi"
import { motion, AnimatePresence } from "framer-motion"

export default function PasswordTab() {
  const { t } = useTranslation("pages")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error and success message when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (successMessage) {
      setSuccessMessage("")
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = t("profile.password.currentPasswordRequired")
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("profile.password.newPasswordRequired")
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("profile.password.passwordMinLength")
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = t(
        "profile.password.confirmPasswordRequired"
      )
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = t("profile.password.passwordsNotMatch")
    }

    if (
      formData.currentPassword &&
      formData.newPassword === formData.currentPassword
    ) {
      newErrors.newPassword = t("profile.password.passwordMustDiffer")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      })

      setSuccessMessage(t("profile.password.passwordUpdatedSuccess"))

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      })
      setErrors({})
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errorMessage ||
        t("profile.password.passwordUpdateFailed")

      // Set error to currentPassword field if it's about authentication
      if (
        errorMessage.toLowerCase().includes("current") ||
        errorMessage.toLowerCase().includes("password") ||
        errorMessage.toLowerCase().includes("incorrect")
      ) {
        setErrors({ currentPassword: errorMessage })
      } else {
        // Set as general error on newPassword field
        setErrors({ newPassword: errorMessage })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-title-2 text-[#18181B] mb-2 font-bold tracking-tight">
          {t("profile.password.title")}
        </h3>
        <p className="text-body-1 text-[#52525B] font-medium">
          Secure your account by updating your password regularly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {[
          {
            id: "currentPassword",
            label: t("profile.password.currentPassword"),
            placeholder: t("profile.password.enterCurrentPassword"),
            icon: "mdi:lock-outline",
            show: showCurrentPassword,
            setShow: setShowCurrentPassword,
          },
          {
            id: "newPassword",
            label: t("profile.password.newPassword"),
            placeholder: t("profile.password.enterNewPassword"),
            icon: "mdi:lock-plus-outline",
            show: showNewPassword,
            setShow: setShowNewPassword,
          },
          {
            id: "confirmNewPassword",
            label: t("profile.password.confirmNewPassword"),
            placeholder: t("profile.password.confirmNewPasswordPlaceholder"),
            icon: "mdi:lock-check-outline",
            show: showConfirmPassword,
            setShow: setShowConfirmPassword,
          },
        ].map((field) => (
          <div key={field.id} className="group">
            <label className="block text-caption-2-strong text-[#A1A1AA] mb-2 uppercase tracking-[0.1em] ml-1">
              {field.label}
            </label>
            <div
              className={`relative bg-white border rounded-[5px] p-1 transition-all duration-300 ${
                errors[field.id]
                  ? "border-red-400 bg-red-50/30"
                  : "border-[#E5E5E5] focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-50 hover:border-orange-200"
              }`}
            >
              <div className="flex items-center gap-3 px-3">
                <div
                  className={`p-2 rounded-[5px] transition-colors ${
                    errors[field.id]
                      ? "bg-red-50 text-red-500"
                      : "bg-white text-[#A1A1AA] group-focus-within:text-[#E05307]"
                  }`}
                >
                  <Icon icon={field.icon} className="h-5 w-5" />
                </div>
                <input
                  type={field.show ? "text" : "password"}
                  value={formData[field.id]}
                  onChange={handleChange(field.id)}
                  placeholder={field.placeholder}
                  className="flex-1 py-3 outline-none bg-transparent text-body-1 text-[#18181B] font-semibold placeholder-[#A1A1AA]"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => field.setShow(!field.show)}
                  className="p-2 hover:bg-orange-50 rounded-[5px] transition-all text-[#A1A1AA] hover:text-[#E05307]"
                  disabled={isSubmitting}
                >
                  <Icon
                    icon={field.show ? "mdi:eye-off" : "mdi:eye"}
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>
            <AnimatePresence>
              {errors[field.id] && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-caption-1 text-[#DC2626] font-medium mt-2 ml-2"
                >
                  {errors[field.id]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}

        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 bg-[#F0FDF4] border border-[#dcfce7] rounded-[5px]"
            >
              <div className="p-2 bg-white rounded-full text-[#166534]">
                <Icon icon="mdi:check-circle" className="h-5 w-5" />
              </div>
              <p className="text-body-1 text-[#166534] font-bold">
                {successMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#E05307] text-white py-3 rounded-[5px] text-body-1-strong shadow-lg transition-all transform active:scale-[0.98] relative overflow-hidden group ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#C2410C]"
            }`}
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{t("profile.password.updating")}</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:shield-check" className="h-6 w-6" />
                  <span>{t("profile.password.updatePassword")}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </form>
    </div>
  )
}
