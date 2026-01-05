import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "../../../../shared/utils/dateTime"
import { ChevronRight, Calendar } from "lucide-react"
import { useTranslation } from "react-i18next"

const JudgeRoundList = ({ rounds, onRoundClick }) => {
  const { t } = useTranslation("judge")

  return (
    <ul className="space-y-1">
      {rounds.map((round) => (
        <div
          key={round.roundId}
          className="cursor-pointer border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex gap-5 justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors"
          onClick={() => onRoundClick(round.roundId)}
        >
          <div className="flex gap-5 items-center flex-1 overflow-hidden">
            <div className="w-[24px] h-[24px] flex-shrink-0 flex items-center justify-center bg-gray-100 rounded text-gray-500">
              <Calendar size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-[20px]">{round.name}</p>
              <div className="flex items-center gap-[10px] text-[12px] leading-[16px] text-[#7A7574]">
                <span className="flex-shrink-0">
                  {formatDateTime(round.start)}
                </span>
                {/* <span>|</span>
                <span className="truncate">
                  {t(`round.types.${round.problemType}`, {
                    defaultValue: round.problemType,
                  })}
                </span> */}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusBadge status={round.status} translate={true} />
            <ChevronRight size={20} className="text-[#7A7574]" />
          </div>
        </div>
      ))}
    </ul>
  )
}

export default JudgeRoundList
