import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, ChevronRight, ListPlus } from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"
import { Spinner } from "@/shared/components/SpinnerFluent"
import { useGetRoundsByContestIdQuery } from "@/services/roundApi"
import { toDatetimeLocal } from "../../../../shared/utils/dateTime"
import RoundsList from "../../../round/components/organizer/RoundsList"
import { useTranslation } from "react-i18next"

const ManageRounds = ({ contestId }) => {
  const navigate = useNavigate()
  const { t } = useTranslation("pages")

  const {
    data: roundsData,
    isLoading,
    error,
  } = useGetRoundsByContestIdQuery(contestId)

  const rounds = roundsData?.data ?? []

  const handleAddRound = useCallback(() => {
    // Navigate to dedicated add round page instead of opening modal
    navigate(`/organizer/contests/${contestId}/rounds/new`)
  }, [contestId, navigate])

  return (
    <div className="space-y-1">
      {/* Add Round Section */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <ListPlus size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              {t("organizerContestDetail.rounds.title")}
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              {t("organizerContestDetail.rounds.subtitle")}
            </p>
          </div>
        </div>
        <button className="button-orange" onClick={handleAddRound}>
          {t("organizerContestDetail.rounds.add")}
        </button>
      </div>

      {/* Round List */}
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[70px]">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">
            {t("organizerContestDetail.rounds.error")}
          </p>
        ) : rounds.length === 0 ? (
          <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
            {t("organizerContestDetail.rounds.empty")}
          </div>
        ) : (
          <RoundsList rounds={rounds} contestId={contestId} />
        )}
      </div>
    </div>
  )
}

export default ManageRounds
