import React from "react"
import { useTranslation } from "react-i18next"
import { Calendar } from "lucide-react"

// Time Range Predefined Enum - Using string values to match backend API
export const TimeRangePredefined = {
  AllTime: "AllTime",
  CurrentMonth: "CurrentMonth",
  Last3Months: "Last3Months",
  Last6Months: "Last6Months",
  CurrentYear: "CurrentYear",
  Custom: "Custom",
}

const TimeRangeFilter = ({
  selectedRange,
  onRangeChange,
  startDate,
  endDate,
  onDateChange,
}) => {
  const { t } = useTranslation(["pages"])

  const timeRangeOptions = [
    {
      value: TimeRangePredefined.AllTime,
      label: t("dashboard.timeRange.allTime", "All Time"),
    },
    {
      value: TimeRangePredefined.CurrentMonth,
      label: t("dashboard.timeRange.currentMonth", "Current Month"),
    },
    {
      value: TimeRangePredefined.Last3Months,
      label: t("dashboard.timeRange.last3Months", "Last 3 Months"),
    },
    {
      value: TimeRangePredefined.Last6Months,
      label: t("dashboard.timeRange.last6Months", "Last 6 Months"),
    },
    {
      value: TimeRangePredefined.CurrentYear,
      label: t("dashboard.timeRange.currentYear", "Current Year"),
    },
    {
      value: TimeRangePredefined.Custom,
      label: t("dashboard.timeRange.custom", "Custom"),
    },
  ]

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <span className="text-caption-1-strong text-gray-800">
            {t("dashboard.timeRange.title", "Time Range")}
          </span>
        </div>

        {/* Time Range Buttons */}
        <div className="flex flex-wrap gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onRangeChange(option.value)}
              className={`px-3 py-1.5 rounded-[5px] text-caption-2 font-medium transition-all border ${
                selectedRange === option.value
                  ? "bg-primary-500 border-black shadow-sm"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-black"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Inputs */}
      {selectedRange === TimeRangePredefined.Custom && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
          <div>
            <label className="block text-caption-2 text-gray-600 mb-1.5">
              {t("dashboard.timeRange.startDate", "Start Date")}
            </label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => onDateChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-caption-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-caption-2 text-gray-600 mb-1.5">
              {t("dashboard.timeRange.endDate", "End Date")}
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => onDateChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-caption-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeRangeFilter
