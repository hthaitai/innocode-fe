import { useState } from "react"
import { Snowflake } from "lucide-react"
import { toast } from "react-hot-toast"
import ToggleSwitchFluent from "@/shared/components/ToggleSwitchFluent"
import { useToggleFreezeLeaderboardMutation } from "@/services/leaderboardApi"
import { useTranslation } from "react-i18next"
import ConfirmModal from "@/shared/components/ConfirmModal"

const LeaderboardActions = ({
  contestId,
  refetchLeaderboard,
  isFrozen,
  setIsFrozen,
}) => {
  const { t } = useTranslation(["leaderboard", "errors"])
  // const [isFrozen, setIsFrozen] = useState(false) // Lifted up
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
          : t("leaderboard:actions.unfrozenSuccess"),
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
            t("leaderboard:actions.toggleFreezeError"),
        )
      }
    } finally {
      // Close modal
      setConfirmModal({ isOpen: false, newState: null })
    }
  }

  // Hook moved to parent

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white min-h-[70px] flex items-center justify-between px-5">
      <div className="flex items-center gap-5">
        <Snowflake size={20} />

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm leading-5">
              {t("leaderboard:actions.title")}
            </span>
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
