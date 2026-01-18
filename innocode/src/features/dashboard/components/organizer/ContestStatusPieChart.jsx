import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const ContestStatusPieChart = ({ metrics }) => {
  const { t } = useTranslation(["dashboard", "common"])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150)
    return () => clearTimeout(timer)
  }, [])

  // Prepare data for contest status pie chart
  const contestStatusData = [
    {
      name: t("overview.activeContests", "Active contests"),
      value: metrics?.activeContests || 0,
      color: "#22C55E", // green
    },
    {
      name: t("overview.completedContests", "Completed contests"),
      value: metrics?.completedContests || 0,
      color: "#3B82F6", // blue
    },
    {
      name: t("overview.draftContests", "Draft contests"),
      value: metrics?.draftContests || 0,
      color: "#94A3B8", // gray
    },
  ].filter((item) => item.value > 0)

  if (contestStatusData.length === 0) return null

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5 flex justify-center items-center">
      <div className="flex items-center gap-5">
        {/* Pie Chart */}
        <div className="flex-shrink-0" style={{ width: 300, height: 300 }}>
          {isReady && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contestStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {contestStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1">
          {contestStatusData.map((entry, index) => (
            <div key={index} className="flex items-center gap-5">
              <div
                className="w-5 h-5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <div className="flex-1">
                <div className="text-body-1">{entry.name}</div>
                <div className="text-caption-1 text-[#7A7574]">
                  {entry.value}{" "}
                  {entry.value === 1
                    ? t("chart.contest", "contest")
                    : t("chart.contests", "contests")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContestStatusPieChart
