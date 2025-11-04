import React, { useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { useModal } from "@/shared/hooks/useModal"
import { Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import axios from "axios"

const PublishContestSection = ({ contest }) => {
  const { openModal } = useModal()
  const [loading, setLoading] = useState(false)

  // Get all rounds from Redux
  const { rounds } = useAppSelector((state) => state.rounds)

  // Filter rounds for this contest
  const contestRounds = rounds.filter((r) => r.contestId === contest.contestId)
  const canPublish = contestRounds.length > 0

  const handlePublish = async () => {
    if (!contest || !canPublish) return

    openModal("confirm", {
      title: "Publish Contest",
      description: `Are you sure you want to publish "${contest.name}"?`,
      onConfirm: async (onClose) => {
        try {
          setLoading(true)
          await axios.post(`/api/contests/${contest.contestId}/publish`)

          toast.success("Contest published successfully!")
          onClose()
          // optionally refetch contests or rounds here
        } catch (error) {
          if (error.response?.data?.Code === "PUBLISH_BLOCKED") {
            const missing =
              error.response.data.AdditionalData?.missing?.join(", ")
            openModal("alert", {
              title: "Cannot Publish Contest",
              description: `Contest is not ready to publish. Missing: ${missing}`,
            })
          } else {
            toast.error("Failed to publish contest")
          }
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Upload size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">
            Publish contest
          </p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {canPublish
              ? "Make this contest visible and active for participants"
              : "Cannot publish: no rounds created yet"}
          </p>
        </div>
      </div>
      <button
        className={`${
          !canPublish ? "button-gray cursor-not-allowed" : "button-orange"
        } ${loading ? "opacity-70" : ""} `}
        onClick={handlePublish}
        disabled={loading || !canPublish}
      >
        {loading ? "Publishing..." : "Publish"}
      </button>
    </div>
  )
}

export default PublishContestSection
