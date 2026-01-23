import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
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
import { isFetchError } from "@/shared/utils/apiUtils"

import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"

export default function EditContest() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation(["pages", "contest", "common", "errors"])

  const {
    data: contest,
    isLoading,
    isError,
    error,
  } = useGetContestByIdQuery(contestId)
  const [updateContest, { isLoading: updating }] = useUpdateContestMutation()

  console.log(contest)

  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_EDIT(contestId)

  // Validate UUID format first
  const isValidUuid = uuidValidate(contestId)
  const hasError = !isValidUuid || isError

  // Update breadcrumb to show "Not found" for error states
  // For errors: ["Contests", "Not found"] instead of ["Contests", "Not found", "Edit contest"]
  const breadcrumbItems = hasError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_CONTEST_EDIT(
        contest?.name ?? t("common:common.contest"),
      )

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
      (key) => formData[key] !== originalData[key],
    )
  }, [formData, originalData])

  const handleSubmit = async () => {
    if (!formData) return

    // Validate form
    const validationErrors = validateContest(formData, { isEdit: true, t })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(
        t("organizerContestForm.messages.validationError", {
          count: Object.keys(validationErrors).length,
        }),
      )
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
      fromDatetimeLocal(formData.registrationStart),
    )
    formPayload.append(
      "registrationEnd",
      fromDatetimeLocal(formData.registrationEnd),
    )
    formPayload.append("teamMembersMin", formData.teamMembersMin)
    formPayload.append("teamMembersMax", formData.teamMembersMax)
    formPayload.append("teamLimitMax", formData.teamLimitMax)
    formPayload.append("appealSubmitDays", formData.appealSubmitDays)
    formPayload.append("appealReviewDays", formData.appealReviewDays)
    formPayload.append("judgeRescoreDays", formData.judgeRescoreDays)
    formPayload.append("rewardsText", formData.rewardsText)

    if (formData.imgFile) {
      formPayload.append("ImageFile", formData.imgFile)
    } else if (formData.imgUrl) {
      formPayload.append("imgUrl", formData.imgUrl)
    }

    try {
      await updateContest({ id: contestId, data: formPayload }).unwrap()
      toast.success(t("organizerContestForm.messages.updateSuccess"))
      navigate(`/organizer/contests/${contestId}`)
    } catch (err) {
      console.error(err)

      if (isFetchError(err)) return

      if (err?.data?.errorCode === "DUPLICATE") {
        const errorMessage = t("contest:validation.contestNameExists")
        toast.error(errorMessage)
        setErrors((prev) => ({
          ...prev,
          name: errorMessage,
          ...(err.data.additionalData?.suggestion
            ? { nameSuggestion: err.data.additionalData.suggestion }
            : {}),
        }))
        return
      }

      if (
        err?.data?.errorCode === "BADREQUEST" &&
        err?.data?.errorMessage ===
          "Registration end date must be earlier than contest start date."
      ) {
        const errorMessage = t("contest:validation.regEndBeforeContestStart")
        toast.error(errorMessage)
        setErrors((prev) => ({
          ...prev,
          registrationEnd: errorMessage,
        }))
        return
      }

      toast.error(
        err?.data?.errorMessage ||
          t("organizerContestForm.messages.updateError"),
      )
    }
  }

  if (!isValidUuid) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={t("errors:common.invalidId")}
        />
      </PageContainer>
    )
  }

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
    let errorMessage = null

    // Handle specific error status codes
    if (error?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (error?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (!formData) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
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
