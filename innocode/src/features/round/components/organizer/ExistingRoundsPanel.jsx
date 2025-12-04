import React from "react"
import { Calendar } from "lucide-react"
import { formatDateTime, toDatetimeLocal } from "@/shared/utils/dateTime"

const ExistingRoundsPanel = ({ rounds }) => {
  if (!rounds || rounds.length === 0) {
    return (
      <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
        No rounds created yet.
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      {rounds.map((round) => (
        <li
          key={round.roundId}
          className="flex gap-5 items-center min-h-[70px] border border-[#E5E5E5] rounded-[5px] bg-white px-5"
        >
          <Calendar size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              {round.name ?? "Untitled Round"}
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              {formatDateTime(round.start)} -{" "}
              {formatDateTime(round.end)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ExistingRoundsPanel
