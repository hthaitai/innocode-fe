import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Trophy,
  Award,
  UsersRound,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Clock,
  School,
  Star,
  ExternalLink,
} from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetMentorDashboardQuery } from "@/services/dashboardApi"
import { useDashboardSignalR } from "@/shared/hooks/useDashboardSignalR"
import { TimeRangePredefined } from "@/features/common/dashboard/TimeRangeFilter"
import DashboardTimeRangeFilter from "@/features/dashboard/components/organizer/DashboardTimeRangeFilter"
import toast from "react-hot-toast"
import "@/styles/typography.css"
import { LoadingState } from "@/shared/components/ui/LoadingState"

const MentorDashboard = () => {
  const navigate = useNavigate()
  const { t } = useTranslation(["pages", "common", "contest"])

  // Time range state
  const [timeRange, setTimeRange] = React.useState(TimeRangePredefined.AllTime)
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useGetMentorDashboardQuery({
    timeRangePredefined: timeRange,
    startDate: timeRange === TimeRangePredefined.Custom ? startDate : undefined,
    endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
  })

  // Refetch when time range changes
  useEffect(() => {
    refetch()
  }, [timeRange, startDate, endDate, refetch])

  const handleSignalRUpdate = (eventName, data) => {
    if (eventName === "MentorDashboardUpdated" || eventName === "Reconnected") {
      refetch()
      if (eventName === "MentorDashboardUpdated") {
        toast.success(
          data?.message || t("dashboard.notifications.dashboardUpdated"),
          {
            icon: "📊",
          },
        )
      }
    }
  }

  const { isConnected } = useDashboardSignalR(handleSignalRUpdate)

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.MENTOR_DASHBOARD}
        breadcrumbPaths={BREADCRUMB_PATHS.MENTOR_DASHBOARD}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.MENTOR_DASHBOARD}
        breadcrumbPaths={BREADCRUMB_PATHS.MENTOR_DASHBOARD}
      >
        <div className="flex flex-col items-center justify-center py-12 text-red-500">
          <XCircle className="w-12 h-12 mb-4" />
          <p className="text-subtitle-1">{t("common.error_occurred")}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            {t("common.retry")}
          </button>
        </div>
      </PageContainer>
    )
  }

  const data = dashboardData || {}

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.MENTOR_DASHBOARD}
      breadcrumbPaths={BREADCRUMB_PATHS.MENTOR_DASHBOARD}
    >
      <div className="space-y-6">
        {/* Time Range Filter Section */}
        <div className="flex justify-end">
          <DashboardTimeRangeFilter
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E5E5E5] rounded-[5px] p-5">
          <div>
            <h1 className="text-title-1 text-gray-800 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-primary-500" />
              {t("pages:mentorDashboard.title", "Mentor Dashboard")}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <School className="w-4 h-4" />
              <span className="text-body-2 font-medium">{data.schoolName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-[#E5E5E5] rounded-[5px]">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-gray-300"
              }`}
            />
            <span className="text-caption-1 text-gray-600 font-medium">
              {isConnected
                ? t("pages:dashboard.status.live", "Live Updates")
                : t("pages:dashboard.status.offline", "Offline")}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={UsersRound}
            label={t("pages:mentorDashboard.stats.totalTeams", "Teams Managed")}
            value={data.totalTeamsManaged}
            color="blue"
          />
          <StatCard
            icon={Users}
            label={t(
              "pages:mentorDashboard.stats.totalStudents",
              "Students Mentored",
            )}
            value={data.totalStudentsMentored}
            color="purple"
          />
          <StatCard
            icon={Trophy}
            label={t(
              "pages:mentorDashboard.stats.contestsParticipated",
              "Contests Participated",
            )}
            value={data.contestsParticipated}
            color="orange"
          />
          <StatCard
            icon={Award}
            label={t(
              "pages:mentorDashboard.stats.totalCertificates",
              "Total Certificates",
            )}
            value={data.totalTeamCertificates}
            color="green"
          />
        </div>

        {/* Recent Certificates */}
        <div
          id="recent-certificates"
          className="bg-white border border-[#E5E5E5] rounded-[5px] overflow-hidden"
        >
          <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
            <h3 className="text-subtitle-1 text-gray-800">
              {t(
                "pages:mentorDashboard.recentCerts.title",
                "Recent Certificates",
              )}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-[#E5E5E5]">
                <tr>
                  <th className="px-5 py-3 text-caption-1-strong text-gray-600">
                    {t("pages:mentorDashboard.recentCerts.team", "Team")}
                  </th>
                  <th className="px-5 py-3 text-caption-1-strong text-gray-600">
                    {t("pages:mentorDashboard.recentCerts.contest", "Contest")}
                  </th>
                  <th className="px-5 py-3 text-caption-1-strong text-gray-600">
                    {t("pages:mentorDashboard.recentCerts.type", "Type")}
                  </th>
                  <th className="px-5 py-3 text-caption-1-strong text-gray-600">
                    {t("pages:mentorDashboard.recentCerts.date", "Issued At")}
                  </th>
                  <th className="px-5 py-3 text-caption-1-strong text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {data.recentCertificates?.length > 0 ? (
                  data.recentCertificates.map((cert) => (
                    <tr
                      key={cert.certificateId}
                      id={`cert-${cert.certificateId}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span className="text-body-2-strong text-gray-800">
                          {cert.teamName}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-body-2 text-gray-600">
                          {cert.contestName}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-caption-2 font-medium ${
                            cert.certificateType === "Team"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-purple-50 text-purple-700 border border-purple-100"
                          }`}
                        >
                          {cert.certificateType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-caption-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          className="text-primary-500 cursor-pointer hover:text-primary-600"
                          onClick={() =>
                            navigate(`/certificate?id=${cert.certificateId}`)
                          }
                        >
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      {t(
                        "pages:mentorDashboard.recentCerts.empty",
                        "No certificates issued yet.",
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
    orange: "bg-orange-50 text-orange-500",
    green: "bg-green-50 text-green-500",
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-caption-1 text-gray-500 font-medium">
          {label}
        </span>
      </div>
      <div className="text-title-2 text-gray-800">{value ?? 0}</div>
    </div>
  )
}

const StatusProgress = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-caption-1">
        <span className="text-gray-600">{label}</span>
        <span className="text-gray-800 font-bold">{value ?? 0}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  )
}

const ActivityIndicator = ({ label, count, color }) => {
  const colorMap = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    green: "border-green-200 bg-green-50 text-green-700",
  }

  return (
    <div className={`p-3 rounded-[5px] border ${colorMap[color]} text-center`}>
      <div className="text-title-2 mb-1">{count ?? 0}</div>
      <div className="text-[10px] uppercase font-bold tracking-tighter opacity-70">
        {label}
      </div>
    </div>
  )
}

export default MentorDashboard
