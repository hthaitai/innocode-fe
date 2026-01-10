import React from "react"
import { useTranslation } from "react-i18next"
import { BarChart3, PieChart, TrendingUp } from "lucide-react"

const ContestAnalyticsTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Mock data - replace with actual API calls
  const contestStats = [
    {
      label: t("dashboard.contestAnalytics.totalContests"),
      value: "156",
      icon: BarChart3,
    },
    {
      label: t("dashboard.contestAnalytics.ongoingContests"),
      value: "12",
      icon: TrendingUp,
    },
    {
      label: t("dashboard.contestAnalytics.completedContests"),
      value: "144",
      icon: PieChart,
    },
  ]

  const recentContests = [
    {
      name: "Programming Contest 2024",
      participants: 234,
      status: "Ongoing",
      endDate: "2024-01-15",
    },
    {
      name: "Algorithm Challenge",
      participants: 189,
      status: "Upcoming",
      endDate: "2024-01-20",
    },
    {
      name: "Web Development Contest",
      participants: 156,
      status: "Completed",
      endDate: "2024-01-05",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Contest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contestStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white border border-[#E5E5E5] rounded-[5px] p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Contest List */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("dashboard.contestAnalytics.recentContests")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.contestAnalytics.contestName")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.contestAnalytics.participants")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.contestAnalytics.status")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.contestAnalytics.endDate")}
                </th>
              </tr>
            </thead>
            <tbody>
              {recentContests.map((contest, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {contest.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {contest.participants}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contest.status === "Ongoing"
                          ? "bg-green-100 text-green-700"
                          : contest.status === "Upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {contest.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {contest.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ContestAnalyticsTab
