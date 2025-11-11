import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Pencil, Trash2 } from "lucide-react"

import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import Actions from "@/shared/components/Actions"
import { useOrganizerRound } from "@/features/round/hooks/useOrganizerRound"
import { useAppSelector } from "@/store/hooks"
import { useModal } from "@/shared/hooks/useModal"

import AutoTestCaseHeader from "../components/AutoTestCaseHeader"

import {
  fetchRoundTestCases,
  createRoundTestCase,
  updateRoundTestCases,
  deleteRoundTestCase,
} from "../store/autoEvaluationThunks"

const AutoEvaluationPage = () => {
  const dispatch = useDispatch()
  const { contestId, roundId } = useParams()
  const { openModal } = useModal()

  const { contests } = useAppSelector((s) => s.contests)
  const { round } = useOrganizerRound(contestId, roundId)
  const { loading, error, testCases, testCasePagination } = useSelector(
    (s) => s.autoEvaluation
  )

  // Local page state — same pattern as OrganizerContests
  const page = testCasePagination.pageNumber
  const pageSize = testCasePagination.pageSize

  const setPage = useCallback(
    (newPage) => {
      dispatch(fetchRoundTestCases({ roundId, pageNumber: newPage, pageSize }))
    },
    [dispatch, roundId, pageSize]
  )

  useEffect(() => {
    if (roundId) {
      dispatch(fetchRoundTestCases({ roundId, pageNumber: page, pageSize }))
    }
  }, [dispatch, roundId, page, pageSize])

  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )

  const breadcrumbItems = useMemo(
    () => [
      "Contests",
      contest?.name ?? "Contest",
      round?.name ?? "Round",
      "Auto Test Cases",
    ],
    [contest?.name, round?.name]
  )

  const refreshPage = () =>
    dispatch(fetchRoundTestCases({ roundId, pageNumber: page, pageSize }))

  const handleTestCaseModal = (mode, testCase = {}) => {
    openModal("autoTestCase", {
      mode,
      initialData: { ...testCase },
      onSubmit: async (data) => {
        if (mode === "create") {
          await dispatch(createRoundTestCase({ roundId, payload: data }))
        } else {
          await dispatch(
            updateRoundTestCases({
              roundId,
              testCases: [{ ...data, testCaseId: testCase.testCaseId }],
            })
          )
        }
        refreshPage()
      },
    })
  }

  const handleDeleteTestCase = (testCase) => {
    openModal("confirmDelete", {
      type: "test case",
      item: testCase,
      onConfirm: async (onClose) => {
        await dispatch(
          deleteRoundTestCase({ roundId, testCaseId: testCase.testCaseId })
        )
        onClose()
        refreshPage()
      },
    })
  }

  const columns = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-md truncate" title={row.original.description}>
          {row.original.description || "—"}
        </div>
      ),
    },
    {
      accessorKey: "input",
      header: "Input",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.input}>
          {row.original.input || "—"}
        </div>
      ),
    },
    {
      accessorKey: "expectedOutput",
      header: "Expected Output",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.expectedOutput}>
          {row.original.expectedOutput || "—"}
        </div>
      ),
    },
    { accessorKey: "weight", header: "Weight" },
    { accessorKey: "timeLimitMs", header: "Time (ms)" },
    { accessorKey: "memoryKb", header: "Memory (KB)" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Actions
          row={row.original}
          items={[
            {
              label: "Edit",
              icon: Pencil,
              onClick: () => handleTestCaseModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteTestCase(row.original),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <PageContainer breadcrumb={breadcrumbItems}>
      <AutoTestCaseHeader
        testCases={testCases}
        loading={loading}
        onCreate={() => handleTestCaseModal("create")}
      />

      <div className="mt-1">
        <TableFluent
          data={testCases}
          columns={columns}
          loading={loading}
          error={error}
          pagination={testCasePagination} // ✅ shows current page properly
          onPageChange={setPage} // ✅ same behavior as OrganizerContests
        />
      </div>
    </PageContainer>
  )
}

export default AutoEvaluationPage
