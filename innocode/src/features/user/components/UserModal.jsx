import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import BaseModal from "@/shared/components/BaseModal"
import UserForm from "./UserForm"

export default function UserModal({
  isOpen,
  mode = "edit",
  initialData = {},
  onSubmit,
  onClose,
}) {
  const { t } = useTranslation(["pages", "common"])

  const emptyData = useMemo(
    () => ({
      fullname: "",
      email: "",
      role: "",
    }),
    [],
  )

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" ? { ...initialData } : emptyData)
      setErrors({})
    }
  }, [isOpen, mode, initialData, emptyData])

  const validateForm = () => {
    const newErrors = {}

    // Ensure we are working with strings for trim()
    const fullname = String(formData.fullname || "")
    const email = String(formData.email || "")

    if (!fullname.trim()) {
      newErrors.fullname = t("userManagement.fullNameRequired")
    }

    if (!email.trim()) {
      newErrors.email = t("userManagement.emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("userManagement.emailInvalid")
    }

    if (!formData.role) {
      newErrors.role = t("userManagement.roleRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error("Error submitting user form:", error)
    }
  }

  const title = useMemo(
    () =>
      mode === "edit"
        ? `${t("userManagement.editUser")}: ${initialData.fullname || ""}`
        : t("userManagement.createUser"),
    [mode, initialData.fullname, t],
  )

  const footer = useMemo(
    () => (
      <div className="flex justify-end gap-2">
        <button type="button" className="button-white" onClick={onClose}>
          {t("common:buttons.cancel")}
        </button>
        <button type="button" className="button-orange" onClick={handleSubmit}>
          {mode === "edit"
            ? t("common:buttons.save")
            : t("common:buttons.create")}
        </button>
      </div>
    ),
    [mode, onClose, handleSubmit, t],
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="md"
    >
      <UserForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        mode={mode}
      />
    </BaseModal>
  )
}
