import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

export default function RoundForm({
  formData,
  setFormData,
  errors = {},
  setErrors,
  contest,
  existingRounds = [],
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors?.[name]) {
      setErrors?.((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }

  const handleProblemTypeChange = (e) => {
    const value = e.target.value
    setFormData((prev) => {
      const newData = { ...prev, problemType: value }

      if (value === "McqTest") {
        newData.mcqTestConfig = {
          name: prev.mcqTestConfig?.name || "",
          config: "temporary-config",
        }
        delete newData.problemConfig
      } else {
        newData.problemConfig = {
          description: "",
          language: "",
          penaltyRate: 0.1,
          type: value === "Manual" ? "Manual" : "AutoEvaluation",
        }
        delete newData.mcqTestConfig
      }

      return newData
    })
  }

  const validateTimes = () => {
    const { start, end } = formData
    if (!contest) return

    const contestStart = new Date(contest.start)
    const contestEnd = new Date(contest.end)
    const s = new Date(start)
    const e = new Date(end)

    if (s < contestStart || e > contestEnd) {
      setErrors((prev) => ({
        ...prev,
        start: "Round must be within contest time.",
      }))
    }

    const overlap = existingRounds.some((r) => {
      const rs = new Date(r.start)
      const re = new Date(r.end)
      return s < re && e > rs
    })
    if (overlap) {
      setErrors((prev) => ({
        ...prev,
        start: "Round time overlaps another round.",
      }))
    }
  }

  return (
    <form className="flex flex-col gap-3" onBlur={validateTimes}>
      <TextFieldFluent
        label="Round Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextFieldFluent
        label="Start"
        name="start"
        type="datetime-local"
        value={formData.start || ""}
        onChange={handleChange}
        error={!!errors.start}
        helperText={errors.start}
      />

      <TextFieldFluent
        label="End"
        name="end"
        type="datetime-local"
        value={formData.end || ""}
        onChange={handleChange}
        error={!!errors.end}
        helperText={errors.end}
      />

      {/* Problem Type Selection */}
      <div>
        <label className="font-semibold">Problem Type</label>
        <select
          name="problemType"
          value={formData.problemType || ""}
          onChange={handleProblemTypeChange}
          className="border rounded p-2 w-full"
        >
          <option value="">Select Type</option>
          <option value="McqTest">McqTest</option>
          <option value="AutoEvaluation">AutoEvaluation</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Conditionally Render Config Section */}
      {formData.problemType === "McqTest" && (
        <div className="border p-3 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">MCQ Test Config</h3>
          <TextFieldFluent
            label="Config Name"
            value={formData.mcqTestConfig?.name || ""}
            onChange={(e) =>
              handleNestedChange("mcqTestConfig", "name", e.target.value)
            }
          />
          <TextFieldFluent
            label="Config"
            value={formData.mcqTestConfig?.config || ""}
            onChange={(e) =>
              handleNestedChange("mcqTestConfig", "config", e.target.value)
            }
          />
        </div>
      )}

      {formData.problemType !== "McqTest" && formData.problemType && (
        <div className="border p-3 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Problem Config</h3>
          <TextFieldFluent
            label="Description"
            value={formData.problemConfig?.description || ""}
            onChange={(e) =>
              handleNestedChange("problemConfig", "description", e.target.value)
            }
          />
          <TextFieldFluent
            label="Language"
            value={formData.problemConfig?.language || ""}
            onChange={(e) =>
              handleNestedChange("problemConfig", "language", e.target.value)
            }
          />
          <TextFieldFluent
            label="Penalty Rate"
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
          <TextFieldFluent
            label="Type"
            value={formData.problemConfig?.type || ""}
            onChange={(e) =>
              handleNestedChange("problemConfig", "type", e.target.value)
            }
          />
        </div>
      )}
    </form>
  )
}
