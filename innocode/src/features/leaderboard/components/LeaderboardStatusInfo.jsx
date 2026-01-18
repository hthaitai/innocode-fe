import React from "react"
import { useTranslation } from "react-i18next"
import StatusBadge from "@/shared/components/StatusBadge"
import { Signal } from "lucide-react"

const LeaderboardStatusInfo = ({ isFrozen, isConnected }) => {
  const { t } = useTranslation(["leaderboard"])

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-5">
        <Signal size={28} className="w-[92px] h-[66px] text-orange-500" />

        <div>
          <div className="font-medium text-subtitle-1">
            {t("leaderboard:actions.leaderboardStatus")}
          </div>
          <div className="mt-1 text-[#7A7574] text-body-1">
            {isFrozen ? (
              <StatusBadge
                status="paused"
                label={t("leaderboard:actions.frozen")}
              />
            ) : isConnected ? (
              <StatusBadge
                status="live"
                label={t("leaderboard:actions.live")}
              />
            ) : (
              <StatusBadge
                status="offline"
                label={t("leaderboard:actions.offline")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardStatusInfo
