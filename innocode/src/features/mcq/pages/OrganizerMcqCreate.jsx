import React, { useState, useMemo, useCallback } from "react"
import { validate as uuidValidate } from "uuid"
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
import { useGetContestByIdQuery } from "@/services/contestApi"
import { isFetchError } from "@/shared/utils/apiUtils"

const OrganizerMcqCreate = () => {
  const { t } = useTranslation(["common", "errors", "contest"])
  const { roundId, contestId } = useParams()
  const navigate = useNavigate()
  const { openModal } = useModal()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  // ===== RTK QUERY HOOKS =====
  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: round,
    isLoading: roundLoading,
    isError: roundError,
    error: roundErrorObj,
  } = useGetRoundByIdQuery(roundId, { skip: !isValidRoundId })

  const {
    data: mcqData,
    isLoading: mcqLoading,
    isError: mcqError,
  } = useGetRoundMcqsQuery({ roundId }, { skip: !isValidRoundId })

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
    [uploadedQuestions],
  )

  // ===== QUESTIONS FROM BANK =====
  const questionsFromBanks = useMemo(() => {
    return selectedBanks.flatMap((bank) =>
      (bank.questions || []).map((q, i) => ({
        ...q,
        displayId: i + 1,
        optionsCount: q.options?.length || 0,
      })),
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

      if (isFetchError(err)) {
        toast.error(t("contest:suggestion.connectionError"))
        return
      }

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

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || roundError
  const hasError = hasContestError || hasRoundError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_MCQ_NEW(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_MCQ_NEW(contestId, roundId)

  if (contestLoading || roundLoading || mcqLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || !contest || !isValidContestId) {
    let errorMessage = null

    // Handle specific error status codes for contest
    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.contest")} message={errorMessage} />
      </PageContainer>
    )
  }

  if (roundError || !round || !isValidRoundId) {
    let errorMessage = null

    // Handle specific error status codes for round
    if (!isValidRoundId) {
      errorMessage = t("errors:common.invalidId")
    } else if (roundErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (roundErrorObj?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.round")} message={errorMessage} />
      </PageContainer>
    )
  }

  if (mcqError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common.mcqTest")} />
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
