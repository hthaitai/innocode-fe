import React from "react"
import { useTranslation } from "react-i18next"
import BaseModal from "@/shared/components/BaseModal"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useGetUserByIdQuery } from "@/services/userApi"

export default function UserDetailModal({ isOpen, user, onClose }) {
  const { t } = useTranslation(["pages", "common"])

  const userId = user?.userId || user?.id
  const { data: fullUserData, isLoading } = useGetUserByIdQuery(userId, {
    skip: !isOpen || !userId,
  })

  const displayUser = fullUserData || user

  if (!displayUser && !isLoading) return null

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
      loading={isLoading}
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
              value={displayUser.userId || displayUser.id}
            />
            <DetailRow
              label={t("userManagement.fullName")}
              value={displayUser.fullname || displayUser.fullName}
            />
            <DetailRow
              label={t("userManagement.email")}
              value={displayUser.email}
            />
            <DetailRow
              label={t("userManagement.role")}
              value={
                displayUser.role
                  ? t(`common:roles.${displayUser.role.toLowerCase()}`)
                  : "—"
              }
              badge
              badgeColor={getRoleBadgeColor(displayUser.role)}
            />
            <DetailRow
              label={t("userManagement.status")}
              value={
                displayUser.status
                  ? t(`common:userStatuses.${displayUser.status.toLowerCase()}`)
                  : "—"
              }
              badge
              badgeColor={getStatusBadgeColor(displayUser.status)}
            />
          </div>
        </div>

        {/* Additional Information */}
        {(displayUser.createdAt ||
          displayUser.updatedAt ||
          displayUser.lastLogin) && (
          <div className="bg-white rounded-lg mt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              {t("userManagement.additionalInformation")}
            </h3>
            <div className="space-y-0">
              {displayUser.createdAt && (
                <DetailRow
                  label={t("userManagement.createdAt")}
                  value={formatDateTime(displayUser.createdAt)}
                />
              )}
              {displayUser.updatedAt && (
                <DetailRow
                  label={t("userManagement.updatedAt")}
                  value={formatDateTime(displayUser.updatedAt)}
                />
              )}
              {displayUser.lastLogin && (
                <DetailRow
                  label={t("userManagement.lastLogin")}
                  value={formatDateTime(displayUser.lastLogin)}
                />
              )}
            </div>
          </div>
        )}

        {/* Profile-specific Information */}
        {(displayUser.schoolId ||
          displayUser.grade ||
          displayUser.phoneNumber) && (
          <div className="bg-white rounded-lg mt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              {t("userManagement.profileInformation")}
            </h3>
            <div className="space-y-0">
              {displayUser.schoolId && (
                <DetailRow
                  label={t("userManagement.schoolId")}
                  value={displayUser.schoolId}
                />
              )}
              {displayUser.grade && (
                <DetailRow
                  label={t("userManagement.grade")}
                  value={displayUser.grade}
                />
              )}
              {displayUser.phoneNumber && (
                <DetailRow
                  label={t("userManagement.phoneNumber")}
                  value={displayUser.phoneNumber}
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
