import React from "react"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"

const CalendarPicker = ({ selectedDate, setSelectedDate }) => {
  const { t } = useTranslation()
  const currentDate = selectedDate || dayjs() // default if null

  const daysInMonth = currentDate.daysInMonth()
  const firstDayOfMonth = currentDate.startOf("month").day()
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  const handleDateClick = (day) => setSelectedDate(currentDate.date(day))

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <button
          onClick={() => setSelectedDate(currentDate.subtract(1, "month"))}
          className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
        >
          &lt;
        </button>
        <span className="text-sm font-medium capitalize">
          {currentDate.format("MMMM YYYY")}
        </span>
        <button
          onClick={() => setSelectedDate(currentDate.add(1, "month"))}
          className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {[
          t("common.daysShort.su"),
          t("common.daysShort.mo"),
          t("common.daysShort.tu"),
          t("common.daysShort.we"),
          t("common.daysShort.th"),
          t("common.daysShort.fr"),
          t("common.daysShort.sa"),
        ].map((d) => (
          <div key={d} className="font-semibold">
            {d}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const isSelected = day === currentDate.date()
          return (
            <div
              key={idx}
              className={`
                p-2 rounded cursor-pointer
                transition-colors duration-200
                ${isSelected ? "bg-[#E05307] text-white" : "hover:bg-gray-100"}
              `}
              onClick={() => day && handleDateClick(day)}
            >
              {day || ""}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarPicker
