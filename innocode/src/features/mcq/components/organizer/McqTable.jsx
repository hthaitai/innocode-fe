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
  const pagination = useMemo(() => {
    const test = mcqData?.data?.mcqTest
    if (!test) return null

    const currentPage = test.currentPage ?? 1
    const totalPages = test.totalPages ?? 1
    const pageSize = test.pageSize ?? test.questions?.length ?? 10
    const totalCount = test.totalQuestions ?? test.questions?.length ?? 0

    return {
      pageNumber: currentPage, // Current page
      pageSize, // Items per page
      totalCount, // Total items
      totalPages, // Total pages
      hasPreviousPage: currentPage > 1, // Enable prev button
      hasNextPage: currentPage < totalPages, // Enable next button
    }
  }, [mcqData])
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
      {/* Add Button / Header */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Calendar size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">MCQ Management</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Create and manage MCQs for this contest
            </p>
          </div>
        </div>
        <button
          className="button-orange"
          onClick={() =>
            navigate(
              `/organizer/contests/${contestId}/rounds/${roundId}/mcqs/new`
            )
          }
        >
          Add questions
        </button>
      </div>

      {/* Table */}
      <TableFluent
        data={mcqsWithIndex}
        columns={columns}
        loading={isLoading}
        error={isError}
        pagination={pagination}
        onPageChange={setPage}
        renderSubComponent={(mcq) => <McqTableExpanded mcq={mcq} />}
        expandAt="text"
      />
    </div>
  )
}

export default McqTable
