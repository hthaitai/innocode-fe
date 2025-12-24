import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DateTimeFieldFluent from "@/shared/components/datetimefieldfluent/DateTimeFieldFluent"
import DropdownFluent from "../../../../shared/components/DropdownFluent"
import Label from "@/shared/components/form/Label"
import { AnimatePresence, motion } from "framer-motion"
import { useGetRoundsByContestIdQuery } from "@/services/roundApi"
import BasicInfoSection from "./BasicInfoSection"
import RoundTypeSection from "./RoundTypeSection"
import ProblemConfigurationSection from "./ProblemConfigurationSection"
import { toDatetimeLocal } from "../../../../shared/utils/dateTime"

export default function RoundForm({
  contestId,
  formData,
  setFormData,
  errors = {},
  setErrors,
  showTypeSelector = true,
  onSubmit,
  isSubmitting,
  mode = "create",
  hasChanges,
}) {
  const { data: roundsData } = useGetRoundsByContestIdQuery(contestId)
  const rounds = roundsData?.data ?? []
  const nonRetakeRounds = React.useMemo(
    () => rounds.filter((r) => r.isRetakeRound === false),
    [rounds]
  )

  const fileInputRef = React.useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors?.[name]) setErrors?.((prev) => ({ ...prev, [name]: "" }))
  }

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))

    // Clear nested errors if exist
    let errorKey = null
    if (section === "problemConfig" && field === "description") {
      errorKey = "problemConfigDescription"
    }
    if (section === "mcqTestConfig" && field === "name") {
      errorKey = "mcqName"
    }
    if (section === "mcqTestConfig" && field === "config") {
      errorKey = "mcqConfig"
    }

    if (errorKey && errors?.[errorKey]) {
      setErrors?.((prev) => ({ ...prev, [errorKey]: "" }))
    }
  }

  const handleFileChange = (file) => {
    if (!file) return
    setFormData((prev) => ({ ...prev, TemplateFile: file }))

    if (errors?.templateFile) {
      setErrors?.((prev) => ({ ...prev, templateFile: "" }))
    }
  }

  // Inside RoundForm, after handleNestedChange
  const handleMainRoundSelect = (mainRoundId) => {
    if (!mainRoundId) {
      setFormData((prev) => ({
        ...prev,
        mainRoundId,
        isRetakeRound: true, // explicitly set
        problemType: "",
        problemConfig: {
          description: "",
          language: "Python 3",
          penaltyRate: 0.1,
          type: "",
          templateUrl: "",
        },
        mcqTestConfig: { name: "", config: "" },
      }))
      return
    }

    const mainRound = rounds.find(
      (r) => String(r.roundId) === String(mainRoundId)
    )
    if (!mainRound) return

    const formatted = {
      mainRoundId,
      isRetakeRound: true,
      name: `${mainRound.roundName} (Retake)`,
      start: mainRound.start ? toDatetimeLocal(mainRound.start) : "",
      end: mainRound.end ? toDatetimeLocal(mainRound.end) : "",
      problemType: mainRound.problemType,
      timeLimitSeconds: mainRound.timeLimitSeconds,
      mcqTestConfig:
        mainRound.problemType === "McqTest" && mainRound.mcqTest
          ? { ...mainRound.mcqTest }
          : { name: "", config: "" },
      problemConfig:
        ["Manual", "AutoEvaluation"].includes(mainRound.problemType) &&
        mainRound.problem
          ? {
              ...mainRound.problem,
              type: mainRound.problem?.type || mainRound.problemType,
              templateUrl: mainRound.problem?.templateUrl,
            }
          : {
              description: "",
              language: "Python 3",
              penaltyRate: 0.1,
              type: "",
              templateUrl: "",
            },
      TemplateFile: null,
    }

    setFormData(formatted)
  }

  const disabled = !!isSubmitting || (mode === "edit" && !hasChanges)
  const isEditMode = mode === "edit"
  const isRetakeRound = formData?.isRetakeRound
  const isEditingRetakeRound = isEditMode && isRetakeRound

  console.log({
    mode,
    isRetakeRound: formData?.isRetakeRound,
    isEditingRetakeRound,
  })

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      <div className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-5 items-start">
        {!isEditMode && (
          <RoundTypeSection
            formData={formData}
            setFormData={setFormData}
            rounds={nonRetakeRounds}
            errors={errors}
            handleMainRoundSelect={handleMainRoundSelect}
          />
        )}

        <BasicInfoSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
          isEditingRetakeRound={isEditingRetakeRound}
        />

        {!isEditingRetakeRound && (
          <ProblemConfigurationSection
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            handleNestedChange={handleNestedChange}
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
        )}

        {onSubmit && (
          <>
            <div></div>
            <div className="flex justify-start mt-4">
              <button
                type="button"
                onClick={onSubmit}
                disabled={disabled}
                className={`flex items-center justify-center gap-2 ${
                  disabled ? "button-gray" : "button-orange"
                }`}
              >
                {/* Spinner */}
                {isSubmitting && (
                  <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
                )}

                {/* Button text */}
                {isSubmitting
                  ? mode === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : mode === "edit"
                  ? "Save"
                  : "Create"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
