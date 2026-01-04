import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useModal } from "@/shared/hooks/useModal"
import TableFluent from "@/shared/components/TableFluent"
import getTestCaseColumns from "../columns/getTestCaseColumns"
import { toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"

import {
  useGetRoundTestCasesQuery,
  useDeleteRoundTestCaseMutation,
} from "../../../../services/autoEvaluationApi"
import TestCaseToolbar from "./TestCaseToolbar"
import TablePagination from "../../../../shared/components/TablePagination"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const ManageTestCases = ({
  contestId,
  roundId,
  testCases,
  pagination,
  setPage,
}) => {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const { openModal } = useModal()
  const [deleteTestCase] = useDeleteRoundTestCaseMutation()

  // Open modal for delete confirmation
  const handleDeleteTestCase = (testCase) => {
    openModal("confirmDelete", {
      type: "test case",
      item: testCase,
      message: t("common.deleteTestCaseConfirmMessage", {
        name: testCase.description,
      }),
      title: t("common.deleteTestCaseConfirmTitle"),
      onConfirm: async (close) => {
        try {
          await deleteTestCase({
            roundId,
            testCaseId: testCase.testCaseId,
            contestId,
          }).unwrap()
          toast.success(t("common.testCaseDeletedSuccess"))
        } catch (err) {
          console.error(err)
          toast.error(t("common.failedToDeleteTestCase"))
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

  const columns = getTestCaseColumns(
    t,
    handleEditTestCase,
    handleDeleteTestCase
  )

  return (
    <div>
      <TestCaseToolbar
        onUploadCsv={handleUploadCsv}
        onCreate={handleCreateTestCase}
      />

      <TableFluent data={testCases} columns={columns} />

      {pagination && (
        <TablePagination pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  )
}

export default ManageTestCases
