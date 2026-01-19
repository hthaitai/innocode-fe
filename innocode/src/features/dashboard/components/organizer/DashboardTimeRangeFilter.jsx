import React from "react"
import { useTranslation } from "react-i18next"
import DropdownFluent from "@/shared/components/DropdownFluent"
import DateFieldFluent from "@/shared/components/DateFieldFluent"
import { TimeRangePredefined } from "@/features/common/dashboard/TimeRangeFilter"

const DashboardTimeRangeFilter = ({
  timeRange,
  setTimeRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const { t } = useTranslation(["pages", "common"])

  const timeRangeOptions = [
    {
      value: TimeRangePredefined.AllTime,
      label: t("dashboard.timeRange.allTime", "All time"),
    },
    {
      value: TimeRangePredefined.CurrentMonth,
      label: t("dashboard.timeRange.currentMonth", "Current month"),
    },
    {
      value: TimeRangePredefined.Last3Months,
      label: t("dashboard.timeRange.last3Months", "Last 3 months"),
    },
    {
      value: TimeRangePredefined.Last6Months,
      label: t("dashboard.timeRange.last6Months", "Last 6 months"),
    },
    {
      value: TimeRangePredefined.CurrentYear,
      label: t("dashboard.timeRange.currentYear", "Current year"),
    },
    {
      value: TimeRangePredefined.Custom,
      label: t("dashboard.timeRange.custom", "Custom"),
    },
  ]

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange)
    // Reset dates when switching away from Custom
    if (newRange !== TimeRangePredefined.Custom) {
      setStartDate("")
      setEndDate("")
    }
  }

  return (
    <div className="flex gap-4 justify-end">
      {/* Custom Date Range Inputs */}
      {timeRange === TimeRangePredefined.Custom && (
        <div className="flex gap-4">
          <div className="min-w-[130px] w-max">
            <DateFieldFluent
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="min-w-[130px] w-max">
            <DateFieldFluent
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="min-w-[130px] w-max">
        <DropdownFluent
          options={timeRangeOptions}
          value={timeRange}
          onChange={handleTimeRangeChange}
          placeholder={t(
            "dashboard.timeRange.selectRange",
            "Select time range",
          )}
        />
      </div>
    </div>
  )
}

export default DashboardTimeRangeFilter
