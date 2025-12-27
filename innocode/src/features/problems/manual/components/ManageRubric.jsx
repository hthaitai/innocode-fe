import React from "react"
import TableFluentScrollable from "@/shared/components/table/TableFluentScrollable"
import { getRubricColumns } from "../columns/getRubricColumns"
import {
  useDeleteCriterionMutation,
  useFetchRubricQuery,
} from "../../../../services/manualProblemApi"
import { useModal } from "@/shared/hooks/useModal"
import toast from "react-hot-toast"
import RubricToolbar from "./RubricToolbar"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../../shared/components/SpinnerFluent"

const ManageRubric = ({ roundId, contestId }) => {
  const { data, isLoading, isError } = useFetchRubricQuery(roundId)
  const criteria = data?.data?.criteria ?? []

  const [deleteCriterion] = useDeleteCriterionMutation()
  const { openModal } = useModal()

  const handleEdit = (criterion) => {
    openModal("rubric", {
      roundId,
      contestId,
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
            contestId,
          }).unwrap()
          toast.success("Criterion deleted successfully")
        } catch (err) {
          console.error("Failed to delete criterion", err)
          toast.error("Failed to delete criterion")
        } finally {
          onClose()
        }
      },
    })
  }

  const columns = getRubricColumns(handleEdit, handleDelete)
  const totalMaxScore = criteria.reduce((a, c) => a + c.maxScore, 0)

  if (isLoading) {
    return (
      <div className="min-h-[70px] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <AnimatedSection>
      <RubricToolbar
        openModal={openModal}
        roundId={roundId}
        contestId={contestId}
        criteria={criteria}
        totalMaxScore={totalMaxScore}
      />

      <TableFluentScrollable
        data={criteria}
        columns={columns}
        error={isError}
        expandAt="description"
        maxHeight={400}
      />
    </AnimatedSection>
  )
}

export default ManageRubric
