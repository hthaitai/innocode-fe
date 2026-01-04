import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"
import { toast } from "react-hot-toast"
import { useUpdateUserMeMutation } from "../../../../services/userApi"
import { motion, AnimatePresence } from "framer-motion"

const InfoField = ({
  label,
  value,
  icon,
  showEdit = true,
  field,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  isLoading,
}) => {
  const { t } = useTranslation("pages")
  const [editValue, setEditValue] = useState(value || "")
  const [error, setError] = useState("")

  React.useEffect(() => {
    if (isEditing) {
      setEditValue(value || "")
      setError("")
    }
  }, [isEditing, value])

  if (!value && !isEditing) return null

  const validate = () => {
    if (!editValue || editValue.trim() === "") {
      setError(t("profile.about.fieldRequired", { field: label }))
      return false
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(editValue.trim())) {
        setError(t("profile.about.emailInvalid"))
        return false
      }
    }

    if (field === "fullName" && editValue.trim().length < 2) {
      setError(t("profile.about.fullNameMinLength"))
      return false
    }

    return true
  }

  const handleSave = () => {
    if (validate()) {
      onSave(editValue.trim())
    }
  }

  const handleCancel = () => {
    setEditValue(value || "")
    setError("")
    onCancel()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  return (
    <div className="group">
      <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em] ml-1">
        {label}
      </label>
      <div
        className={`relative bg-gray-50/50 border rounded-2xl p-4 transition-all duration-300 ${
          isEditing
            ? "border-orange-400 ring-4 ring-orange-50 bg-white shadow-lg"
            : "border-gray-100 hover:border-orange-200 hover:bg-white hover:shadow-md"
        }`}
      >
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Icon icon={icon} className="h-5 w-5 text-orange-500" />
                </div>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={editValue}
                  onChange={(e) => {
                    setEditValue(e.target.value)
                    setError("")
                  }}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="flex-1 text-base text-gray-800 font-semibold bg-transparent border-none outline-none"
                  placeholder={t("profile.about.enterPlaceholder", {
                    field: label.toLowerCase(),
                  })}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-red-500 font-medium ml-12"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
                >
                  {t("profile.about.cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || editValue.trim() === value}
                  className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLoading || editValue.trim() === value
                      ? "bg-gray-300 shadow-none"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-orange-200"
                  }`}
                >
                  {isLoading
                    ? t("profile.about.saving")
                    : t("profile.about.save")}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="viewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-gray-400 group-hover:text-orange-500 group-hover:border-orange-100 transition-colors">
                  <Icon icon={icon} className="h-5 w-5" />
                </div>
                <span className="text-base text-gray-700 font-bold tracking-tight">
                  {value}
                </span>
              </div>
              {showEdit && (
                <button
                  onClick={() => onEdit(field)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all duration-300"
                >
                  <Icon icon="mdi:pencil" className="h-5 w-5" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function AboutTab({ user }) {
  const { t } = useTranslation("pages")
  const details = user?.details || {}
  const [editingField, setEditingField] = useState(null)
  const [updateUserMe, { isLoading }] = useUpdateUserMeMutation()

  const handleEdit = (field) => {
    setEditingField(field)
  }

  const handleCancel = () => {
    setEditingField(null)
  }

  const handleSave = async (newValue) => {
    try {
      const payload = {
        [editingField]: newValue,
      }

      await updateUserMe(payload).unwrap()
      const fieldName =
        editingField === "fullName"
          ? t("profile.about.fullName")
          : t("profile.about.emailAddress")
      toast.success(t("profile.about.updateSuccess", { field: fieldName }))
      setEditingField(null)
    } catch (error) {
      const fieldName =
        editingField === "fullName"
          ? t("profile.about.fullName")
          : t("profile.about.emailAddress")
      toast.error(
        error?.data?.message ||
          t("profile.about.updateFailed", { field: fieldName })
      )
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {t("profile.about.title")}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField
          label={t("profile.about.fullName")}
          value={user?.fullName}
          icon="mdi:account-box-outline"
          field="fullName"
          isEditing={editingField === "fullName"}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          isLoading={isLoading}
        />

        <InfoField
          label={t("profile.about.emailAddress")}
          value={user?.email}
          icon="mdi:email-outline"
          isLoading={isLoading}
          showEdit={false}
        />

        {details.grade && (
          <InfoField
            label={t("profile.about.grade")}
            value={`${t("profile.about.grade")} ${details.grade}`}
            icon="mdi:school-outline"
            showEdit={false}
          />
        )}

        {details.province && (
          <InfoField
            label={t("profile.about.province")}
            value={details.province}
            icon="mdi:map-marker-outline"
            showEdit={false}
          />
        )}

        {details.schoolName && (
          <InfoField
            label={t("profile.about.school")}
            value={details.schoolName}
            icon="mdi:school"
            showEdit={false}
          />
        )}
      </div>
    </div>
  )
}
