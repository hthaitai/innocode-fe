import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Trophy,
  Medal,
  Award,
  User,
  GraduationCap,
  School,
  Briefcase,
} from "lucide-react"
import { useGetTopPerformersQuery } from "@/services/dashboardApi"
import { useDashboardSignalR } from "@/shared/hooks/useDashboardSignalR"
import TimeRangeFilter, { TimeRangePredefined } from "./TimeRangeFilter"
import toast from "react-hot-toast"
import "@/styles/typography.css"

const TopPerformanceTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Filter state
  const [timeRange, setTimeRange] = useState(TimeRangePredefined.AllTime)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Fetch data
  const {
    data: topPerformers,
    isLoading,
    error,
    refetch,
  } = useGetTopPerformersQuery({
    topCount: 5, // Requesting top 5 for better table display
    timeRangePredefined: timeRange,
    startDate: timeRange === TimeRangePredefined.Custom ? startDate : undefined,
    endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
  })

  // SignalR Handler
  const handleSignalRUpdate = (eventName, data) => {
    refetch()

    // Optional: show toast for specific performance-related signalr events if they exist
    // Based on previous step, we have: ContestCreated, TeamRegistered, ContestStatusChanged, CertificateIssued
    if (eventName === "CertificateIssued") {
      toast.success(
        data?.Message || t("dashboard.notifications.certificateIssued"),
        { icon: "🏅" }
      )
    }
  }

  const { isConnected } = useDashboardSignalR(handleSignalRUpdate)

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange)
    if (newRange !== TimeRangePredefined.Custom) {
      setStartDate("")
      setEndDate("")
    }
  }

  const handleDateChange = (field, value) => {
    if (field === "startDate") {
      setStartDate(value)
    } else {
      setEndDate(value)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-caption-1-strong text-gray-400">
            #{rank}
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-body-1 text-gray-500 animate-pulse">
          {t("common.loading", "Loading rankings...")}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-body-1 text-red-500">
          {t("common.error", "Failed to load rankings")}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TimeRangeFilter
          selectedRange={timeRange}
          onRangeChange={handleTimeRangeChange}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-[5px]">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          />
          <span className="text-caption-1 text-gray-600">
            {isConnected
              ? t("dashboard.status.live", "Live Updates")
              : t("dashboard.status.offline", "Offline")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Top Students Section */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-subtitle-1 text-gray-800">
              {t("dashboard.topPerformance.topStudents")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 italic">
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium w-20">
                    {t("dashboard.topPerformance.rank")}
                  </th>
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.studentName")}
                  </th>
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.school")}
                  </th>
                  <th className="text-center py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.individualCertificates")}
                  </th>
                  <th className="text-center py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.teamCertificates")}
                  </th>
                  <th className="text-right py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.totalCertificates")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topPerformers?.topStudents?.map((student, index) => (
                  <tr
                    key={student.studentId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-5 px-4">{getRankIcon(index + 1)}</td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <span className="text-body-2-strong text-gray-800">
                          {student.fullName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {student.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <School className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-body-2 text-gray-600 max-w-[200px]">
                          {student.schoolName}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center text-body-2 text-gray-600">
                      {student.individualCertificatesCount}
                    </td>
                    <td className="py-5 px-4 text-center text-body-2 text-gray-600">
                      {student.teamCertificatesCount}
                    </td>
                    <td className="py-5 px-4 text-right">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-caption-1-strong">
                        {student.totalCertificates}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Mentors Section */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <User className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-subtitle-1 text-gray-800">
              {t("dashboard.topPerformance.topMentors")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 italic">
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium w-20">
                    {t("dashboard.topPerformance.rank")}
                  </th>
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.mentorName")}
                  </th>
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.school")}
                  </th>
                  <th className="text-center py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.teamsManaged")}
                  </th>
                  <th className="text-right py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.teamCertificates")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topPerformers?.topMentors?.map((mentor, index) => (
                  <tr
                    key={mentor.mentorId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-5 px-4">{getRankIcon(index + 1)}</td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <span className="text-body-2-strong text-gray-800">
                          {mentor.fullName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {mentor.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <School className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-body-2 text-gray-600 max-w-[200px]">
                          {mentor.schoolName}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center text-body-2 text-gray-600">
                      {mentor.teamsManaged}
                    </td>
                    <td className="py-5 px-4 text-right">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-caption-1-strong">
                        {mentor.teamCertificatesCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Organizers Section */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-subtitle-1 text-gray-800">
              {t("dashboard.topPerformance.topOrganizers")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 italic">
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium w-20">
                    {t("dashboard.topPerformance.rank")}
                  </th>
                  <th className="text-left py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.organizerName")}
                  </th>
                  <th className="text-center py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.completedContests")}
                  </th>
                  <th className="text-right py-4 px-4 text-caption-1 text-gray-500 font-medium">
                    {t("dashboard.topPerformance.totalTeams")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topPerformers?.topOrganizers?.map((organizer, index) => (
                  <tr
                    key={organizer.userId}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-5 px-4">{getRankIcon(index + 1)}</td>
                    <td className="py-5 px-4">
                      <div className="flex flex-col">
                        <span className="text-body-2-strong text-gray-800">
                          {organizer.fullName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {organizer.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center text-body-2 text-gray-600">
                      {organizer.completedContestsCount}
                    </td>
                    <td className="py-5 px-4 text-right">
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-caption-1-strong">
                        {organizer.totalTeamsInContests}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopPerformanceTab
