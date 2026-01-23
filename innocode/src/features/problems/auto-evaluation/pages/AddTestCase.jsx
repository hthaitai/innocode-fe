import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import TestCaseForm from "../components/TestCaseForm"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useCreateRoundTestCaseMutation } from "../../../../services/autoEvaluationApi"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { validateTestCase } from "../validators/testCaseValidator"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { useTranslation } from "react-i18next"
import { isFetchError } from "@/shared/utils/apiUtils"

const EMPTY_TEST_CASE = {
  description: "",
  input: "",
  expectedOutput: "",
  weight: 1,
  timeLimitMs: 1000,
  memoryKb: 256000,
}

export default function AddTestCase() {
  const { t } = useTranslation(["common", "breadcrumbs", "errors", "contest"])
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: round,
    isLoading,
    isError,
    error: roundErrorObj,
  } = useGetRoundByIdQuery(roundId, { skip: !isValidRoundId })

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || isError
  const hasError = hasContestError || hasRoundError

  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_TEST_CASE_CREATE(
        contest?.name ?? round?.contestName ?? t("common.contest"),
        round?.roundName ?? t("common.round"),
        t("common.testCase"),
        t("common.createTestCase"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASE_CREATE(
    contestId,
    roundId,
  )

  const [formData, setFormData] = useState(EMPTY_TEST_CASE)
  const [errors, setErrors] = useState({})
  const [createTestCase, { isLoading: isSubmitting }] =
    useCreateRoundTestCaseMutation()

  const handleSubmit = async () => {
    const validationErrors = validateTestCase(formData, { t })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      await createTestCase({ roundId, payload: formData, contestId }).unwrap()
      toast.success(t("common.testCaseCreatedSuccess"))
      navigate(
        `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation`,
      )
    } catch (err) {
      console.error(err)

      if (isFetchError(err)) {
        toast.error(t("contest:suggestion.connectionError"))
        return
      }

      toast.error(err?.data?.errorMessage || t("common.failedToCreateTestCase"))
    }
  }

  if (contestLoading || isLoading) {
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

  if (isError || !round || !isValidRoundId) {
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
          isSubmitting={isSubmitting}
          mode="create"
        />
      </AnimatedSection>
    </PageContainer>
  )
}
