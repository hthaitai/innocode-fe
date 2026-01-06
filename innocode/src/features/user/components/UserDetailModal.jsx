import React from "react"
import { useTranslation } from "react-i18next"
import BaseModal from "@/shared/components/BaseModal"
import { formatDateTime } from "@/shared/utils/dateTime"

export default function UserDetailModal({ isOpen, user, onClose }) {
  const { t } = useTranslation(["pages", "common"])

  if (!user) return null

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700"
      case "Inactive":
        return "bg-gray-100 text-gray-700"
      case "Locked":
        return "bg-red-100 text-red-700"
      case "Unverified":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700"
      case "Staff":
        return "bg-blue-100 text-blue-700"
      case "Organizer":
        return "bg-indigo-100 text-indigo-700"
      case "Judge":
        return "bg-cyan-100 text-cyan-700"
      case "SchoolManager":
        return "bg-teal-100 text-teal-700"
      case "Mentor":
        return "bg-orange-100 text-orange-700"
      case "Student":
        return "bg-pink-100 text-pink-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const DetailRow = ({ label, value, badge = false, badgeColor = "" }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100 last:border-0">
      <div className="text-sm font-medium text-gray-600 sm:w-1/3">{label}:</div>
      <div className="text-sm text-gray-800 sm:w-2/3">
        {badge && value ? (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
          >
            {value}
          </span>
        ) : (
          value || "—"
        )}
      </div>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("userManagement.userDetails")}
      size="lg"
    >
      <div className="space-y-1">
        {/* Basic Information */}
        <div className="bg-white rounded-lg">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            {t("userManagement.basicInformation")}
          </h3>
          <div className="space-y-0">
            <DetailRow
              label={t("userManagement.userId")}
              value={user.userId || user.id}
            />
            <DetailRow
              label={t("userManagement.fullName")}
              value={user.fullname || user.fullName}
            />
            <DetailRow label={t("userManagement.email")} value={user.email} />
            <DetailRow
              label={t("userManagement.role")}
              value={user.role}
              badge
              badgeColor={getRoleBadgeColor(user.role)}
            />
            <DetailRow
              label={t("userManagement.status")}
              value={user.status}
              badge
              badgeColor={getStatusBadgeColor(user.status)}
            />
          </div>
        </div>

        {/* Additional Information */}
        {(user.createdAt || user.updatedAt || user.lastLogin) && (
          <div className="bg-white rounded-lg mt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              {t("userManagement.additionalInformation")}
            </h3>
            <div className="space-y-0">
              {user.createdAt && (
                <DetailRow
                  label={t("userManagement.createdAt")}
                  value={formatDateTime(user.createdAt)}
                />
              )}
              {user.updatedAt && (
                <DetailRow
                  label={t("userManagement.updatedAt")}
                  value={formatDateTime(user.updatedAt)}
                />
              )}
              {user.lastLogin && (
                <DetailRow
                  label={t("userManagement.lastLogin")}
                  value={formatDateTime(user.lastLogin)}
                />
              )}
            </div>
          </div>
        )}

        {/* Profile-specific Information */}
        {(user.schoolId || user.grade || user.phoneNumber) && (
          <div className="bg-white rounded-lg mt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              {t("userManagement.profileInformation")}
            </h3>
            <div className="space-y-0">
              {user.schoolId && (
                <DetailRow
                  label={t("userManagement.schoolId")}
                  value={user.schoolId}
                />
              )}
              {user.grade && (
                <DetailRow
                  label={t("userManagement.grade")}
                  value={user.grade}
                />
              )}
              {user.phoneNumber && (
                <DetailRow
                  label={t("userManagement.phoneNumber")}
                  value={user.phoneNumber}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
        <button type="button" className="button-white" onClick={onClose}>
          {t("common:buttons.close")}
        </button>
      </div>
    </BaseModal>
  )
}
