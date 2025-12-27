import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useGetContestByIdQuery,
  useUpdateContestMutation,
} from "../../../../services/contestApi"
import { toast } from "react-hot-toast"
import ContestForm from "../../components/organizer/ContestForm"
import { validateContest } from "@/features/contest/validators/contestValidator"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import {
  fromDatetimeLocal,
  toDatetimeLocal,
} from "../../../../shared/utils/dateTime"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

export default function EditContest() {
  const { contestId } = useParams()
  const navigate = useNavigate()

  const {
    data: contest,
    isLoading,
    isError,
  } = useGetContestByIdQuery(contestId)
  const [updateContest, { isLoading: updating }] = useUpdateContestMutation()

  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_EDIT(
    contest?.name ?? "Edit Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_EDIT(contestId)

  // Initialize form data once contest is loaded
  useEffect(() => {
    if (!contest) return
    const formatted = {
      ...contest,
      description: contest.description ?? "",
      rewardsText: contest.rewardsText ?? "",
      start: toDatetimeLocal(contest.start),
      end: toDatetimeLocal(contest.end),
      registrationStart: toDatetimeLocal(contest.registrationStart),
      registrationEnd: toDatetimeLocal(contest.registrationEnd),
    }
    setFormData(formatted)
    setOriginalData(formatted)
  }, [contest])

  // Detect changes for submit button state
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    )
  }, [formData, originalData])

  const handleSubmit = async () => {
    if (!formData) return

    // Validate form
    const validationErrors = validateContest(formData, { isEdit: true })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    // Build FormData
    const formPayload = new FormData()

    formPayload.append("year", formData.year)
    formPayload.append("name", formData.name)
    formPayload.append("description", formData.description)
    formPayload.append("start", fromDatetimeLocal(formData.start))
    formPayload.append("end", fromDatetimeLocal(formData.end))
    formPayload.append(
      "registrationStart",
      fromDatetimeLocal(formData.registrationStart)
    )
    formPayload.append(
      "registrationEnd",
      fromDatetimeLocal(formData.registrationEnd)
    )
    formPayload.append("teamMembersMax", formData.teamMembersMax)
    formPayload.append("teamLimitMax", formData.teamLimitMax)
    formPayload.append("rewardsText", formData.rewardsText)

    if (formData.imgFile) {
      formPayload.append("ImageFile", formData.imgFile)
    } else if (formData.imgUrl) {
      formPayload.append("imgUrl", formData.imgUrl)
    }

    try {
      await updateContest({ id: contestId, data: formPayload }).unwrap()
      toast.success("Contest updated successfully!")
      navigate(`/organizer/contests/${contestId}`)
    } catch (err) {
      console.error(err)

      if (err?.data?.errorCode === "DUPLICATE") {
        toast.error(err.data.errorMessage)
        setErrors((prev) => ({
          ...prev,
          name: err.data.errorMessage,
          ...(err.data.additionalData?.suggestion
            ? { nameSuggestion: err.data.additionalData.suggestion }
            : {}),
        }))
        return
      }

      toast.error(err?.data?.errorMessage || "Failed to update contest.")
    }
  }

  if (isLoading || !formData) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={isLoading}
      />
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={isError}
    >
      <AnimatedSection>
        <ContestForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
          isSubmitting={updating}
          mode="edit"
          hasChanges={hasChanges}
        />
      </AnimatedSection>
    </PageContainer>
  )
}
