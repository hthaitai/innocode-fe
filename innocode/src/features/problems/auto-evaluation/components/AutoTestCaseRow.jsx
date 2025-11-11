import { Trash2 } from "lucide-react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"

const AutoTestCaseRow = ({ data, onChange, onDelete }) => {
  // data: { testCaseId, description, weight, timeLimitMs, memoryKb, input, expectedOutput }
  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-4">
      <div className="grid grid-cols-12 gap-3 items-start">
        {/* Description (spans full width above the row) */}
        <div className="col-span-12">
          <TextFieldFluent
            multiline
            rows={2}
            value={data.description ?? ""}
            placeholder="Description"
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>

        {/* Input */}
        <div className="col-span-4">
          <TextFieldFluent
            multiline
            rows={2}
            value={data.input ?? ""}
            placeholder="Input"
            onChange={(e) => onChange("input", e.target.value)}
          />
        </div>

        {/* Expected Output */}
        <div className="col-span-4">
          <TextFieldFluent
            multiline
            rows={2}
            value={data.expectedOutput ?? ""}
            placeholder="Expected Output"
            onChange={(e) => onChange("expectedOutput", e.target.value)}
          />
        </div>

        {/* Weight */}
        <div className="col-span-2">
          <TextFieldFluent
            type="number"
            min={0}
            value={data.weight ?? 1}
            onChange={(e) => onChange("weight", Number(e.target.value))}
          />
        </div>

        {/* Time / Memory */}
        <div className="col-span-2 flex flex-col items-end gap-2">
          <TextFieldFluent
            type="number"
            min={0}
            value={data.timeLimitMs ?? ""}
            placeholder="Time (ms)"
            onChange={(e) =>
              onChange("timeLimitMs", e.target.value ? Number(e.target.value) : null)
            }
          />
          <TextFieldFluent
            type="number"
            min={0}
            value={data.memoryKb ?? ""}
            placeholder="Memory (KB)"
            onChange={(e) =>
              onChange("memoryKb", e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <button
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition"
          onClick={onDelete}
        >
          <Trash2 size={18} />
          <span className="hidden md:inline">Delete</span>
        </button>
      </div>
    </div>
  )
}

export default AutoTestCaseRow
