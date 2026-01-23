import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import BaseModal from "@/shared/components/BaseModal"
import { TextField } from "@mui/material"
import { useCreateAppealMutation } from "@/services/appealApi"
import { toast } from "react-hot-toast"
import { Icon } from "@iconify/react"
import DropdownFluent from "@/shared/components/DropdownFluent"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import translateApiError from "@/shared/utils/translateApiError"

export default function CreateAppealModal({
  isOpen,
  onClose,
  contestId,
  roundId,
  teamId,
  studentId,
  roundName,
  roundType,
}) {
  const { t } = useTranslation(["appeal", "common"])
  const [reason, setReason] = useState("")
  const [evidences, setEvidences] = useState([]) // Array of { file, note }
  const [appealResolution, setAppealResolution] = useState("") // Single selected resolution
  const [createAppeal, { isLoading }] = useCreateAppealMutation()

  // Get available resolution options based on roundType
  const getResolutionOptions = () => {
    if (roundType === "McqTest") {
      return [
        { value: "Retake", label: t("createAppeal.resolutionOptions.retake") },
      ]
    } else if (roundType === "AutoEvaluation") {
      return [
        { value: "Retake", label: t("createAppeal.resolutionOptions.retake") },
        {
          value: "RecheckPlagiarism",
          label: t("createAppeal.resolutionOptions.recheckPlagiarism"),
        },
      ]
    } else if (roundType === "Manual") {
      return [
        { value: "Retake", label: t("createAppeal.resolutionOptions.retake") },
        {
          value: "Rescore",
          label: t("createAppeal.resolutionOptions.rescore"),
        },
        {
          value: "RecheckPlagiarism",
          label: t("createAppeal.resolutionOptions.recheckPlagiarism"),
        },
      ]
    }
    return []
  }

  useEffect(() => {
    if (isOpen) {
      setReason("")
      setEvidences([])
      // Set default appealResolution based on roundType
      if (roundType === "McqTest") {
        setAppealResolution("Retake")
      } else if (roundType === "AutoEvaluation") {
        setAppealResolution("Retake")
      } else if (roundType === "Manual") {
        setAppealResolution("Retake")
      } else {
        setAppealResolution("")
      }
    }
  }, [isOpen, roundType])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newEvidences = files.map((file) => ({
      file,
      note: "",
      id: Date.now() + Math.random(), // Unique ID for each evidence
    }))
    setEvidences((prev) => [...prev, ...newEvidences])
    // Reset input to allow selecting the same file again
    e.target.value = ""
  }

  const handleRemoveEvidence = (id) => {
    setEvidences((prev) => prev.filter((ev) => ev.id !== id))
  }

  const handleEvidenceNoteChange = (id, note) => {
    setEvidences((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, note } : ev)),
    )
  }

  const handleResolutionChange = (value) => {
    setAppealResolution(value)
  }

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error(t("createAppeal.errors.reasonRequired"))
      return
    }

    if (!roundId || !teamId || !studentId) {
      toast.error(t("createAppeal.errors.missingInfo"))
      return
    }

    if (!appealResolution || appealResolution.trim() === "") {
      toast.error(t("createAppeal.errors.resolutionRequired"))
      return
    }

    const appealData = {
      RoundId: roundId,
      TeamId: teamId,
      StudentId: studentId,
      Reason: reason,
      Evidences: evidences && evidences.length > 0 ? evidences : [],
      AppealResolution: [appealResolution],
    }

    try {
      await createAppeal(appealData).unwrap()

      toast.success(t("createAppeal.success"))
      onClose()
    } catch (error) {
      console.error("Error creating appeal:", error)
      console.error("Error details:", {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        fullError: JSON.stringify(error, null, 2),
      })

      toast.dismiss()

      // Translate and show error message
      const translatedMessage = translateApiError(error)
      toast.error(translatedMessage)
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button className="button-white" onClick={onClose} disabled={isLoading}>
        {t("cancel")}
      </button>
      <button
        className="button-orange"
        onClick={handleSubmit}
        disabled={isLoading || !reason.trim()}
      >
        {isLoading ? t("submitting") : t("createAppeal.submitButton")}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("createAppeal.title")}
      size="md"
      footer={footer}
    >
      <div className="space-y-4">
        {/* Round Info */}
        {(roundName || roundType) && (
          <div className="bg-gray-50 rounded px-3 py-2 border border-gray-200">
            {roundName && (
              <>
                <p className="text-xs text-gray-600 mb-1">
                  {t("createAppeal.roundLabel")}
                </p>
                <p className="text-sm font-medium text-gray-900">{roundName}</p>
              </>
            )}
            {roundType && (
              <>
                <p className="text-xs text-gray-600 mb-1 mt-2">
                  {t("createAppeal.roundTypeLabel")}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {roundType === "McqTest"
                    ? t("createAppeal.roundTypes.mcqTest")
                    : roundType === "Manual"
                      ? t("createAppeal.roundTypes.manual")
                      : roundType === "AutoEvaluation"
                        ? t("createAppeal.roundTypes.autoEvaluation")
                        : roundType}
                </p>
              </>
            )}
          </div>
        )}

        {/* Reason Field */}
        <div>
          <TextField
            label={t("createAppeal.reasonLabel")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder={t("createAppeal.reasonPlaceholder")}
            required
            helperText={t("createAppeal.reasonHelperText")}
          />
        </div>

        {/* Appeal Resolution Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("createAppeal.resolutionLabel")}
          </label>
          {roundType === "McqTest" ? (
            <div className="bg-gray-50 rounded px-3 py-2 border border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {t("createAppeal.resolutionOptions.retake")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("createAppeal.mcqDefaultResolution")}
              </p>
            </div>
          ) : (
            <div className="space-y-2 border border-gray-300 rounded px-4 py-3 bg-white">
              {getResolutionOptions().map((option) => {
                const isChecked = appealResolution === option.value
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="appeal-resolution"
                      value={option.value}
                      checked={isChecked}
                      onChange={() => handleResolutionChange(option.value)}
                      className="w-4 h-4 text-[#E05307] accent-[#E05307] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </div>
          )}
          {appealResolution && (
            <p className="text-xs text-gray-500 mt-2">
              {t("createAppeal.selected")}: {appealResolution}
            </p>
          )}
        </div>

        {/* Evidence Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("createAppeal.evidenceLabel")}
          </label>
          <div className="border border-gray-300 rounded px-4 py-3 bg-gray-50">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="evidence-upload"
              accept="image/*,.pdf,.doc,.docx"
            />
            <label
              htmlFor="evidence-upload"
              className="cursor-pointer flex items-center gap-2 text-sm text-gray-700 hover:text-orange-600"
            >
              <Icon icon="mdi:paperclip" width={20} />
              <span>
                {evidences.length > 0
                  ? t("createAppeal.filesSelected", { count: evidences.length })
                  : t("createAppeal.uploadEvidencePlaceholder")}
              </span>
            </label>
          </div>
          {evidences.length > 0 && (
            <div className="mt-3 space-y-3">
              {evidences.map((evidence) => (
                <div
                  key={evidence.id}
                  className="border border-gray-300 rounded px-4 py-3 bg-white"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon
                        icon="mdi:file"
                        width={16}
                        className="text-gray-600 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {evidence.file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveEvidence(evidence.id)}
                      className="text-red-600 hover:text-red-800 flex-shrink-0"
                      type="button"
                    >
                      <Icon icon="mdi:close" width={18} />
                    </button>
                  </div>
                  <TextFieldFluent
                    label={t("createAppeal.evidenceNoteLabel")}
                    value={evidence.note}
                    onChange={(e) =>
                      handleEvidenceNoteChange(evidence.id, e.target.value)
                    }
                    placeholder={t("createAppeal.evidenceNotePlaceholder")}
                    multiline
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {t("createAppeal.supportedFormats")}
          </p>
        </div>
      </div>
    </BaseModal>
  )
}
