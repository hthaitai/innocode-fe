import React, { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import { useModal } from "@/shared/hooks/useModal"
import { useAppDispatch } from "@/store/hooks"
import {
  publishContest,
  checkPublishReady,
} from "@/features/contest/store/contestThunks"

const PublishContestSection = ({ contest }) => {
  if (!contest) return null
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [readyInfo, setReadyInfo] = useState(null)

  const isPublished = contest?.status === "Published"
  const isReady = readyInfo?.isReady
  const missingItems = readyInfo?.missing || []

  // --- Check if contest is ready ---
  useEffect(() => {
    if (!contest?.contestId) return
    if (isPublished) return

    let isMounted = true

    const load = async () => {
      setChecking(true)
      const result = await dispatch(checkPublishReady(contest.contestId))

      if (!isMounted) return

      if (checkPublishReady.fulfilled.match(result)) {
        setReadyInfo(result.payload.data)
      } else {
        // Treat 404 as "not ready" — not an error
        setReadyInfo({ isReady: false, missing: result.payload?.missing || [] })
      }
      setChecking(false)
    }

    load()

    return () => {
      isMounted = false
    }
  }, [contest?.contestId, contest?.status, isPublished, dispatch])

  const handlePublish = async () => {
    if (!contest || isPublished) return

    if (!isReady) {
      openModal("alert", {
        title: "Cannot Publish Contest",
        description: `Contest is not ready. Missing: ${
          missingItems.join(", ") || "required items"
        }`,
      })
      return
    }

    openModal("confirm", {
      title: "Publish Contest",
      description: `Are you sure you want to publish "${contest.name}"?`,
      onConfirm: async (onClose) => {
        try {
          setLoading(true)
          const result = await dispatch(publishContest(contest.contestId))
          if (publishContest.fulfilled.match(result)) {
            toast.success("Contest published successfully!")
            onClose()
          } else {
            const err = result.payload
            if (err?.Code === "PUBLISH_BLOCKED") {
              openModal("alert", {
                title: "Cannot Publish Contest",
                description: `Contest is not ready. Missing: ${err.AdditionalData?.missing?.join(
                  ", "
                )}`,
              })
              // Recheck after publish failure
              const check = await dispatch(checkPublishReady(contest.contestId))
              if (checkPublishReady.fulfilled.match(check))
                setReadyInfo(check.payload.data)
            } else {
              toast.error(err?.Message || "Failed to publish contest")
            }
          }
        } catch {
          toast.error("Failed to publish contest")
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const disabled = loading || checking || isPublished
  const buttonText = isPublished
    ? "Already Published"
    : loading
    ? "Publishing..."
    : checking
    ? "Checking..."
    : "Publish"

  const helperText = isPublished
    ? "This contest has already been published."
    : checking
    ? "Checking if contest is ready to publish..."
    : isReady
    ? "Make this contest visible and active for participants."
    : `Cannot publish: ${
        missingItems.join(", ") ||
        "Contest is not ready, create rounds to publish contest"
      }`

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Upload size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Publish contest</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {helperText}
          </p>
        </div>
      </div>

      <button
        onClick={handlePublish}
        disabled={disabled || !isReady}
        className={`${
          disabled || !isReady
            ? "button-gray cursor-not-allowed"
            : "button-orange"
        } ${loading ? "opacity-70" : ""}`}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default PublishContestSection
