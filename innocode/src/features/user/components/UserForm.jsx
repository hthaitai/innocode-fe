import React from "react"
import { useTranslation } from "react-i18next"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"

const USER_ROLES = [
  { value: "Student", label: "Student" },
  { value: "Mentor", label: "Mentor" },
  { value: "Organizer", label: "Organizer" },
  { value: "Judge", label: "Judge" },
  { value: "SchoolManager", label: "School Manager" },
  { value: "Staff", label: "Staff" },
  { value: "Admin", label: "Admin" },
]

export default function UserForm({
  formData,
  setFormData,
  errors = {},
  mode = "edit",
}) {
  const { t } = useTranslation(["pages", "common"])

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
        options={USER_ROLES}
        error={errors.role}
        placeholder={t("userManagement.selectRole")}
        required
        disabled={mode === "edit"}
      />
    </div>
  )
}
