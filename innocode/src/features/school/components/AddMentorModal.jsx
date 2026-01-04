import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { useAddMentorToSchoolMutation } from "@/services/schoolApi"
import { toast } from "react-hot-toast"
import { Icon } from "@iconify/react"

export default function AddMentorModal({ isOpen, onClose, schoolId }) {
  const { t } = useTranslation("pages")
  const emptyData = {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [addMentor, { isLoading }] = useAddMentorToSchoolMutation()

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(emptyData)
      setErrors({})
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Validate fullname
    if (!formData.fullname.trim()) {
      newErrors.fullname = t("addMentorModal.fullNameRequired")
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = t("addMentorModal.fullNameMinLength")
    } else if (!/^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(formData.fullname.trim())) {
      newErrors.fullname = t("addMentorModal.fullNameInvalid")
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = t("addMentorModal.emailRequired")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = t("addMentorModal.emailInvalid")
      }
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = t("addMentorModal.phoneRequired")
    } else {
      const phoneRegex = /^[0-9+\-\s()]+$/
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = t("addMentorModal.phoneInvalid")
      } else if (formData.phone.trim().replace(/[^0-9]/g, "").length < 10) {
        newErrors.phone = t("addMentorModal.phoneMinLength")
      }
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = t("addMentorModal.passwordRequired")
    } else if (formData.password.length < 8) {
      newErrors.password = t("addMentorModal.passwordMinLength")
    } else {
      // Check password strength
      const hasUpperCase = /[A-Z]/.test(formData.password)
      const hasLowerCase = /[a-z]/.test(formData.password)
      const hasNumber = /[0-9]/.test(formData.password)

      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        newErrors.password = t("addMentorModal.passwordWeak")
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("addMentorModal.confirmPasswordRequired")
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("addMentorModal.passwordsNotMatch")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async () => {
    // First validate client-side
    if (!validateForm()) {
      return
    }

    try {
      await addMentor({
        schoolId,
        data: {
          fullname: formData.fullname.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone.trim(),
        },
      }).unwrap()

      toast.success(t("addMentorModal.mentorAddedSuccess"))
      onClose()
    } catch (error) {
      // Parse backend validation errors
      if (error?.data?.errors) {
        const backendErrors = {}
        const errorObj = error.data.errors

        // Map backend field names to frontend field names
        const fieldMapping = {
          Email: "email",
          Phone: "phone",
          Fullname: "fullname",
          Password: "password",
          ConfirmPassword: "confirmPassword",
        }

        // Parse errors and map to form fields
        Object.keys(errorObj).forEach((key) => {
          const frontendField = fieldMapping[key] || key.toLowerCase()
          const errorMessages = errorObj[key]

          if (Array.isArray(errorMessages) && errorMessages.length > 0) {
            backendErrors[frontendField] = errorMessages[0]
          } else if (typeof errorMessages === "string") {
            backendErrors[frontendField] = errorMessages
          }
        })

        // Set errors to form fields
        if (Object.keys(backendErrors).length > 0) {
          setErrors(backendErrors)
          return
        }
      }

      // If no validation errors, show general error message
      const errorMessage =
        error?.data?.errorMessage ||
        error?.data?.message ||
        error?.message ||
        t("addMentorModal.mentorAddedFailed")
      toast.error(errorMessage)
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="button-white"
        onClick={onClose}
        disabled={isLoading}
      >
        {t("addMentorModal.cancel")}
      </button>
      <button
        type="button"
        className="button-orange"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? t("addMentorModal.adding") : t("addMentorModal.addMentor")}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("addMentorModal.title")}
      size="lg"
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <TextFieldFluent
          label={t("addMentorModal.fullName")}
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          error={!!errors.fullname}
          helperText={errors.fullname}
          placeholder={t("addMentorModal.enterFullName")}
        />

        {/* Email */}
        <TextFieldFluent
          label={t("schoolDetail.email")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          placeholder={t("addMentorModal.enterEmail")}
        />

        {/* Phone */}
        <TextFieldFluent
          label={t("schoolDetail.phone")}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          placeholder={t("addMentorModal.enterPhone")}
        />

        {/* Password */}
        <TextFieldFluent
          label={t("addMentorModal.password")}
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          placeholder={t("addMentorModal.enterPassword")}
          endButton={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 hover:bg-orange-100 rounded transition-colors"
              tabIndex={-1}
            >
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                className="h-5 w-5 text-gray-500 hover:text-orange-500"
              />
            </button>
          }
        />

        {/* Confirm Password */}
        <TextFieldFluent
          label={t("addMentorModal.confirmPassword")}
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          placeholder={t("addMentorModal.confirmPasswordPlaceholder")}
          endButton={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1 hover:bg-orange-100 rounded transition-colors"
              tabIndex={-1}
            >
              <Icon
                icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                className="h-5 w-5 text-gray-500 hover:text-orange-500"
              />
            </button>
          }
        />
      </div>
    </BaseModal>
  )
}
