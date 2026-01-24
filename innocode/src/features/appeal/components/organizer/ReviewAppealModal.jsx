import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { useReviewAppealMutation } from "../../../../services/appealApi"
import DropdownFluent from "@/shared/components/DropdownFluent"
import Label from "../../../../shared/components/form/Label"
import { toast } from "react-hot-toast"
import { isFetchError } from "@/shared/utils/apiUtils"

export default function ReviewAppealModal({ isOpen, appeal, onClose }) {
  const { t } = useTranslation(["appeal", "contest"])
  const [decision, setDecision] = useState("Approved")
  const [decisionReason, setDecisionReason] = useState("")
  const [error, setError] = useState("")

  const [reviewAppeal, { isLoading }] = useReviewAppealMutation()

  useEffect(() => {
    if (isOpen && appeal) {
      setDecision("Approved")
      setDecisionReason("")
      setError("")
    }
  }, [isOpen, appeal])

  if (!appeal) return null

  const handleSubmit = async () => {
    if (!decisionReason.trim()) {
      setError(t("errorReasonRequired"))
      return
    }

    try {
      await reviewAppeal({
        appealId: appeal.appealId,
        decision,
        decisionReason,
      }).unwrap()

      toast.success(t("reviewSuccess"))
      onClose()
    } catch (err) {
      console.error(err)

      if (isFetchError(err)) return

      const errorMessage =
        err?.data?.errorMessage ||
        err?.data?.message ||
        err?.data?.Message ||
        err?.error ||
        err?.error ||
        t("errorReviewFailed")

      const errorCode = err?.data?.errorCode

      if (errorMessage === "Appeal has already been reviewed.") {
        toast.error(t("appealAlreadyReviewed"))
      } else if (
        errorCode === "APPEAL_REVIEW_DEADLINE_PASSED" ||
        errorMessage === "Appeal review window is closed."
      ) {
        toast.error(t("appealReviewWindowClosed"))
      } else {
        setError(errorMessage)
      }
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" className="button-white" onClick={onClose}>
        {t("cancel")}
      </button>
      <button
        type="button"
        className={`flex items-center justify-center gap-2 ${
          isLoading ? "button-gray" : "button-orange"
        }`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {t("submitReview")}
      </button>
    </div>
  )

  const decisionOptions = [
    { label: t("approved"), value: "Approved" },
    { label: t("rejected"), value: "Rejected" },
  ]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("reviewAppealWithTeam", { teamName: appeal.teamName })}
      size="md"
      footer={footer}
    >
      <div className="flex flex-col gap-5 text-sm leading-5">
        {/* Decision dropdown */}
        <div className="flex flex-col gap-2">
          <Label>{t("decision")}</Label>
          <DropdownFluent
            options={decisionOptions}
            value={decision}
            onChange={setDecision}
            placeholder={t("selectDecision")}
          />
        </div>

        {/* Decision reason input */}
        <div className="flex flex-col gap-2">
          <Label required>{t("mentorReason")}</Label>
          <TextFieldFluent
            name="decisionReason"
            value={decisionReason}
            onChange={(e) => {
              setDecisionReason(e.target.value)
              if (error) setError("")
            }}
            error={!!error}
            helperText={error}
            placeholder={t("decisionReasonPlaceholder")}
            multiline
          />
        </div>
      </div>
    </BaseModal>
  )
}
