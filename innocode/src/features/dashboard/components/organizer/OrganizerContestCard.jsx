import React from "react"
import { useTranslation } from "react-i18next"
import { Trophy } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import DetailTable from "@/shared/components/DetailTable"
import ExpandableCard from "@/shared/components/ExpandableCard"
import { formatDateTime } from "@/shared/utils/dateTime"

const OrganizerContestCard = ({ contest }) => {
  const { t } = useTranslation(["pages", "common", "dashboard"])

  // Helper function for safe display with suffix support
  const safe = (val, suffix = "") => {
    if (val === null || val === undefined || val === "") return "—"
    const text = typeof suffix === "function" ? suffix(val) : suffix
    return `${val} ${text}`
  }

  // Suffix functions
  const studentsSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.student", "student")
      : t("dashboard:suffixes.students", "students")
  const teamsSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.team", "team")
      : t("dashboard:suffixes.teams", "teams")
  const appealsSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.appeal", "appeal")
      : t("dashboard:suffixes.appeals", "appeals")
  const certificatesSuffix = (val) =>
    Number(val) === 1
      ? t("dashboard:suffixes.certificate", "certificate")
      : t("dashboard:suffixes.certificates", "certificates")

  const headerContent = (
    <div className="w-full">
      {/* Title and Percentage - justified between */}
      <div className="flex justify-between items-end mb-1">
        <div className="text-body-1">
          {contest.name || contest.contestName || "-"}
        </div>
        <div className="text-caption-1">{contest.progressPercentage || 0}%</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-[#ff6b35] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${contest.progressPercentage || 0}%` }}
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
            label: t("dashboard:overview.status", "Status"),
            value: <StatusBadge status={contest.status} translate={true} />,
          },
          { spacer: true },

          // Participation Stats
          {
            label: t("dashboard:overview.totalStudents", "Total students"),
            value: safe(contest.totalStudents, studentsSuffix),
          },
          {
            label: t("dashboard:overview.totalTeams", "Total teams"),
            value: safe(contest.totalTeams, teamsSuffix),
          },
          { spacer: true },

          // Team Status Breakdown
          {
            label: t("dashboard:overview.activeTeams", "Active teams"),
            value: safe(contest.teamStatusBreakdown?.activeTeams, teamsSuffix),
          },
          {
            label: t("dashboard:overview.eliminatedTeams", "Eliminated teams"),
            value: safe(
              contest.teamStatusBreakdown?.eliminatedTeams,
              teamsSuffix,
            ),
          },
          {
            label: t(
              "dashboard:overview.disqualifiedTeams",
              "Disqualified teams",
            ),
            value: safe(
              contest.teamStatusBreakdown?.disqualifiedTeams,
              teamsSuffix,
            ),
          },
          { spacer: true },

          // Appeals & Certificates
          {
            label: t("dashboard:overview.totalAppeals", "Total appeals"),
            value: safe(contest.totalAppeals, appealsSuffix),
          },
          {
            label: t(
              "dashboard:overview.certificatesIssued",
              "Certificates issued",
            ),
            value: safe(contest.certificatesIssued, certificatesSuffix),
          },
          { spacer: true },

          // Registration Period
          {
            label: t(
              "dashboard:overview.registrationStart",
              "Registration start",
            ),
            value: formatDateTime(contest.registrationStart),
          },
          {
            label: t("dashboard:overview.registrationEnd", "Registration end"),
            value: formatDateTime(contest.registrationEnd),
          },

          // Contest Period
          {
            label: t("dashboard:overview.contestStart", "Contest start"),
            value: formatDateTime(contest.contestStart),
          },
          {
            label: t("dashboard:overview.contestEnd", "Contest end"),
            value: formatDateTime(contest.contestEnd),
          },
        ]}
        labelWidth="180px"
      />
    </ExpandableCard>
  )
}

export default OrganizerContestCard
