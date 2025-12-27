import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import TestCaseForm from "../components/TestCaseForm"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useCreateRoundTestCaseMutation } from "../../../../services/autoEvaluationApi"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { validateTestCase } from "../validators/testCaseValidator"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { Spinner } from "../../../../shared/components/SpinnerFluent"

const EMPTY_TEST_CASE = {
  description: "",
  input: "",
  expectedOutput: "",
  weight: 1,
  timeLimitMs: 1000,
  memoryKb: 256000,
}

export default function AddTestCase() {
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()
  const { data: round, isLoading, isError } = useGetRoundByIdQuery(roundId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_TEST_CASE_CREATE(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_TEST_CASE_CREATE(
    contestId,
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
      await createTestCase({ roundId, payload: formData, contestId }).unwrap()
      toast.success("Test case created successfully!")
      navigate(
        `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation`
      )
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.errorMessage || "Failed to create test case.")
    }
  }

  if (isLoading) {
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

  if (isError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-red-600 text-sm leading-5 border border-red-200 rounded-[5px] bg-red-50 flex items-center px-5 min-h-[70px]">
          Something went wrong while loading this round. Please try again.
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
          This round has been deleted or is no longer available.
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
          isSubmitting={isSubmitting}
          mode="create"
        />
      </AnimatedSection>
    </PageContainer>
  )
}
