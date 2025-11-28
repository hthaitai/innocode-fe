import React, { useState, useMemo, useCallback } from "react"
import PageContainer from "@/shared/components/PageContainer"
import CsvImportSection from "../components/organizer/CsvImportSection"
import BankTable from "../components/organizer/BankTable"
import QuestionsPreviewSection from "../components/organizer/QuestionsPreviewSection"

import {
  useGetRoundMcqsQuery,
  useGetBanksQuery,
  useCreateTestMutation,
} from "@/services/mcqApi"

import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { getPreviewColumns } from "../columns/getPreviewColumns"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const OrganizerMcqCreate = () => {
  const { roundId, contestId } = useParams()
  const navigate = useNavigate()

  // ===== RTK QUERY HOOKS =====
  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
  } = useGetRoundByIdQuery(roundId)

  const {
    data: mcqData,
    isLoading: mcqLoading,
    isError: mcqError,
  } = useGetRoundMcqsQuery({ roundId, pageNumber: 1, pageSize: 10 })

  const {
    data: banks,
    isLoading: banksLoading,
    isError: banksError,
  } = useGetBanksQuery({})

  const [createTest, { isLoading: createLoading }] = useCreateTestMutation()

  const testId = mcqData?.data?.mcqTest?.testId

  // ===== LOCAL STATE =====
  const [uploadedQuestions, setUploadedQuestions] = useState([])
  const [selectedBanks, setSelectedBanks] = useState([]) // ✅ array of bank objects
  const [selectedQuestions, setSelectedQuestions] = useState([])

  const columns = useMemo(() => getPreviewColumns(), [])

  // ===== QUESTIONS FROM UPLOAD =====
  const questionsFromUpload = useMemo(
    () =>
      uploadedQuestions.map((q, i) => ({
        ...q,
        displayId: i + 1,
        optionsCount: q.options?.length || 0,
      })),
    [uploadedQuestions]
  )

  // ===== QUESTIONS FROM BANK =====
  const questionsFromBanks = useMemo(() => {
    return selectedBanks.flatMap((bank) =>
      (bank.questions || []).map((q, i) => ({
        ...q,
        displayId: i + 1,
        optionsCount: q.options?.length || 0,
      }))
    )
  }, [selectedBanks])

  // ===== COMBINED =====
  const allQuestions = useMemo(() => {
    return [...questionsFromUpload, ...questionsFromBanks]
  }, [questionsFromUpload, questionsFromBanks])

  // ===== HANDLE CHOOSE QUESTIONS =====
  const handleChoose = useCallback(async () => {
    if (!testId) return toast.error("Test not initialized.")
    if (!selectedQuestions.length) return toast.error("No questions selected.")

    try {
      // Extract question IDs only
      const questionIds = selectedQuestions.map((q) => q.questionId)

      await createTest({ testId, questionIds, contestId }).unwrap()

      toast.success("Selected questions added to the test successfully")
      navigate(`/organizer/contests/${contestId}/rounds/${roundId}/mcqs`)
    } catch (err) {
      console.error("Failed to add questions:", err)
      toast.error(err?.Message || "Failed to add questions")
    }
  }, [selectedQuestions, testId, createTest, roundId, contestId, navigate])

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_MCQ_NEW(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_NEW(
    round?.contestId,
    roundId
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={roundLoading}
      error={roundError}
    >
      <div className="space-y-5">
        {/* CSV Upload Section */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">
            Import questions
          </div>

          <div className="space-y-5">
            <CsvImportSection testId={testId} onUpload={setUploadedQuestions} />

            {/* Bank Selector */}
            <BankTable
              selectedBanks={selectedBanks}
              setSelectedBanks={setSelectedBanks}
            />
          </div>
        </div>

        {/* Questions Preview Section */}
        <QuestionsPreviewSection
          questions={allQuestions}
          columns={columns}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          loading={mcqLoading || banksLoading || createLoading}
          onChoose={handleChoose}
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerMcqCreate
