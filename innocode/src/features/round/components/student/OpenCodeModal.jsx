import React, { useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import roundApi from "@/api/roundApi"

const OpenCodeModal = ({ isOpen, onClose, onConfirm, roundName, roundId }) => {
  const { t } = useTranslation("pages")
  const [openCode, setOpenCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!openCode.trim()) {
      setError(t("contest.openCodeModal.errorRequired"))
      return
    }

    // Validate openCode by calling API
    setLoading(true)
    try {
      // Validate by fetching round with openCode
      const response = await roundApi.getById(roundId, openCode.trim())

      // Check if response is successful
      if (
        response.data &&
        (response.data.code === "SUCCESS" || response.data)
      ) {
        // If API call succeeds, openCode is valid
        onConfirm(openCode.trim())
        setOpenCode("")
        setError("")
        // Close modal after successful validation
        onClose()
      } else {
        setError(
          response.data?.message || t("contest.openCodeModal.errorInvalid")
        )
      }
    } catch (err) {
      // Handle error - show in modal
      const errorMessage =
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        err.message ||
        t("contest.openCodeModal.errorInvalid")
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpenCode("")
    setError("")
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("contest.openCodeModal.title")}
      size="md"
      footer={
        <div className="flex gap-2">
          <button
            className="button-white"
            onClick={handleClose}
            disabled={loading}
          >
            {t("contest.openCodeModal.cancel")}
          </button>
          <button
            className="button-orange flex items-center justify-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {t("contest.openCodeModal.validating")}
              </>
            ) : (
              <>
                <div>
                  <Icon icon="mdi:play" width="16" />
                </div>
                <span>{t("contest.openCodeModal.verifyAndStart")}</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {roundName && (
          <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-3">
            <p className="text-sm text-[#7A7574] mb-1">
              {t("contest.openCodeModal.roundLabel")}
            </p>
            <p className="font-semibold text-[#2d3748]">{roundName}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#2d3748] mb-2">
            {t("contest.openCodeModal.openCodeLabel")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={openCode}
            onChange={(e) => {
              setOpenCode(e.target.value)
              setError("")
            }}
            placeholder={t("contest.openCodeModal.openCodePlaceholder")}
            className={`w-full px-4 py-2 border rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] ${
              error ? "border-red-500" : "border-[#E5E5E5]"
            }`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e)
              }
            }}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <Icon icon="mdi:alert-circle" width="14" />
              {error}
            </p>
          )}
        </div>

        <div className=" border border-orange-200 rounded-[5px] p-3">
          <div className="flex items-start gap-2">
            <Icon
              icon="mdi:information"
              width="18"
              className=" flex-shrink-0 text-orange-400 mt-0.5"
            />
            <p className="text-sm ">{t("contest.openCodeModal.helpText")}</p>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default OpenCodeModal
