import React, { useState } from "react"
import { Icon } from "@iconify/react"
import { authApi } from "../../../../api/authApi"

export default function PasswordTab() {
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
      newErrors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match"
    }

    if (formData.currentPassword && formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = "New password must be different from current password"
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
      
      setSuccessMessage("Password updated successfully!")
      
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
        "Failed to update password. Please check your current password."
      
      // Set error to currentPassword field if it's about authentication
      if (errorMessage.toLowerCase().includes("current") || 
          errorMessage.toLowerCase().includes("password") ||
          errorMessage.toLowerCase().includes("incorrect")) {
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
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Security Settings
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Current Password
          </label>
          <div
            className={`relative bg-gray-50 border-2 rounded-xl p-2 transition-all duration-200 ${
              errors.currentPassword
                ? "border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
                : "border-gray-200 hover:border-orange-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 group-hover:shadow-md"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon
                icon="mdi:lock-outline"
                className="h-5 w-5 text-gray-400"
              />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange("currentPassword")}
                placeholder="Enter your current password"
                className="flex-1 outline-none bg-transparent text-base text-gray-800 placeholder-gray-400"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="p-2 hover:bg-orange-100 rounded-lg transition-all duration-200"
                disabled={isSubmitting}
              >
                <Icon
                  icon={showCurrentPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="h-5 w-5 text-gray-500 hover:text-orange-500"
                />
              </button>
            </div>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-red-500 mt-1 ml-1">{errors.currentPassword}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            New Password
          </label>
          <div
            className={`relative bg-gray-50 border-2 rounded-xl p-2 transition-all duration-200 ${
              errors.newPassword
                ? "border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
                : "border-gray-200 hover:border-orange-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 group-hover:shadow-md"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon
                icon="mdi:lock-plus-outline"
                className="h-5 w-5 text-gray-400"
              />
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange("newPassword")}
                placeholder="Enter your new password"
                className="flex-1 outline-none bg-transparent text-base text-gray-800 placeholder-gray-400"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="p-2 hover:bg-orange-100 rounded-lg transition-all duration-200"
                disabled={isSubmitting}
              >
                <Icon
                  icon={showNewPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="h-5 w-5 text-gray-500 hover:text-orange-500"
                />
              </button>
            </div>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1 ml-1">{errors.newPassword}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Confirm New Password
          </label>
          <div
            className={`relative bg-gray-50 border-2 rounded-xl p-2 transition-all duration-200 ${
              errors.confirmNewPassword
                ? "border-red-400 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
                : "border-gray-200 hover:border-orange-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 group-hover:shadow-md"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon
                icon="mdi:lock-check-outline"
                className="h-5 w-5 text-gray-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmNewPassword}
                onChange={handleChange("confirmNewPassword")}
                placeholder="Confirm your new password"
                className="flex-1 outline-none bg-transparent text-base text-gray-800 placeholder-gray-400"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-2 hover:bg-orange-100 rounded-lg transition-all duration-200"
                disabled={isSubmitting}
              >
                <Icon
                  icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                  className="h-5 w-5 text-gray-500 hover:text-orange-500"
                />
              </button>
            </div>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-sm text-red-500 mt-1 ml-1">{errors.confirmNewPassword}</p>
          )}
        </div>

        {successMessage && (
          <div className="flex items-center space-x-2 p-4 bg-green-50 border-2 border-green-400 rounded-xl">
            <Icon icon="mdi:check-circle" className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-orange-600 hover:to-orange-700"
            }`}
          >
            <div className="flex items-center space-x-2">
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-t-white border-orange-300 rounded-full animate-spin"></span>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Icon icon="mdi:check" className="h-5 w-5" />
                  <span>Update Password</span>
                </>
              )}
            </div>
          </button>
        </div>
      </form>
    </div>
  )
}

