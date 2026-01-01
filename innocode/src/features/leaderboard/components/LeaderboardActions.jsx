import { useState, useCallback } from "react"
import { WifiOff } from "lucide-react"
import { toast } from "react-hot-toast"
import ToggleSwitchFluent from "@/shared/components/ToggleSwitchFluent"
import { useToggleFreezeLeaderboardMutation } from "@/services/leaderboardApi"
import { useLiveLeaderboard } from "../hooks/useLiveLeaderboard"

const LeaderboardActions = ({ contestId, refetchLeaderboard }) => {
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
            ? "Leaderboard frozen successfully"
            : "Leaderboard unfrozen successfully")
      )
    } catch (error) {
      console.error(error)
      setIsFrozen(!newState)
      toast.error(error?.data?.errorMessage || "Failed to toggle freeze")
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
                <span className="text-xs font-medium">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <WifiOff size={14} />
                <span className="text-xs">Offline</span>
              </div>
            )}
          </div>
        )}
      </div>

      <ToggleSwitchFluent
        enabled={isFrozen}
        onChange={handleFreezeToggle}
        labelLeft="Freeze"
        labelRight="Unfreeze"
        labelPosition="left"
      />
    </div>
  )
}

export default LeaderboardActions
