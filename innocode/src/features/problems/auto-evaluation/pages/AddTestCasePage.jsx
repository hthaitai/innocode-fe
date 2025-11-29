import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import TestCaseForm from "../components/TestCaseForm"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useCreateRoundTestCaseMutation } from "../../../../services/autoEvaluationApi"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { validateTestCase } from "../validators/testCaseValidator"

const EMPTY_TEST_CASE = {
  description: "",
  input: "",
  expectedOutput: "",
  weight: 1,
  timeLimitMs: null,
  memoryKb: null,
}

export default function AddTestCasePage() {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()
  const { data: round, isLoading } = useGetRoundByIdQuery(roundId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEST_CASE_CREATE(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASE_CREATE(
    round?.contestId,
    roundId
  )

  const [formData, setFormData] = useState(EMPTY_TEST_CASE)
  const [errors, setErrors] = useState({})
  const [createTestCase, { isLoading: isSubmitting }] =
    useCreateRoundTestCaseMutation()

  const handleSubmit = async () => {
    const validationErrors = validateTestCase(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      await createTestCase({ roundId, payload: formData }).unwrap()
      toast.success("Test case created successfully!")
      navigate(
        `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation`
      )
    } catch (err) {
      if (err?.data?.errors) {
        const fieldErrors = Array.isArray(err.data.errors)
          ? Object.fromEntries(err.data.errors.map((e) => [e.field, e.message]))
          : err.data.errors
        setErrors(fieldErrors)
        toast.error("Please fix the highlighted errors.")
        return
      }
      toast.error(err?.data?.errorMessage || "Failed to create test case.")
    }
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
    >
      <TestCaseForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode="create"
      />
    </PageContainer>
  )
}
