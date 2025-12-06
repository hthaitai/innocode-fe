import React, { useMemo } from "react"
import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getRubricColumns } from "../columns/getRubricColumns"
import {
  useDeleteCriterionMutation,
  useFetchRubricTemplateQuery,
} from "../../../../services/manualProblemApi"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import RubricActions from "./RubricActions"

const RubricTable = ({ roundId, criteria = [], loadingRubric }) => {
  const [deleteCriterion] = useDeleteCriterionMutation()
  const { openModal } = useModal()
  const { data: templateUrl } = useFetchRubricTemplateQuery() // Optional if modal fetches itself

  const savingRubric = false // Only needed if you want to disable "Add Criterion" button during some action

  const handleEdit = (criterion) => {
    openModal("rubric", {
      roundId,
      criteria,
      initialData: criterion,
    })
  }

  const handleDelete = (criterion) => {
    openModal("confirmDelete", {
      type: "Criterion",
      item: { id: criterion.rubricId, name: criterion.description },
      message: `Are you sure you want to delete "${criterion.description}"?`,
      onConfirm: async (onClose) => {
        try {
          await deleteCriterion({
            roundId,
            rubricId: criterion.rubricId,
          }).unwrap()
          toast.success("Criterion deleted successfully")
          onClose()
        } catch (err) {
          console.error("Failed to delete criterion", err)
          toast.error("Failed to delete criterion")
        }
      },
    })
  }

  const tableData = useMemo(
    () =>
      criteria.map((c, idx) => ({
        ...c,
        questionId: c.rubricId ?? `new-${idx}`,
      })),
    [criteria]
  )
  const columns = getRubricColumns(handleEdit, handleDelete)

  const totalMaxScore = criteria.reduce((a, c) => a + c.maxScore, 0)

  return (
    <div>
      <TableFluentScrollable
        data={tableData}
        columns={columns}
        loading={loadingRubric}
        error={null}
        expandAt="description"
        maxHeight={400}
        renderActions={() => (
          <RubricActions
            openModal={openModal}
            roundId={roundId}
            criteria={criteria}
            savingRubric={savingRubric}
            totalMaxScore={totalMaxScore}
          />
        )}
      />
    </div>
  )
}

export default RubricTable
