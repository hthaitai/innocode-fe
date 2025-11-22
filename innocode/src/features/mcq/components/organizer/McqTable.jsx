// src/features/mcq/components/organizer/McqTable.jsx

import React, { useMemo, useEffect, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import TableFluent from "@/shared/components/TableFluent"
import McqTableAdd from "./McqTableAdd"
import McqTableExpanded from "./McqTableExpanded"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useModalContext } from "@/context/ModalContext"

import { getMcqColumns } from "../../columns/getMcqColumns"

import {
  fetchRoundMcqs,
  updateQuestionWeights,
} from "@/features/mcq/store/mcqThunk"
import { clearMcqs } from "@/features/mcq/store/mcqSlice"
import { toast } from "react-hot-toast"

const McqTable = () => {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()
  const dispatch = useAppDispatch()
  const { openModal } = useModalContext()

  const { mcqs, loading, error, testId, pagination } = useAppSelector(
    (s) => s.mcq
  )

  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => setPage(1), [roundId])

  // Load MCQs
  useEffect(() => {
    if (!roundId) return
    dispatch(fetchRoundMcqs({ roundId, pageNumber: page, pageSize }))

    return () => dispatch(clearMcqs())
  }, [dispatch, roundId, page, pageSize])

  // Add row index
  const mcqsWithIndex = useMemo(() => {
    const startIndex = (page - 1) * pageSize

    return (
      mcqs?.map((q, i) => ({
        ...q,
        displayId: startIndex + i + 1,
      })) || []
    )
  }, [mcqs, page])

  // Edit weight
  const handleEditWeight = useCallback(
    (question) => {
      if (!testId) return toast.error("Test ID not available")

      openModal("mcqWeight", {
        question,
        testId,
        onSubmit: async ({ testId, questionId, weight }) => {
          try {
            await dispatch(
              updateQuestionWeights({
                testId,
                weights: [{ questionId, weight }],
              })
            ).unwrap()

            toast.success("Question weight updated successfully!")

            if (roundId)
              dispatch(
                fetchRoundMcqs({ roundId, pageNumber: page, pageSize })
              )
          } catch (err) {
            toast.error(
              err?.Message || err?.message || "Failed to update weight"
            )
            throw err
          }
        },
      })
    },
    [testId, openModal, dispatch, roundId, page, pageSize]
  )

  const columns = useMemo(
    () => getMcqColumns(handleEditWeight),
    [handleEditWeight]
  )

  return (
    <div className="space-y-1">
      <McqTableAdd
        onAdd={() =>
          navigate(
            `/organizer/contests/${contestId}/rounds/${roundId}/mcqs/new`
          )
        }
      />

      <TableFluent
        data={mcqsWithIndex}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        renderSubComponent={(mcq) => <McqTableExpanded mcq={mcq} />}
        expandAt="text"
      />
    </div>
  )
}

export default McqTable
