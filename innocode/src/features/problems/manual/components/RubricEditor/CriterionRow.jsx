import { Trash2 } from "lucide-react"
import TextFieldFluent from "../../../../../shared/components/TextFieldFluent"

const CriterionRow = ({ data, index, onChange, onDelete }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-3">
      {/* Description */}
      <div className="col-span-8">
        <TextFieldFluent
          multiline
          rows={1}
          value={data.description}
          placeholder={`Describe Criterion ${index + 1}`}
          onChange={(e) => onChange(index, "description", e.target.value)}
        />
      </div>

      {/* Max Score */}
      <div className="col-span-2">
        <TextFieldFluent
          type="number"
          min={0}
          value={data.maxScore}
          onChange={(e) => onChange(index, "maxScore", e.target.value)}
        />
      </div>

      {/* Delete */}
      <div className="col-span-2 flex justify-end">
        <button
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition"
          onClick={onDelete}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}

export default CriterionRow
