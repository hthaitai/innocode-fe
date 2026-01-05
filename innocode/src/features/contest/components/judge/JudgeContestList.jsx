import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "../../../../shared/utils/dateTime"
import { ChevronRight } from "lucide-react"

const JudgeContestList = ({ contests, onContestClick }) => {
  return (
    <ul className="space-y-1">
      {contests.map((contest) => (
        <div
          key={contest.contestId}
          className="cursor-pointer border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex gap-5 justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors"
          onClick={() => onContestClick(contest.contestId)}
        >
          <div className="flex gap-5 items-center flex-1 overflow-hidden">
            <div className="w-[24px] h-[24px] flex-shrink-0 rounded overflow-hidden">
              <img
                src={
                  contest.imgUrl ||
                  contest.detailImage ||
                  contest.bannerCheck ||
                  "https://placehold.co/24x24?text=C"
                }
                alt={contest.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-[20px]">{contest.name}</p>
              <div className="flex items-center gap-[10px] text-[12px] leading-[16px] text-[#7A7574]">
                <span className="flex-shrink-0">
                  {formatDateTime(contest.start || contest.startDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusBadge status={contest.status} translate={true} />
            <ChevronRight size={20} className="text-[#7A7574]" />
          </div>
        </div>
      ))}
    </ul>
  )
}

export default JudgeContestList
