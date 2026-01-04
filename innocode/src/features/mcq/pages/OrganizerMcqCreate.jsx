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
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"
import { useTranslation } from "react-i18next"

const OrganizerMcqCreate = () => {
  const { t } = useTranslation(["common"])
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
  } = useGetRoundMcqsQuery({ roundId })

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
    if (!testId) return toast.error(t("common.testNotInitialized"))
    if (!selectedQuestions.length)
      return toast.error(t("common.noQuestionsSelected"))

    try {
      // Extract question IDs only
      const questionIds = selectedQuestions.map((q) => q.questionId)

      await createTest({ testId, questionIds, contestId }).unwrap()

      toast.success(t("common.selectedQuestionsAdded"))
      navigate(`/organizer/contests/${contestId}/rounds/${roundId}/mcqs`)
    } catch (err) {
      console.error("Failed to add questions:", err)
      toast.error(err?.Message || t("common.failedToAddQuestions"))
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
    round?.contestName ?? t("common.contest"),
    round?.roundName ?? t("common.round")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_NEW(
    round?.contestId,
    roundId
  )

  if (roundLoading || mcqLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (roundError || mcqError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.mcqTest")} />
      </PageContainer>
    )
  }

  if (!round) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName={t("common.round")} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <QuestionsPreviewSection
          questions={allQuestions}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          loading={mcqLoading || createLoading}
          onChoose={handleChoose}
          onUploadCsv={handleUploadCsv}
          onImportBanks={handleImportBanks}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerMcqCreate
