import React from "react"
import DropdownFluent from "../DropdownFluent"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

const TimeDropdown = ({ selectedDate, setSelectedDate }) => {
  const { t } = useTranslation()
  const currentDate = selectedDate || dayjs()

  // 12-hour options
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1
    return { value: hour, label: hour.toString().padStart(2, "0") }
  })

  // Minute options
  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }))

  // AM/PM options
  const amPmOptions = [
    { value: "AM", label: t("common.am") },
    { value: "PM", label: t("common.pm") },
  ]

  // Determine current hour in 12-hour format
  const currentHour24 = currentDate.hour()
  const currentAmPm = currentHour24 >= 12 ? "PM" : "AM"
  const currentHour12 = currentHour24 % 12 === 0 ? 12 : currentHour24 % 12

  // Handlers
  const handleHourChange = (hour12) => {
    let newHour = hour12 % 12
    if (currentAmPm === "PM") newHour += 12
    setSelectedDate(currentDate.hour(newHour))
  }

  const handleMinuteChange = (minute) => {
    setSelectedDate(currentDate.minute(minute))
  }

  const handleAmPmChange = (ampm) => {
    let newHour = currentDate.hour()
    if (ampm === "AM" && newHour >= 12) newHour -= 12
    if (ampm === "PM" && newHour < 12) newHour += 12
    setSelectedDate(currentDate.hour(newHour))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Hour Picker */}
      <div className="flex items-center gap-2">
        <div className="max-w-[130px]">
          <DropdownFluent
            options={hourOptions}
            value={currentHour12}
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

      {/* AM/PM Picker */}
      <div className="flex items-center gap-2">
        <div className="max-w-[130px]">
          <DropdownFluent
            options={amPmOptions}
            value={currentAmPm}
            onChange={handleAmPmChange}
            placeholder="AM/PM"
          />
        </div>
        <span className="text-sm">{t("common.amPm")}</span>
      </div>
    </div>
  )
}

export default TimeDropdown
