import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DateTimeFieldFluent from "@/shared/components/datetimefieldfluent/DateTimeFieldFluent"
import DropdownFluent from "../../../../shared/components/DropdownFluent"
import Label from "@/shared/components/form/Label"

export default function RoundForm({
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
  const fileInputRef = React.useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors?.[name]) setErrors?.((prev) => ({ ...prev, [name]: "" }))

    // handle problemType selection
    if (name === "problemType") {
      if (value === "McqTest") {
        setFormData((prev) => ({
          ...prev,
          mcqTestConfig: { name: "", config: "" },
          problemConfig: null,
        }))
      } else if (value === "Manual" || value === "AutoEvaluation") {
        setFormData((prev) => ({
          ...prev,
          mcqTestConfig: null,
          problemConfig: {
            description: "",
            language: "",
            penaltyRate: 0.1,
            type: value,
          },
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          mcqTestConfig: null,
          problemConfig: null,
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

  const handleFileChange = (file) => {
    if (!file) return
    setFormData((prev) => ({ ...prev, TemplateFile: file }))

    // read content to auto-fill code editor
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result
      setFormData((prev) => ({
        ...prev,
        problemConfig: { ...prev.problemConfig, codeTemplate: content },
      }))
    }
    reader.readAsText(file)
  }

  // Add this handler above your return statement
  const handleProblemTypeChange = (val) => {
    setFormData((prev) => {
      const updated = { ...prev, problemType: val }

      if (val === "McqTest") {
        updated.mcqTestConfig = { name: "", config: "" }
        updated.problemConfig = null
      } else if (val === "Manual" || val === "AutoEvaluation") {
        updated.mcqTestConfig = null
        updated.problemConfig = {
          description: "",
          language: "",
          penaltyRate: 0.1,
          type: val,
        }
      } else {
        updated.mcqTestConfig = null
        updated.problemConfig = null
      }

      return updated
    })

    if (errors?.problemType) {
      setErrors?.((prev) => ({ ...prev, problemType: "" }))
    }
  }

  const disabled = !!isSubmitting || (mode === "edit" && !hasChanges)

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      <div className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-5 items-start">
        {/* Round Name */}
        <Label htmlFor="name" required>
          Round Name
        </Label>
        <TextFieldFluent
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Start */}
        <Label htmlFor="start" required>
          Start
        </Label>
        <DateTimeFieldFluent
          id="start"
          name="start"
          type="datetime-local"
          value={formData.start || ""}
          onChange={handleChange}
          error={!!errors.start}
          helperText={errors.start}
        />

        {/* End */}
        <Label htmlFor="end" required>
          End
        </Label>
        <DateTimeFieldFluent
          id="end"
          name="end"
          type="datetime-local"
          value={formData.end || ""}
          onChange={handleChange}
          error={!!errors.end}
          helperText={errors.end}
        />

        {/* Time Limit */}
        <Label htmlFor="timeLimitSeconds">Time Limit (seconds)</Label>
        <TextFieldFluent
          id="timeLimitSeconds"
          name="timeLimitSeconds"
          type="number"
          value={formData.timeLimitSeconds ?? ""}
          onChange={handleChange}
          min={0}
          placeholder="Enter time limit in seconds"
          error={!!errors.timeLimitSeconds}
          helperText={errors.timeLimitSeconds}
        />

        {/* Problem Type */}
        {showTypeSelector && (
          <>
            <Label htmlFor="problemType" required>
              Problem Type
            </Label>
            <DropdownFluent
              id="problemType"
              options={[
                { value: "McqTest", label: "MCQ" },
                { value: "Manual", label: "Manual Problem" },
                { value: "AutoEvaluation", label: "Auto Evaluation" },
              ]}
              value={formData.problemType || ""}
              onChange={handleProblemTypeChange}
              placeholder="Select type"
              error={!!errors.problemType}
              helperText={errors.problemType}
            />
          </>
        )}

        {/* MCQ Config */}
        {formData.problemType === "McqTest" && (
          <>
            <Label htmlFor="mcqName">Config Name</Label>
            <TextFieldFluent
              id="mcqName"
              value={formData.mcqTestConfig?.name || ""}
              onChange={(e) =>
                handleNestedChange("mcqTestConfig", "name", e.target.value)
              }
            />

            <Label htmlFor="mcqConfig">Config</Label>
            <TextFieldFluent
              id="mcqConfig"
              value={formData.mcqTestConfig?.config || ""}
              onChange={(e) =>
                handleNestedChange("mcqTestConfig", "config", e.target.value)
              }
            />
          </>
        )}

        {/* Problem Config */}
        {["Manual", "AutoEvaluation"].includes(formData.problemType) && (
          <>
            <Label htmlFor="description" required>Description</Label>
            <TextFieldFluent
              id="description"
              value={formData.problemConfig?.description || ""}
              onChange={(e) =>
                handleNestedChange(
                  "problemConfig",
                  "description",
                  e.target.value
                )
              }
              error={!!errors.problemConfigDescription}
              helperText={errors.problemConfigDescription}
            />

            <Label htmlFor="language" required>Language</Label>
            <TextFieldFluent
              id="language"
              value={formData.problemConfig?.language || ""}
              onChange={(e) =>
                handleNestedChange("problemConfig", "language", e.target.value)
              }
              error={!!errors.problemConfigLanguage}
              helperText={errors.problemConfigLanguage}
            />

            <Label htmlFor="penaltyRate">Penalty Rate</Label>
            <TextFieldFluent
              id="penaltyRate"
              type="number"
              value={formData.problemConfig?.penaltyRate ?? 0.1}
              onChange={(e) =>
                handleNestedChange(
                  "problemConfig",
                  "penaltyRate",
                  parseFloat(e.target.value)
                )
              }
            />

            {/* Template File */}
            <Label htmlFor="templateFile">Template File</Label>

            <div>
              <input
                type="file"
                id="templateFile"
                accept=".txt,.py,.js,.java"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                style={{ display: "none" }}
                ref={(el) => (fileInputRef.current = el)}
              />

              <button
                type="button"
                className="button-orange px-3"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.TemplateFile ? "Change file" : "Browse"}
              </button>

              {/* Show file name if uploaded, otherwise show current template URL */}
              {formData.TemplateFile ? (
                <span className="ml-2 text-sm">
                  {formData.TemplateFile.name}
                </span>
              ) : formData.problemConfig?.templateUrl ? (
                <span className="ml-2 text-sm text-gray-600">
                  Current template:{" "}
                  <a
                    href={formData.problemConfig.templateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {formData.problemConfig.templateUrl.split("/").pop()}
                  </a>
                </span>
              ) : null}
            </div>
          </>
        )}

        {/* Submit Button */}
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
                  : "Create round"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
