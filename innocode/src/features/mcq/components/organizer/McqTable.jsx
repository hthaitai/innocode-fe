import React, { useState, useMemo, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import TableFluent from "@/shared/components/TableFluent"
import McqTableExpanded from "./McqTableExpanded"

import { useModalContext } from "@/context/ModalContext"
import { getMcqColumns } from "../../columns/getMcqColumns"

import {
  useGetRoundMcqsQuery,
  useUpdateQuestionWeightMutation,
} from "../../../../services/mcqApi"

import { toast } from "react-hot-toast"
import { Calendar } from "lucide-react"
import McqTableActions from "./McqTableActions"

const McqTable = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()
  const { openModal } = useModalContext()

  const [page, setPage] = useState(1)
  const pageSize = 10

  /** Fetch MCQs via RTK Query */
  const {
    data: mcqData,
    isLoading,
    isError,
  } = useGetRoundMcqsQuery(
    { roundId, pageNumber: page, pageSize },
    { skip: !roundId }
  )

  const mcqs = mcqData?.data?.mcqTest?.questions || []
  const pagination = {
    currentPage: mcqData?.data?.mcqTest?.currentPage || 1,
    pageSize: mcqData?.data?.mcqTest?.pageSize || 10,
    totalPages: mcqData?.data?.mcqTest?.totalPages || 0,
    totalQuestions: mcqData?.data?.mcqTest?.totalQuestions || 0,
    hasPreviousPage: (mcqData?.data?.mcqTest?.currentPage || 1) > 1,
    hasNextPage:
      (mcqData?.data?.mcqTest?.currentPage || 1) <
      (mcqData?.data?.mcqTest?.totalPages || 0),
  }
  const testId = mcqData?.data?.mcqTest?.testId

  /** Edit MCQ weight mutation */
  const [updateQuestionWeight] = useUpdateQuestionWeightMutation()

  /** Add row index like old code */
  const mcqsWithIndex = useMemo(() => {
    const start = (page - 1) * pageSize
    return mcqs.map((q, i) => ({
      ...q,
      displayId: start + i + 1,
    }))
  }, [mcqs, page])

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
  const columns = useMemo(
    () => getMcqColumns(handleEditWeight),
    [handleEditWeight]
  )

  return (
    <div className="space-y-1">
      <TableFluent
        data={mcqsWithIndex}
        columns={columns}
        loading={isLoading}
        error={isError}
        pagination={pagination}
        onPageChange={setPage}
        renderActions={() => <McqTableActions />}
        renderSubComponent={(mcq) => <McqTableExpanded mcq={mcq} />}
        expandAt="Question"
      />
    </div>
  )
}

export default McqTable
