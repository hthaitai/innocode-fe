import { useState, useCallback } from "react"
import { WifiOff } from "lucide-react"
import { toast } from "react-hot-toast"
import ToggleSwitchFluent from "@/shared/components/ToggleSwitchFluent"
import { useToggleFreezeLeaderboardMutation } from "@/services/leaderboardApi"
import { useLiveLeaderboard } from "../hooks/useLiveLeaderboard"
import { useTranslation } from "react-i18next"

const LeaderboardActions = ({ contestId, refetchLeaderboard }) => {
  const { t } = useTranslation(["leaderboard", "errors"])
  const [isFrozen, setIsFrozen] = useState(false)

  const [toggleFreeze] = useToggleFreezeLeaderboardMutation()

  const handleFreezeToggle = async (newState) => {
    try {
      const response = await toggleFreeze(contestId).unwrap()
      setIsFrozen(newState)

      toast.success(
        response?.message ??
          response?.data?.message ??
          (newState
            ? t("leaderboard:actions.frozenSuccess")
            : t("leaderboard:actions.unfrozenSuccess"))
      )
    } catch (error) {
      console.error(error)
      setIsFrozen(!newState)

      // Check for specific error message regarding contest status
      if (error?.data?.errorMessage?.includes("Cannot toggle freeze status")) {
        toast.error(t("errors:leaderboard.toggleFreezeInvalidStatus"))
        return
      }

      toast.error(
        error?.data?.errorMessage || t("leaderboard:actions.toggleFreezeError")
      )
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
      <div className="flex items-center gap-3">
        {!isFrozen && (
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">
                  {t("leaderboard:actions.live")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <WifiOff size={14} />
                <span className="text-xs">
                  {t("leaderboard:actions.offline")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <ToggleSwitchFluent
        enabled={isFrozen}
        onChange={handleFreezeToggle}
        labelLeft={t("leaderboard:actions.freeze")}
        labelRight={t("leaderboard:actions.unfreeze")}
        labelPosition="left"
      />
    </div>
  )
}

export default LeaderboardActions
