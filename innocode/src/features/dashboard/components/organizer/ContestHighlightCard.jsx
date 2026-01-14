import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, Flag, AlertCircle, Award } from "lucide-react"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

const ContestHighlightCard = ({ title, contestData }) => {
  const { t } = useTranslation(["pages", "common"])
  const navigate = useNavigate()

  if (!contestData) return null

  const handleCardClick = () => {
    if (contestData.contestId) {
      navigate(`/organizer/contests/${contestData.contestId}`)
    }
  }

  const StatItem = ({
    icon: Icon,
    label,
    value,
    subValue,
    colorClass,
    bgClass,
  }) => (
    <div className="bg-gray-50 rounded-lg p-3 transition-colors hover:bg-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-7 h-7 rounded-md ${bgClass} ${colorClass} flex items-center justify-center`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <div>
        <div className="text-lg font-bold text-gray-900 leading-none mb-1">
          {value || 0}
        </div>
        {subValue && (
          <div className="text-[11px] text-gray-400 font-medium">
            {subValue}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div
      className="bg-white border border-[#E5E5E5] rounded-[5px] p-5 flex flex-col group cursor-pointer hover:border-gray-300"
      onClick={handleCardClick}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1 pr-2">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {title}
            </div>
            <h3
              className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#ff6b35] transition-colors"
              title={contestData.contestName}
            >
              {contestData.contestName}
            </h3>
          </div>
          <StatusBadge status={contestData.status} translate={true} />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            {formatDateTime(contestData.contestStart)} -{" "}
            {formatDateTime(contestData.contestEnd)}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-medium text-gray-500">
            {t("dashboard.overview.progress", "Progress")}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {contestData.progressPercentage || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#ff6b35] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${contestData.progressPercentage || 0}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mt-auto">
        <StatItem
          icon={Users}
          label={t("dashboard.overview.students", "Students")}
          value={contestData.totalStudents}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />

        <StatItem
          icon={Flag}
          label={t("dashboard.overview.teams", "Teams")}
          value={contestData.totalTeams}
          subValue={
            contestData.teamStatusBreakdown?.activeTeams
              ? `${contestData.teamStatusBreakdown.activeTeams} Active`
              : null
          }
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
        />

        <StatItem
          icon={contestData.totalAppeals > 0 ? AlertCircle : Award}
          label={t("dashboard.overview.appeals", "Appeals")}
          value={contestData.totalAppeals}
          colorClass={
            contestData.totalAppeals > 0 ? "text-orange-600" : "text-green-600"
          }
          bgClass={
            contestData.totalAppeals > 0 ? "bg-orange-50" : "bg-green-50"
          }
        />
      </div>
    </div>
  )
}

export default ContestHighlightCard
