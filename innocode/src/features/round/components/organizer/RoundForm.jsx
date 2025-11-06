import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import RoundInfoFields from "./RoundInfoFields"
import ProblemTypeSelector from "./ProblemTypeSelector"
import McqTestConfigFields from "./McqTestConfigFields"
import ProblemConfigFields from "./ProblemConfigFields"

export default function RoundForm({
  formData,
  setFormData,
  errors = {},
  setErrors,
  showTypeSelector = true,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors?.[name]) {
      setErrors?.((prev) => ({ ...prev, [name]: "" }))
    }

    if (name === "problemType") {
      if (value === "McqTest") {
        setFormData((prev) => ({
          ...prev,
          mcqTestConfig: {
            name: prev.mcqTestConfig?.name || "",
            config: "temporary-config",
          },
          problemConfig: null,
        }))
      } else if (value === "Problem") {
        // Initialize problemConfig but don't set type yet - let user choose in ProblemConfigFields
        setFormData((prev) => ({
          ...prev,
          problemConfig: {
            description: prev.problemConfig?.description || "",
            language: prev.problemConfig?.language || "",
            penaltyRate: prev.problemConfig?.penaltyRate ?? 0.1,
            type: prev.problemConfig?.type || "", // User will choose Manual or AutoEvaluation
          },
          mcqTestConfig: null,
        }))
      } else {
        // Clear both if no type selected
        setFormData((prev) => ({
          ...prev,
          problemConfig: null,
          mcqTestConfig: null,
        }))
      }
    }
  }

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  return (
    <form className="flex flex-col gap-3">
      <RoundInfoFields
        formData={formData}
        errors={errors}
        handleChange={handleChange}
      />

      {showTypeSelector && (
        <ProblemTypeSelector
          formData={formData}
          handleChange={handleChange}
          errors={errors}
        />
      )}

      {formData.problemType === "McqTest" && (
        <McqTestConfigFields
          mcqTestConfig={formData.mcqTestConfig}
          handleNestedChange={handleNestedChange}
        />
      )}

      {formData.problemType && formData.problemType !== "McqTest" && (
        <ProblemConfigFields
          problemConfig={formData.problemConfig}
          handleNestedChange={handleNestedChange}
        />
      )}
    </form>
  )
}
