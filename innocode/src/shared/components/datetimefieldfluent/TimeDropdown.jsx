import React from "react"
import DropdownFluent from "../DropdownFluent"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

const TimeDropdown = ({ selectedDate, setSelectedDate }) => {
  const { t } = useTranslation()
  const currentDate = selectedDate || dayjs()

  // 24-hour options
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    return { value: i, label: i.toString().padStart(2, "0") }
  })

  // Minute options
  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }))

  // Determine current hour in 24-hour format
  const currentHour24 = currentDate.hour()

  // Handlers
  const handleHourChange = (hour) => {
    setSelectedDate(currentDate.hour(hour))
  }

  const handleMinuteChange = (minute) => {
    setSelectedDate(currentDate.minute(minute))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Hour Picker */}
      <div className="flex items-center gap-2">
        <div className="max-w-[130px]">
          <DropdownFluent
            options={hourOptions}
            value={currentHour24}
            onChange={handleHourChange}
            placeholder="HH"
          />
        </div>
        <span className="text-sm">{t("common.hour")}</span>
      </div>

      {/* Minute Picker */}
      <div className="flex items-center gap-2">
        <div className="max-w-[130px]">
          <DropdownFluent
            options={minuteOptions}
            value={currentDate.minute()}
            onChange={handleMinuteChange}
            placeholder="MM"
          />
        </div>
        <span className="text-sm">{t("common.minute")}</span>
      </div>
    </div>
  )
}

export default TimeDropdown
