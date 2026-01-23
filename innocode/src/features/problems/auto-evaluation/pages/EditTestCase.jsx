import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import TestCaseForm from "../components/TestCaseForm"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import {
  useGetTestCaseByIdQuery,
  useUpdateRoundTestCasesMutation,
} from "../../../../services/autoEvaluationApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { validateTestCase } from "../validators/testCaseValidator"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { useTranslation } from "react-i18next"
import { isFetchError } from "@/shared/utils/apiUtils"

export default function EditTestCase() {
  const { t } = useTranslation(["common", "breadcrumbs", "errors", "contest"])
  const navigate = useNavigate()
  const { contestId, roundId, testCaseId } = useParams()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)
  const isValidTestCaseId = uuidValidate(testCaseId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: round,
    isLoading: isRoundLoading,
    isError: isRoundError,
    error: roundErrorObj,
  } = useGetRoundByIdQuery(roundId, { skip: !isValidRoundId })

  const {
    data: testCaseData,
    isLoading: isTestCaseLoading,
    isError: isTestCaseError,
    error: testCaseErrorObj,
  } = useGetTestCaseByIdQuery(testCaseId, { skip: !isValidTestCaseId })

  const [updateTestCases, { isLoading: isUpdating }] =
    useUpdateRoundTestCasesMutation()

  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || isRoundError
  const hasTestCaseError = !isValidTestCaseId || isTestCaseError
  const hasError = hasContestError || hasRoundError || hasTestCaseError

  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : !hasRoundError && !hasContestError
            ? [round?.roundName]
            : []),
        ...(!hasContestError && !hasRoundError ? [t("common.testCase")] : []),
        ...(hasTestCaseError && !hasContestError && !hasRoundError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_TEST_CASE_EDIT(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
        testCaseId,
        t("common.testCase"),
        t("common.updateTestCase"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASE_EDIT(
    contestId,
    roundId,
    testCaseId,
  )

  // Initialize form data when testCaseData is available
  useEffect(() => {
    if (!testCaseData) return

    const data = {
      description: testCaseData.description ?? "",
      input: testCaseData.input ?? "",
      expectedOutput: testCaseData.expectedOutput ?? "",
      weight: testCaseData.weight ?? 1,
      timeLimitMs: testCaseData.timeLimitMs ?? null,
      memoryKb: testCaseData.memoryKb ?? null,
    }

    setFormData(data)
    setOriginalData(data)
  }, [testCaseData])

  // Detect if data has changed
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }, [formData, originalData])

  const handleSubmit = async () => {
    if (!formData) return

    const validationErrors = validateTestCase(formData, { isEdit: true, t })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      await updateTestCases({
        roundId,
        data: [{ testCaseId, ...formData }],
        contestId,
      }).unwrap()

      toast.success(t("common.testCaseUpdatedSuccess"))
      navigate(
        `/organizer/contests/${round?.contestId}/rounds/${roundId}/auto-evaluation`,
      )
    } catch (err) {
      console.error(err)

      if (isFetchError(err)) return

      toast.error(err?.data?.errorMessage || t("common.failedToUpdateTestCase"))
    }
  }

  // Show loading until contest, round & testCase data is loaded
  // Only wait for formData if we have valid IDs and no errors (otherwise it will never be set)
  const isLoadingData = contestLoading || isRoundLoading || isTestCaseLoading
  const hasAnyError = isContestError || isRoundError || isTestCaseError
  const shouldWaitForFormData =
    isValidContestId &&
    isValidRoundId &&
    isValidTestCaseId &&
    !hasAnyError &&
    !formData

  if (isLoadingData || shouldWaitForFormData) {
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

  if (isRoundError || !round || !isValidRoundId) {
    let errorMessage = null

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

  if (isTestCaseError || !testCaseData || !isValidTestCaseId) {
    let errorMessage = null

    if (!isValidTestCaseId) {
      errorMessage = t("errors:common.invalidId")
    } else if (testCaseErrorObj?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (testCaseErrorObj?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common.testCase", { defaultValue: "Test Case" })}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <TestCaseForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          mode="edit"
          hasChanges={hasChanges}
        />
      </AnimatedSection>
    </PageContainer>
  )
}
