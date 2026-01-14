import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

const ContestStatusPieChart = ({ metrics }) => {
  const { t } = useTranslation(["pages", "common"])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150)
    return () => clearTimeout(timer)
  }, [])

  // Prepare data for contest status pie chart
  const contestStatusData = [
    {
      name: t("dashboard.overview.activeContests", "Active"),
      value: metrics?.activeContests || 0,
      color: "#22C55E", // green
    },
    {
      name: t("dashboard.overview.completedContests", "Completed"),
      value: metrics?.completedContests || 0,
      color: "#3B82F6", // blue
    },
    {
      name: t("dashboard.overview.draftContests", "Draft"),
      value: metrics?.draftContests || 0,
      color: "#94A3B8", // gray
    },
  ].filter((item) => item.value > 0)

  if (contestStatusData.length === 0) return null

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
      <div
        className="h-[300px] w-full relative"
        style={{ width: "100%", height: 300, minHeight: 300 }}
      >
        {isReady && (
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <PieChart>
              <Pie
                data={contestStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
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
    </div>
  )
}

export default ContestStatusPieChart
