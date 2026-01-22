import React from "react"
import { useTranslation } from "react-i18next"
import { Trophy } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import ExpandableCard from "@/shared/components/ExpandableCard"

const ContestHighlightCard = ({ title, contestData }) => {
  const { t } = useTranslation(["pages", "common", "dashboard"])

  // Helper function for safe display with suffix support
  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val}${text}`
  }

  // Suffix functions for singular/plural with translation support
  const studentsSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.student")
      : t("dashboard:suffixes.students")
  const teamsSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.team")
      : t("dashboard:suffixes.teams")
  const appealsSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.appeal")
      : t("dashboard:suffixes.appeals")
  const certificatesSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.certificate")
      : t("dashboard:suffixes.certificates")

  if (!contestData) {
    return (
      <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
        {t("common.noData", "No data available")}
      </div>
    )
  }

  const headerContent = (
    <div className="w-full">
      {/* Title and Percentage - justified between */}
      <div className="flex justify-between items-end mb-1">
        <div className="text-body-1">{title}</div>
        <div className="flex items-center gap-2 text-caption-1">
          <span className="text-[#7A7574]">
            {t("dashboard:overview.contestProgress", "Contest Progress")}:
          </span>
          <span>{contestData.progressPercentage || 0}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-[#ff6b35] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${contestData.progressPercentage || 0}%` }}
        />
      </div>
    </div>
  )

  return (
    <ExpandableCard icon={<Trophy size={20} />} header={headerContent}>
      <DetailTable
        data={[
          // Contest Info
          {
            label: t("dashboard:overview.contestName", "Contest name"),
            value: contestData.contestName,
          },
          {
            label: t("dashboard:overview.status", "Status"),
            value: <StatusBadge status={contestData.status} translate={true} />,
          },
          {
            label: t("dashboard:overview.progress", "Progress"),
            value: `${contestData.progressPercentage || 0}%`,
          },
          { spacer: true },

          // Participation Stats
          {
            label: t("dashboard:overview.totalStudents", "Total students"),
            value: safe(contestData.totalStudents, studentsSuffix),
          },
          {
            label: t("dashboard:overview.totalTeams", "Total teams"),
            value: safe(contestData.totalTeams, teamsSuffix),
          },
          { spacer: true },

          // Team Status Breakdown
          {
            label: t("dashboard:overview.activeTeams", "Active teams"),
            value: safe(
              contestData.teamStatusBreakdown?.activeTeams,
              teamsSuffix,
            ),
          },
          {
            label: t("dashboard:overview.eliminatedTeams", "Eliminated teams"),
            value: safe(
              contestData.teamStatusBreakdown?.eliminatedTeams,
              teamsSuffix,
            ),
          },
          {
            label: t(
              "dashboard:overview.disqualifiedTeams",
              "Disqualified teams",
            ),
            value: safe(
              contestData.teamStatusBreakdown?.disqualifiedTeams,
              teamsSuffix,
            ),
          },
          { spacer: true },

          // Appeals & Certificates
          {
            label: t("dashboard:overview.totalAppeals", "Total appeals"),
            value: safe(contestData.totalAppeals, appealsSuffix),
          },
          {
            label: t(
              "dashboard:overview.certificatesIssued",
              "Certificates issued",
            ),
            value: safe(contestData.certificatesIssued, certificatesSuffix),
          },
          { spacer: true },

          // Registration Period
          {
            label: t(
              "dashboard:overview.registrationStart",
              "Registration start",
            ),
            value: formatDateTime(contestData.registrationStart),
          },
          {
            label: t("dashboard:overview.registrationEnd", "Registration end"),
            value: formatDateTime(contestData.registrationEnd),
          },
          // Contest Period
          {
            label: t("dashboard:overview.contestStart", "Contest start"),
            value: formatDateTime(contestData.contestStart),
          },
          {
            label: t("dashboard:overview.contestEnd", "Contest end"),
            value: formatDateTime(contestData.contestEnd),
          },
        ]}
        labelWidth="180px"
      />
    </ExpandableCard>
  )
}

export default ContestHighlightCard
