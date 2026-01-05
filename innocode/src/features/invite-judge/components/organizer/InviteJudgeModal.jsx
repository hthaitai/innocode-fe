import React, { useEffect, useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { useInviteJudgeToContestMutation } from "@/services/contestJudgeApi"
import { toast } from "react-hot-toast"
import { sendJudgeInviteEmail } from "@/shared/services/emailService"
import { useTranslation, Trans } from "react-i18next"

export default function InviteJudgeModal({
  isOpen,
  onClose,
  contestId,
  judgeUserId,
  judgeName,
  judgeEmail,
}) {
  const { t } = useTranslation("judge")
  const [ttlDays, setTtlDays] = useState(1)
  const [error, setError] = useState("")
  const [inviteJudgeToContest, { isLoading }] =
    useInviteJudgeToContestMutation()
  const [sendingEmail, setSendingEmail] = useState(false)

  const MIN_TTL = 1
  const MAX_TTL = 60

  useEffect(() => {
    if (isOpen) {
      setTtlDays(1)
      setError("")
    }
  }, [isOpen])

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val) || val < MIN_TTL || val > MAX_TTL) {
      setError(t("inviteModal.ttlError", { min: MIN_TTL, max: MAX_TTL }))
    } else {
      setError("")
    }
    setTtlDays(val || "")
  }

  const handleSubmit = async () => {
    if (!contestId || !judgeUserId)
      return toast.error(t("inviteModal.errorMissingInfo"))
    if (error || !ttlDays) return

    try {
      const result = await inviteJudgeToContest({
        contestId,
        judgeUserId,
        ttlDays,
      }).unwrap()

      const { inviteCode, contestName } = result.data

      const baseUrl =
        import.meta.env.VITE_FRONTEND_URL || window.location.origin
      const acceptUrl = `${baseUrl}/judge/accept?inviteCode=${inviteCode}`
      const declineUrl = `${baseUrl}/judge/decline?inviteCode=${inviteCode}`

      setSendingEmail(true)
      await sendJudgeInviteEmail({
        judgeEmail,
        judgeName,
        contestName,
        acceptUrl,
        declineUrl,
      })
      setSendingEmail(false)

      toast.success(t("inviteModal.success"))
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || t("inviteModal.errorGeneric"))
    }
  }

  const loading = isLoading || sendingEmail

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("inviteModal.title")}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <button className="button-white" onClick={onClose} disabled={loading}>
            {t("inviteModal.cancel")}
          </button>
          <button
            className={`flex items-center gap-2 justify-center ${
              loading || !!error || !ttlDays ? "button-gray" : "button-orange"
            }`}
            onClick={handleSubmit}
            disabled={loading || !!error || !ttlDays}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
            )}

            {loading ? t("inviteModal.submitting") : t("inviteModal.submit")}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm leading-5 text-[#7A7574]">
          <Trans
            i18nKey="judge:inviteModal.description"
            values={{
              name: judgeName || t("activeJudges.unnamed"),
              email: judgeEmail
                ? t("inviteModal.emailFormat", { email: judgeEmail })
                : "",
            }}
            components={{ strong: <strong />, br: <br /> }}
          />
        </p>

        <TextFieldFluent
          label={t("inviteModal.ttlLabel")}
          type="number"
          min={MIN_TTL}
          max={MAX_TTL}
          value={ttlDays}
          onChange={handleChange}
          error={!!error}
          helperText={error}
        />
      </div>
    </BaseModal>
  )
}
