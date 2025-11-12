import React, { useMemo, useCallback } from "react"
import TableFluent from "@/shared/components/TableFluent"
import RubricTableHeader from "./RubricTableHeader"
import { getRubricColumns } from "../columns/getRubricColumns"
import { useAppDispatch } from "@/store/hooks"
import { deleteCriterion, saveRubric } from "../store/manualProblemThunks"
import { setCriteria } from "../store/manualProblemSlice"
import { useModal } from "@/shared/hooks/useModal"

const RubricEditor = ({
  rubric,
  criteria,
  setCriteria,
  loadingRubric,
  savingRubric,
  roundId,
}) => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  // --- Update field inline (rarely used now but kept)
  const handleField = useCallback(
    (i, field, value) => {
      setCriteria(
        criteria.map((c, idx) =>
          idx === i
            ? {
                ...c,
                [field]: field === "maxScore" ? Number(value || 0) : value,
              }
            : c
        )
      )
    },
    [criteria, setCriteria]
  )

  // --- Delete criterion (persisted)
  const handleDelete = useCallback(
    async (rubricId, index) => {
      if (rubricId) {
        await dispatch(deleteCriterion({ roundId, rubricId }))
      } else {
        const updated = criteria.filter((_, i) => i !== index)
        dispatch(setCriteria(updated))
        await dispatch(saveRubric({ roundId, criteria: updated }))
      }
    },
    [criteria, dispatch, roundId]
  )

  // --- Table data + columns
  const tableData = useMemo(
    () =>
      criteria.map((c, idx) => ({
        ...c,
        questionId: c.rubricId ?? `new-${idx}`,
      })),
    [criteria]
  )

  const columns = useMemo(
    () =>
      getRubricColumns(
        handleField,
        handleDelete,
        criteria,
        roundId,
        openModal // ✅ passed in safely
      ),
    [handleField, handleDelete, criteria, roundId, openModal]
  )

  return (
    <div className="space-y-1">
      <RubricTableHeader
        rubric={rubric}
        loadingRubric={loadingRubric}
        savingRubric={savingRubric}
        roundId={roundId}
        criteria={criteria}
      />
      <TableFluent
        data={tableData}
        columns={columns}
        loading={loadingRubric}
        error={null}
      />
    </div>
  )
}

export default RubricEditor
