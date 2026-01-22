import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Users } from "lucide-react"
import toast from "react-hot-toast"
import BaseModal from "@/shared/components/BaseModal"
import { useGetContestJudgesQuery } from "@/services/contestJudgeApi"
import { useTransferSubmissionsMutation } from "@/services/submissionApi"
import { Spinner } from "@/shared/components/SpinnerFluent"

const TransferSubmissionsModal = ({ isOpen, onClose, contestId, roundId }) => {
  const { t } = useTranslation(["round", "judge"])
  const [selectedJudgeId, setSelectedJudgeId] = useState("")

  const {
    data: judgesData,
    isLoading,
    isError,
  } = useGetContestJudgesQuery(contestId)

  const [transferSubmissions, { isLoading: isTransferring }] =
    useTransferSubmissionsMutation()

  const judges = judgesData?.data || []

  const handleTransfer = async () => {
    if (!selectedJudgeId) {
      toast.error(t("round:transfer.selectJudge"))
      return
    }

    try {
      await transferSubmissions({ roundId, judgeId: selectedJudgeId }).unwrap()
      toast.success(t("round:transfer.success"))
      setSelectedJudgeId("")
      onClose()
    } catch (error) {
      console.error("Transfer error:", error)
      toast.error(error?.data?.message || t("round:transfer.error"))
    }
  }

  const handleClose = () => {
    setSelectedJudgeId("")
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("round:transfer.title")}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" className="button-white" onClick={handleClose}>
            {t("common:buttons.cancel")}
          </button>
          <button
            type="button"
            className={isTransferring ? "button-gray" : "button-orange"}
            onClick={handleTransfer}
            disabled={!selectedJudgeId || isTransferring}
          >
            {isTransferring
              ? t("round:transfer.transferring")
              : t("round:transfer.transferButton")}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto text-sm leading-5">
        <p className="text-[#7A7574] mb-2">{t("round:transfer.description")}</p>

        {isLoading && <Spinner />}

        {isError && (
          <p className="text-red-500 text-center">
            {t("common:common.failedToLoadItem", { item: "judges" })}
          </p>
        )}

        {!isLoading && !isError && judges.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {t("judge:noJudgesAvailable.title")}
            </h3>
            <p className="text-xs text-[#7A7574] max-w-sm">
              {t("judge:noJudgesAvailable.description")}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {!isLoading &&
            !isError &&
            judges.map((judge) => {
              const isSelected = selectedJudgeId === judge.userId
              return (
                <div
                  key={judge.userId}
                  className={`flex justify-between items-center min-h-[70px] px-5 rounded-[5px] cursor-pointer transition-colors ${
                    isSelected ? "bg-[#F6F6F6]" : "hover:bg-[#F6F6F6]"
                  }`}
                  onClick={() => setSelectedJudgeId(judge.userId)}
                >
                  <div className="flex gap-5 items-center">
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelectedJudgeId(judge.userId)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-[#E05307] accent-[#E05307]"
                    />

                    <div className="flex flex-col">
                      <span className={isSelected ? "" : "text-black"}>
                        {judge.fullName}
                      </span>
                      <span className="text-xs leading-4 text-[#7A7574]">
                        {judge.email}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </BaseModal>
  )
}

export default TransferSubmissionsModal
