import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useModal } from "@/shared/hooks/useModal"
import TableFluent from "@/shared/components/TableFluent"
import getTestCaseColumns from "../columns/getTestCaseColumns"
import { toast } from "react-hot-toast"

import {
  useGetRoundTestCasesQuery,
  useDeleteRoundTestCaseMutation,
} from "../../../../services/autoEvaluationApi"
import TestCaseToolbar from "./TestCaseToolbar"
import TablePagination from "../../../../shared/components/TablePagination"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const ManageTestCases = ({ contestId, roundId }) => {
  const navigate = useNavigate()
  const { openModal } = useModal()

  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  // Fetch test cases
  const {
    data: testCaseData,
    isLoading,
    isError,
  } = useGetRoundTestCasesQuery({ roundId, pageNumber, pageSize })

  const testCases = testCaseData?.data ?? []
  const pagination = testCaseData?.additionalData

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
        } catch (err) {
          console.error(err)
          toast.error("Failed to delete test case")
        } finally {
          close()
        }
      },
    })
  }

  const handleUploadCsv = () => {
    openModal("testCaseCsv", { roundId, contestId })
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

  if (isLoading) {
    return (
      <div className="min-h-[70px] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <AnimatedSection>
      <TestCaseToolbar
        onUploadCsv={handleUploadCsv}
        onCreate={handleCreateTestCase}
      />

      <TableFluent data={testCases} columns={columns} error={isError} />

      {pagination && (
        <TablePagination pagination={pagination} onPageChange={setPageNumber} />
      )}
    </AnimatedSection>
  )
}

export default ManageTestCases
