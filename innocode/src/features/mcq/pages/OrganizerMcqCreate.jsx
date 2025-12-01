import React, { useState, useMemo, useCallback } from "react"
import PageContainer from "@/shared/components/PageContainer"
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
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useModal } from "../../../shared/hooks/useModal"

const OrganizerMcqCreate = () => {
  const { roundId, contestId } = useParams()
  const navigate = useNavigate()
  const { openModal } = useModal()

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
  const [selectedBanks, setSelectedBanks] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState([])

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

  // ===== HANDLERS FOR MODALS =====
  const handleUploadCsv = useCallback(() => {
    openModal("mcqCsv", { testId, onUpload: setUploadedQuestions })
  }, [openModal, testId])

  const handleImportBanks = useCallback(() => {
    openModal("mcqBank", { selectedBanks, setSelectedBanks })
  }, [openModal, selectedBanks])

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
      <QuestionsPreviewSection
        questions={allQuestions}
        selectedQuestions={selectedQuestions}
        setSelectedQuestions={setSelectedQuestions}
        loading={mcqLoading || banksLoading || createLoading}
        onChoose={handleChoose}
        onUploadCsv={handleUploadCsv}
        onImportBanks={handleImportBanks}
      />
    </PageContainer>
  )
}

export default OrganizerMcqCreate
