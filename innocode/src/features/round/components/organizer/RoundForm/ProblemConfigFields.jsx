import React from "react"
import TextFieldFluent from "../../../../../shared/components/TextFieldFluent"

const ProblemConfigFields = ({ problemConfig, handleNestedChange }) => {
  return (
    <div className="space-y-3">
      <TextFieldFluent
        label="Description"
        value={problemConfig?.description || ""}
        onChange={(e) =>
          handleNestedChange("problemConfig", "description", e.target.value)
        }
      />
      <TextFieldFluent
        label="Language"
        value={problemConfig?.language || ""}
        onChange={(e) =>
          handleNestedChange("problemConfig", "language", e.target.value)
        }
      />
      <TextFieldFluent
        label="Penalty Rate"
        type="number"
        value={problemConfig?.penaltyRate ?? 0.1}
        onChange={(e) =>
          handleNestedChange(
            "problemConfig",
            "penaltyRate",
            parseFloat(e.target.value)
          )
        }
      />

      {/* Type display - synchronized with problemType */}
      <div className="mt-3">
        <label className="text-xs leading-4 capitalize">Type</label>
        <div className="flex gap-10">
          {["Manual", "AutoEvaluation"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="radio"
                name="problemConfigType"
                value={opt}
                checked={problemConfig?.type === opt}
                onChange={(e) =>
                  handleNestedChange("problemConfig", "type", e.target.value)
                }
                className="#E05307"
              />
              <span className="text-sm leading-5 rounded-[5px]">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProblemConfigFields
