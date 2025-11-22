import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DateTimeFieldFluent from "@/shared/components/datetimefieldfluent/DateTimeFieldFluent"
import DropdownFluent from "@/shared/components/DropdownFluent"
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
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors?.[name]) setErrors?.((prev) => ({ ...prev, [name]: "" }))

    // handle problemType selection
    if (name === "problemType") {
      if (value === "McqTest") {
        setFormData((prev) => ({
          ...prev,
          mcqTestConfig: { name: prev.mcqTestConfig?.name || "", config: "" },
          problemConfig: null,
        }))
      } else if (value === "Problem") {
        setFormData((prev) => ({
          ...prev,
          problemConfig: {
            description: prev.problemConfig?.description || "",
            language: prev.problemConfig?.language || "",
            penaltyRate: prev.problemConfig?.penaltyRate ?? 0.1,
            type: prev.problemConfig?.type || "",
          },
          mcqTestConfig: null,
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
                { value: "Problem", label: "Problem" },
              ]}
              value={formData.problemType || ""}
              onChange={(val) =>
                handleChange({ target: { name: "problemType", value: val } })
              }
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
        {formData.problemType === "Problem" && (
          <>
            <Label htmlFor="description">Description</Label>
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
            />

            <Label htmlFor="language">Language</Label>
            <TextFieldFluent
              id="language"
              value={formData.problemConfig?.language || ""}
              onChange={(e) =>
                handleNestedChange("problemConfig", "language", e.target.value)
              }
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

            <Label>Type</Label>
            <div className="flex gap-10">
              {["Manual", "AutoEvaluation"].map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer py-1"
                >
                  <input
                    type="radio"
                    name="problemConfigType"
                    value={opt}
                    checked={formData.problemConfig?.type === opt}
                    onChange={(e) =>
                      handleNestedChange(
                        "problemConfig",
                        "type",
                        e.target.value
                      )
                    }
                  />
                  <span className="text-sm leading-5 rounded-[5px]">{opt}</span>
                </label>
              ))}
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
                className={`${disabled ? "button-gray" : "button-orange"}`}
              >
                {isSubmitting
                  ? mode === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : mode === "edit"
                  ? "Save"
                  : "Create Round"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
