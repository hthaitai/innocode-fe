import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { Eye, EyeOff } from "lucide-react"

export default function StaffRegistrationModal({
  isOpen,
  onSubmit,
  onClose,
  loading = false,
}) {
  const { t } = useTranslation(["pages", "common"])

  const emptyData = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(emptyData)
      setErrors({})
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("userManagement.fullNameRequired")
    }

    if (!formData.email.trim()) {
      newErrors.email = t("userManagement.emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("userManagement.emailInvalid")
    }

    if (!formData.password) {
      newErrors.password = t("userManagement.passwordRequired")
    } else if (formData.password.length < 8) {
      newErrors.password = t("userManagement.passwordMinLength")
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password,
      )
    ) {
      newErrors.password = t("userManagement.passwordRequirements")
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("userManagement.confirmPasswordRequired")
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("userManagement.passwordsNotMatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Staff registration failed:", error)
      // Check if it's a validation error from server
      const serverErrors = error?.data?.errors
      const errorCode = error?.data?.errorCode || error?.data?.Code
      const errorMessage = error?.data?.errorMessage || error?.data?.message

      if (serverErrors) {
        const newErrors = {}
        Object.keys(serverErrors).forEach((key) => {
          // Normalize key (e.g. Email -> email, FullName -> fullName)
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1)
          if (formData.hasOwnProperty(fieldName)) {
            newErrors[fieldName] = Array.isArray(serverErrors[key])
              ? serverErrors[key][0]
              : serverErrors[key]
          }
        })
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors)
        }
      } else if (errorMessage && errorMessage.includes(":")) {
        // Try to parse "Field: Error Message" format (e.g., "Password: Required")
        const [fieldPart, ...messageParts] = errorMessage.split(":")
        const fieldPartTrimmed = fieldPart.trim()
        const fieldName =
          fieldPartTrimmed.charAt(0).toLowerCase() + fieldPartTrimmed.slice(1)
        const message = messageParts.join(":").trim()

        if (fieldName in formData) {
          setErrors((prev) => ({ ...prev, [fieldName]: message }))
        }
      } else if (errorCode) {
        // Fallback to error code mapping
        if (errorCode === "EMAIL_EXISTS") {
          setErrors((prev) => ({
            ...prev,
            email: t("roleRegistrations.emailAlreadyExists"),
          }))
        }
      }
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="button-white"
        onClick={onClose}
        disabled={loading}
      >
        {t("common:buttons.cancel")}
      </button>
      <button
        type="button"
        className="button-orange"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? t("common:buttons.loading") : t("common:buttons.create")}
      </button>
    </div>
  )

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("userManagement.createStaff")}
      footer={footer}
      size="md"
    >
      <div className="space-y-4">
        <TextFieldFluent
          label={t("userManagement.fullName")}
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={!!errors.fullName}
          helperText={errors.fullName}
          placeholder={t("userManagement.enterFullName")}
          required
        />

        <TextFieldFluent
          label={t("userManagement.email")}
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          placeholder={t("userManagement.enterEmail")}
          required
        />

        <div className="relative">
          <TextFieldFluent
            label={t("userManagement.password")}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            placeholder={t("userManagement.password")}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <TextFieldFluent
            label={t("userManagement.confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            placeholder={t("userManagement.confirmPassword")}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
