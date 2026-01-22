import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  School,
  MapPin,
  UsersRound,
  Trophy,
  GraduationCap,
  Map,
} from "lucide-react"
import { useGetSchoolMetricsQuery } from "@/services/dashboardApi"
import { useDashboardSignalR } from "@/shared/hooks/useDashboardSignalR"
import { TimeRangePredefined } from "./TimeRangeFilter"
import DashboardTimeRangeFilter from "@/features/dashboard/components/organizer/DashboardTimeRangeFilter"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"
import "@/styles/typography.css"

const SchoolMetricTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Filter state
  const [timeRange, setTimeRange] = useState(TimeRangePredefined.AllTime)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150)
    return () => clearTimeout(timer)
  }, [])

  // Fetch data
  const {
    data: schoolData,
    isLoading,
    error,
    refetch,
  } = useGetSchoolMetricsQuery({
    topSchoolCount: 5,
    timeRangePredefined: timeRange,
    startDate: timeRange === TimeRangePredefined.Custom ? startDate : undefined,
    endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
  })

  // SignalR Handler
  const handleSignalRUpdate = () => {
    refetch()
  }

  const { isConnected } = useDashboardSignalR(handleSignalRUpdate)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-body-1 text-gray-500 animate-pulse">
          {t("common.loading", "Loading school metrics...")}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-body-1 text-red-500">
          {t("common.error", "Failed to load school metrics")}
        </div>
      </div>
    )
  }

  // Transform province data for horizontal bar chart
  const provinceChartData = schoolData?.teamsByProvince
    ? Object.entries(schoolData.teamsByProvince)
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort((a, b) => b.value - a.value)
    : []

  return (
    <div className="space-y-6">
      {/* Filters & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardTimeRangeFilter
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
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

      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <Map className="w-5 h-5 text-gray-700" />
          <h2 className="text-subtitle-1 text-gray-800 uppercase tracking-wider">
            {t("dashboard.schoolMetric.regionalInsights")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Metrics & Top Schools */}
          <div className="lg:col-span-5 space-y-6">
            {/* Total Schools Card */}
            <div className="bg-white border border-gray-200 rounded-[5px] p-5 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[5px] bg-blue-50 flex items-center justify-center shrink-0">
                  <School className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-caption-1 text-gray-500 font-medium italic mb-1">
                    {t("dashboard.schoolMetric.totalSchools")}
                  </p>
                  <p className="text-title-1 text-gray-800 leading-none">
                    {schoolData?.totalSchools || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Top 5 Schools List */}
            <div className="bg-white border border-gray-200 rounded-[5px] p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-orange-500" />
                <h3 className="text-caption-1-strong text-gray-800">
                  {t("dashboard.schoolMetric.top5Schools")}
                </h3>
              </div>

              <div className="space-y-3">
                {schoolData?.topSchoolsByParticipation?.map((school, index) => (
                  <div
                    key={school.schoolId}
                    className="flex items-center justify-between p-3 rounded-[5px] bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-100 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-caption-1-strong text-gray-400 shrink-0 group-hover:text-blue-500 group-hover:border-blue-200">
                        {index + 1}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-body-2-strong text-gray-800">
                          {school.schoolName}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{school.provinceName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-gray-400 italic">
                        {t("dashboard.schoolMetric.totalTeams")}{" "}
                        {school.totalTeams}
                      </div>
                      <div className="text-[10px] text-gray-400 italic">
                        {t("dashboard.schoolMetric.totalStudents")}{" "}
                        {school.totalStudents}
                      </div>
                      <div className="text-[10px] text-gray-400 italic">
                        {t("dashboard.schoolMetric.totalCertificates")}{" "}
                        {school.totalCertificates}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Geographic Distribution */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded-[5px] p-5 h-full min-h-[400px] relative">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-blue-500" />
                <h3 className="text-caption-1-strong text-gray-800">
                  {t("dashboard.schoolMetric.teamsByProvince")}
                </h3>
              </div>

              <div className="h-[450px] w-full">
                {isReady && (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={0}
                    minHeight={0}
                    debounce={50}
                  >
                    <BarChart
                      layout="vertical"
                      data={provinceChartData}
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={true}
                        stroke="#CBD5E1"
                      />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11,
                          fill: "#64748B",
                          fontWeight: 500,
                        }}
                        width={100}
                      />
                      <Tooltip
                        cursor={false}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-[5px] shadow-lg">
                                <p className="text-caption-1-strong text-gray-800">
                                  {payload[0].payload.name}
                                </p>
                                <p className="text-caption-1 text-blue-600 font-bold">
                                  {payload[0].value}{" "}
                                  {t("dashboard.schoolMetric.totalTeams")}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#3B82F6"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                        activeBar={{ fillOpacity: 0.8 }}
                      >
                        {provinceChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "#2563EB"
                                : index === 1
                                  ? "#3B82F6"
                                  : index === 2
                                    ? "#60A5FA"
                                    : "#93C5FD"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-4 flex justify-center items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                  <span className="text-[10px] text-gray-500">Top 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                  <span className="text-[10px] text-gray-500">Others</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchoolMetricTab
