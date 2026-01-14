import { useState, useCallback } from "react"
import { WifiOff, Trophy } from "lucide-react"
import { toast } from "react-hot-toast"
import ToggleSwitchFluent from "@/shared/components/ToggleSwitchFluent"
import { useToggleFreezeLeaderboardMutation } from "@/services/leaderboardApi"
import { useLiveLeaderboard } from "../hooks/useLiveLeaderboard"
import { useTranslation } from "react-i18next"
import ConfirmModal from "@/shared/components/ConfirmModal"

const LeaderboardActions = ({ contestId, refetchLeaderboard }) => {
  const { t } = useTranslation(["leaderboard", "errors"])
  const [isFrozen, setIsFrozen] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    newState: null,
  })

  const [toggleFreeze, { isLoading: isToggling }] =
    useToggleFreezeLeaderboardMutation()

  const handleFreezeToggle = (newState) => {
    setConfirmModal({ isOpen: true, newState })
  }

  const handleConfirmAction = async () => {
    const newState = confirmModal.newState
    try {
      await toggleFreeze(contestId).unwrap()
      setIsFrozen(newState)

      toast.success(
        newState
          ? t("leaderboard:actions.frozenSuccess")
          : t("leaderboard:actions.unfrozenSuccess")
      )
    } catch (error) {
      console.error(error)
      // Revert switch state logic if we were tracking it differently, but here we just don't update local isFrozen
      // Actually isFrozen is local state, if we don't update it, it stays same.

      // Check for specific error message regarding contest status
      if (error?.data?.errorMessage?.includes("Cannot toggle freeze status")) {
        toast.error(t("leaderboard:actions.toggleFreezeInvalidStatus"))
      } else {
        toast.error(
          error?.data?.errorMessage ||
            t("leaderboard:actions.toggleFreezeError")
        )
      }
    } finally {
      // Close modal
      setConfirmModal({ isOpen: false, newState: null })
    }
  }

  const handleLiveUpdate = useCallback(
    (data) => {
      if (import.meta.env.VITE_ENV === "development") {
        console.log("🔄 Live leaderboard update received (organizer):", data)
      }

      // Refresh the current page data when live update comes in
      // This ensures pagination stays consistent
      refetchLeaderboard()
    },
    [refetchLeaderboard]
  )

  const { isConnected } = useLiveLeaderboard(
    contestId,
    handleLiveUpdate,
    !!contestId && !isFrozen
  )

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white min-h-[70px] flex items-center justify-between px-5">
      <div className="flex items-center gap-5">
        <Trophy size={20} />

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm leading-5">
              {t("leaderboard:actions.title")}
            </span>
            {isFrozen ? (
              <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {t("leaderboard:actions.frozen")}
                </span>
              </div>
            ) : isConnected ? (
              <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {t("leaderboard:actions.live")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                <WifiOff size={10} />
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {t("leaderboard:actions.offline")}
                </span>
              </div>
            )}
          </div>
          <div className="text-xs leading-4 text-[#7A7574]">
            {t("leaderboard:actions.subtitle")}
          </div>
        </div>
      </div>

      <ToggleSwitchFluent
        enabled={isFrozen}
        onChange={handleFreezeToggle}
        labelLeft={t("leaderboard:actions.freeze")}
        labelRight={t("leaderboard:actions.unfreeze")}
        labelPosition="left"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.newState
            ? t("leaderboard:actions.confirmFreezeTitle")
            : t("leaderboard:actions.confirmUnfreezeTitle")
        }
        description={
          confirmModal.newState
            ? t("leaderboard:actions.confirmFreezeMessage")
            : t("leaderboard:actions.confirmUnfreezeMessage")
        }
        isLoading={isToggling}
      />
    </div>
  )
}

export default LeaderboardActions
