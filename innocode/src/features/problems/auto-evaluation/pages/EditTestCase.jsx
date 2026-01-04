import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import TestCaseForm from "../components/TestCaseForm"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import {
  useGetTestCaseByIdQuery,
  useUpdateRoundTestCasesMutation,
} from "../../../../services/autoEvaluationApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { validateTestCase } from "../validators/testCaseValidator"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { useTranslation } from "react-i18next"

export default function EditTestCase() {
  const { t } = useTranslation(["common", "breadcrumbs"])
  const navigate = useNavigate()
  const { contestId, roundId, testCaseId } = useParams()

  const {
    data: round,
    isLoading: isRoundLoading,
    isError: isRoundError,
  } = useGetRoundByIdQuery(roundId)
  const {
    data: testCaseData,
    isLoading: isTestCaseLoading,
    isError: isTestCaseError,
  } = useGetTestCaseByIdQuery(testCaseId)
  const [updateTestCases, { isLoading: isUpdating }] =
    useUpdateRoundTestCasesMutation()

  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEST_CASE_EDIT(
    round?.contestName ?? t("common.contest"),
    round?.roundName ?? t("common.round"),
    testCaseId, // Note: The 3rd param is testCaseName/testCaseId, 4th is label, 5th is edit label
    t("common.testCase"),
    t("common.updateTestCase")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASE_EDIT(
    contestId,
    roundId,
    testCaseId
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

    const validationErrors = validateTestCase(formData, { isEdit: true })
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
        `/organizer/contests/${round?.contestId}/rounds/${roundId}/auto-evaluation`
      )
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.errorMessage || t("common.failedToUpdateTestCase"))
    }
  }

  // Show loading until round & testCase data is loaded
  if (isRoundLoading || isTestCaseLoading || !formData) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="min-h-[70px] flex items-center justify-center">
          <Spinner />
        </div>
      </PageContainer>
    )
  }

  if (isRoundError || isTestCaseError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-red-600 text-sm leading-5 border border-red-200 rounded-[5px] bg-red-50 flex items-center px-5 min-h-[70px]">
          {t("common.testCaseLoadError")}
        </div>
      </PageContainer>
    )
  }

  if (!round) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-sm leading-5 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          {t("common.itemUnavailable", { item: t("common.round") })}
        </div>
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
