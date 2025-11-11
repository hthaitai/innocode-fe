import RubricHeader from "./RubricHeader"
import CriterionRow from "./CriterionRow"

const RubricEditor = ({
  rubric,
  criteria,
  setCriteria,
  loadingRubric,
  savingRubric,
  saveRubric,
  roundId,
  onDeleteCriterion,
  onRefresh,
}) => {
  const handleField = (i, field, value) => {
    setCriteria(
      criteria.map((c, idx) =>
        idx === i
          ? { ...c, [field]: field === "maxScore" ? Number(value || 0) : value }
          : c
      )
    )
  }

  const addRow = () =>
    setCriteria([
      ...criteria,
      { rubricId: undefined, description: "", maxScore: 1 },
    ])
  const handleDelete = (rubricId, index) =>
    rubricId
      ? onDeleteCriterion(rubricId)
      : setCriteria(criteria.filter((_, i) => i !== index))

  return (
    <div className="space-y-1">
      <RubricHeader
        rubric={rubric}
        loadingRubric={loadingRubric}
        savingRubric={savingRubric}
        saveRubric={saveRubric}
        onRefresh={onRefresh}
      />

      <div className="space-y-1">
        {criteria.map((c, idx) => (
          <div
            key={c.rubricId ?? `new-${idx}`}
            className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 min-h-[70px] flex items-center"
          >
            <CriterionRow
              data={c}
              index={idx}
              roundId={roundId}
              onChange={handleField}
              onDelete={() => handleDelete(c.rubricId, idx)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button className="button-white" onClick={addRow}>
          + Add Criterion
        </button>
      </div>
    </div>
  )
}

export default RubricEditor
