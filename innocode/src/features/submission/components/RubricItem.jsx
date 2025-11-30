import Label from "../../../shared/components/form/Label"
import TextFieldFluent from "../../../shared/components/TextFieldFluent"

export default function RubricItem({ index, item, scoreObj, onChange, error }) {
  return (
    <div
      className={`border rounded-[5px] text-sm leading-5 bg-white ${
        error?.score || error?.note ? "border-red-500" : "border-[#E5E5E5]"
      }`}
    >
      {/* Question with bottom border */}
      <div className="border-b border-[#E5E5E5] p-5 min-h-[70px] flex items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-[#E05307]">
              Criteria {index + 1}
            </span>
            <span className="text-[#7A7574]">({item.maxScore} points)</span>
          </div>
          <p>{item.description}</p>
        </div>
      </div>
      {/* Input fields */}
      <div className="p-5 grid grid-cols-[max-content_1fr] gap-x-[28px] gap-y-5 items-start">
        <Label htmlFor={`score-${item.rubricId}`}>Score</Label>
        <TextFieldFluent
          id={`score-${item.rubricId}`}
          type="number"
          value={scoreObj?.score || 0}
          onChange={(e) =>
            onChange(item.rubricId, "score", Number(e.target.value))
          }
          style={{ width: "80px" }}
        />

        <Label htmlFor={`note-${item.rubricId}`}>Note</Label>
        <TextFieldFluent
          id={`note-${item.rubricId}`}
          value={scoreObj?.note || ""}
          multiline
          rows={6}
          placeholder="Add a note..."
          onChange={(e) => onChange(item.rubricId, "note", e.target.value)}
        />
      </div>
    </div>
  )
}
