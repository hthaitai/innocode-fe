import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useModal } from "@/shared/hooks/useModal"
import TableFluent from "@/shared/components/TableFluent"
import getTestCaseColumns from "../columns/getTestCaseColumns"
import { toast } from "react-hot-toast"

import {
  useGetRoundTestCasesQuery,
  useCreateRoundTestCaseMutation,
  useDeleteRoundTestCaseMutation,
} from "../../../../services/autoEvaluationApi"
import TestCaseActions from "./TestCaseActions"

const TestCaseTable = ({ contestId, roundId, roundLoading }) => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)

  // Fetch test cases
  const {
    data: testCaseResponse,
    isLoading,
    isError,
    refetch,
  } = useGetRoundTestCasesQuery({ roundId, pageNumber, pageSize })

  const testCases = testCaseResponse?.data ?? []
  const pagination = testCaseResponse?.additionalData ?? {}

  const [deleteTestCase] = useDeleteRoundTestCaseMutation()

  // Open modal for delete confirmation
  const handleDeleteTestCase = (testCase) => {
    openModal("confirmDelete", {
      type: "test case",
      item: testCase,
      message: `Are you sure you want to delete "${testCase.description}"?`,
      onConfirm: async (close) => {
        try {
          await deleteTestCase({
            roundId,
            testCaseId: testCase.testCaseId,
            contestId,
          }).unwrap()
          toast.success("Test case deleted")
          refetch()
        } catch (err) {
          toast.error("Failed to delete test case")
        } finally {
          close()
        }
      },
    })
  }

  // Navigate to create page
  const handleCreateTestCase = () => {
    navigate(
      `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/new`
    )
  }

  // Navigate to edit page
  const handleEditTestCase = (testCase) => {
    navigate(
      `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/${testCase.testCaseId}/edit`
    )
  }

  const columns = getTestCaseColumns(handleEditTestCase, handleDeleteTestCase)

  return (
    <div>
      <TableFluent
        data={testCases}
        columns={columns}
        loading={isLoading}
        error={isError}
        pagination={pagination}
        onPageChange={setPageNumber}
        renderActions={() => (
          <TestCaseActions
            onCreate={handleCreateTestCase}
            isLoading={isLoading || roundLoading}
            openModal={openModal}
            roundId={roundId}
            contestId={contestId}
          />
        )}
      />
    </div>
  )
}

export default TestCaseTable
