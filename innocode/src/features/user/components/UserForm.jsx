import React from "react"
import { useTranslation } from "react-i18next"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function UserForm({
  formData,
  setFormData,
  errors = {},
  mode = "edit",
}) {
  const { t } = useTranslation(["pages", "common"])

  const TRANSLATED_ROLES = [
    { value: "Student", label: t("common:roles.student") },
    { value: "Mentor", label: t("common:roles.mentor") },
    { value: "Organizer", label: t("common:roles.organizer") },
    { value: "Judge", label: t("common:roles.judge") },
    { value: "SchoolManager", label: t("common:roles.schoolmanager") },
    { value: "Staff", label: t("common:roles.staff") },
    { value: "Admin", label: t("common:roles.admin") },
  ]

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <TextFieldFluent
        label={t("userManagement.fullName")}
        value={formData.fullname || ""}
        onChange={(e) => handleChange("fullname", e.target.value)}
        error={errors.fullname}
        placeholder={t("userManagement.enterFullName")}
        required
      />

      {/* Email */}
      <TextFieldFluent
        label={t("userManagement.email")}
        value={formData.email || ""}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        placeholder={t("userManagement.enterEmail")}
        required
      />

      {/* Role */}
      <DropdownFluent
        label={t("userManagement.role")}
        value={formData.role || ""}
        onChange={(value) => handleChange("role", value)}
        options={TRANSLATED_ROLES}
        error={errors.role}
        placeholder={t("userManagement.selectRole")}
        required
        disabled={mode === "edit"}
      />
    </div>
  )
}
