import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DateTimeFieldFluent from "@/shared/components/datetimefieldfluent/DateTimeFieldFluent"
import DropdownFluent from "../../../../shared/components/DropdownFluent"
import Label from "@/shared/components/form/Label"
import { AnimatePresence, motion } from "framer-motion"

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

  const handleProblemTypeChange = (val) => {
    const updated = { ...formData, problemType: val }

    if (val === "McqTest") updated.mcqTestConfig = { name: "", config: "" }
    else if (val === "Manual" || val === "AutoEvaluation") {
      updated.problemConfig = {
        description: "",
        language: "Python 3",
        penaltyRate: 0.1,
        type: val,
      }
      updated.mcqTestConfig = null
    } else {
      updated.mcqTestConfig = null
      updated.problemConfig = null
    }

    setFormData(updated)
    if (errors?.problemType) setErrors((prev) => ({ ...prev, problemType: "" }))
  }

  const disabled = !!isSubmitting || (mode === "edit" && !hasChanges)

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 text-sm leading-5">
      <div className="grid grid-cols-[150px_1fr] gap-x-4 gap-y-5 items-start">
        {/* Round Name */}
        <Label htmlFor="name" required>
          Round name
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
        <Label htmlFor="timeLimitSeconds">Time limit (seconds)</Label>
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
              Problem type
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
            <Label htmlFor="mcqName">Config name</Label>
            <TextFieldFluent
              id="mcqName"
              value={formData.mcqTestConfig?.name || ""}
              onChange={(e) =>
                handleNestedChange("mcqTestConfig", "name", e.target.value)
              }
              error={!!errors.mcqName}
              helperText={errors.mcqName}
            />

            <Label htmlFor="mcqConfig">Config</Label>
            <TextFieldFluent
              id="mcqConfig"
              value={formData.mcqTestConfig?.config || ""}
              onChange={(e) =>
                handleNestedChange("mcqTestConfig", "config", e.target.value)
              }
              error={!!errors.mcqConfig}
              helperText={errors.mcqConfig}
            />
          </>
        )}

        {/* Problem Config */}
        {["Manual", "AutoEvaluation"].includes(formData.problemType) && (
          <>
            <Label htmlFor="description" required>
              Description
            </Label>
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

            <Label htmlFor="language" required>
              Language
            </Label>
            <TextFieldFluent
              id="language"
              value={formData.problemConfig?.language || ""}
              disabled
            />

            <Label htmlFor="penaltyRate">Penalty rate</Label>
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
            <Label htmlFor="templateFile">Template file</Label>
            <div>
              <input
                type="file"
                id="templateFile"
                accept=".py"
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
              {formData.TemplateFile && (
                <span className="ml-2 text-sm leading-5 text-[#7A7574]">
                  {formData.TemplateFile.name}
                </span>
              )}

              {/* ---- Validation Error for Template File ---- */}
              <AnimatePresence>
                {errors.templateFile && (
                  <motion.p
                    key="template-file-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs leading-4 mt-1 text-[#D32F2F]"
                  >
                    {errors.templateFile}
                  </motion.p>
                )}
              </AnimatePresence>
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
                  : "Create"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
