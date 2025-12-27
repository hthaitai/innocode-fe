import React, { useState, useMemo, useCallback } from "react"
import { useParams } from "react-router-dom"

import TableFluent from "@/shared/components/TableFluent"
import McqTableExpanded from "./McqTableExpanded"

import { useModalContext } from "@/context/ModalContext"
import { getMcqColumns } from "../../columns/getMcqColumns"

import {
  useGetRoundMcqsQuery,
  useUpdateQuestionWeightMutation,
} from "../../../../services/mcqApi"

import { toast } from "react-hot-toast"
import McqTableToolbar from "./McqTableToolbar"
import TablePagination from "../../../../shared/components/TablePagination"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const ManageMcqs = ({ mcqs, pagination, setPage, testId }) => {
  const { openModal } = useModalContext()
  const [updateQuestionWeight] = useUpdateQuestionWeightMutation()

  /** Edit weight action */
  const handleEditWeight = useCallback(
    (question) => {
      if (!testId) return toast.error("Test ID not available")

      openModal("mcqWeight", {
        question,
        testId,
        onSubmit: async ({ testId, questionId, weight }) => {
          try {
            await updateQuestionWeight({
              testId,
              questions: [{ questionId, weight }],
            }).unwrap()

            toast.success("Question weight updated successfully!")
          } catch (err) {
            toast.error(
              err?.Message || err?.message || "Failed to update weight"
            )
            throw err
          }
        },
      })
    },
    [testId, updateQuestionWeight, openModal]
  )

  /** Table Columns */
  const columns = getMcqColumns(handleEditWeight)

  return (
    <div>
      <McqTableToolbar />

      <TableFluent
        data={mcqs}
        columns={columns}
        renderSubComponent={(mcq) => <McqTableExpanded mcq={mcq} />}
        expandAt="text"
        getRowId={(row) => row.questionId}
      />

      <TablePagination pagination={pagination} onPageChange={setPage} />
    </div>
  )
}

export default ManageMcqs
