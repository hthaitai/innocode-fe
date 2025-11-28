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

export default function EditTestCasePage() {
  const navigate = useNavigate()
  const { roundId, testCaseId } = useParams()

  const { data: round, isLoading: isRoundLoading } =
    useGetRoundByIdQuery(roundId)
  const { data: testCaseData, isLoading: isFetchingTestCase } =
    useGetTestCaseByIdQuery(testCaseId)

  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const [updateTestCases, { isLoading: isUpdating }] =
    useUpdateRoundTestCasesMutation()

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
        testCases: [{ testCaseId, ...formData }],
      }).unwrap()

      toast.success("Test case updated successfully!")
      navigate(
        `/organizer/contests/${round?.contestId}/rounds/${roundId}/auto-evaluation`
      )
    } catch (err) {
      const fieldErrors =
        err?.data?.errors && Array.isArray(err.data.errors)
          ? Object.fromEntries(err.data.errors.map((e) => [e.field, e.message]))
          : {}
      setErrors(fieldErrors)

      toast.error(
        err?.data?.errorMessage ||
          "Failed to update test case. Please check the form."
      )
    }
  }

  // Show loading until round & testCase data is loaded
  if (isRoundLoading || isFetchingTestCase || !formData) {
    return <PageContainer>Loading...</PageContainer>
  }

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEST_CASE_EDIT(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round",
    testCaseId
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASE_EDIT(
    round?.contestId,
    roundId,
    testCaseId
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
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
    </PageContainer>
  )
}
