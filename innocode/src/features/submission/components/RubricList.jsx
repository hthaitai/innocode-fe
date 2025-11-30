import { Loader2 } from "lucide-react"
import RubricItem from "./RubricItem"

export default function RubricList({
  rubric,
  scores,
  evaluating,
  onScoreChange,
  onSubmit,
  errors,
}) {
  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">Rubric</div>

      <div className="space-y-1">
        {rubric.map((c, idx) => (
          <RubricItem
            key={c.rubricId}
            index={idx}
            item={c}
            scoreObj={scores.find((s) => s.rubricId === c.rubricId)}
            onChange={onScoreChange}
            error={errors[c.rubricId]}
          />
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onSubmit}
          disabled={evaluating}
          className={`flex items-center gap-2 justify-center ${
            evaluating ? "button-gray" : "button-orange"
          }`}
        >
          {evaluating && <Loader2 className="animate-spin w-4 h-4" />}
          {evaluating ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  )
}
