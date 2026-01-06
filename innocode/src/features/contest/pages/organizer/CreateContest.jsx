import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAddContestMutation } from "../../../../services/contestApi"
import { toast } from "react-hot-toast"
import ContestForm from "../../components/organizer/ContestForm"
import { validateContest } from "@/features/contest/validators/contestValidator"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { fromDatetimeLocal } from "../../../../shared/utils/dateTime"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"

const EMPTY_CONTEST = {
  year: new Date().getFullYear(),
  name: "",
  description: "",
  start: "",
  end: "",
  registrationStart: "",
  registrationEnd: "",
  teamMembersMax: "",
  teamMembersMin: 1,
  teamLimitMax: "",
  appealSubmitDays: 2,
  appealReviewDays: 1,
  judgeRescoreDays: 1,
  rewardsText: "",
  saveAsDraft: true,
}

export default function CreateContest() {
  const navigate = useNavigate()
  const { t } = useTranslation("pages")
  const [formData, setFormData] = useState(EMPTY_CONTEST)
  const [errors, setErrors] = useState({})
  const [addContest, { isLoading }] = useAddContestMutation()

  // Breadcrumbs (consistent style)
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_CREATE
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_CREATE

  const handleSubmit = async () => {
    const validationErrors = validateContest(formData, { isEdit: false, t })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(
        t("organizerContestForm.messages.validationError", {
          count: Object.keys(validationErrors).length,
        })
      )
      return
    }

    try {
      const formPayload = new FormData()

      formPayload.append("Year", formData.year)
      formPayload.append("Name", formData.name)
      formPayload.append("Description", formData.description)
      formPayload.append("Start", fromDatetimeLocal(formData.start))
      formPayload.append("End", fromDatetimeLocal(formData.end))
      formPayload.append(
        "RegistrationStart",
        fromDatetimeLocal(formData.registrationStart)
      )
      formPayload.append(
        "RegistrationEnd",
        fromDatetimeLocal(formData.registrationEnd)
      )
      formPayload.append("TeamMembersMin", formData.teamMembersMin)
      formPayload.append("TeamMembersMax", formData.teamMembersMax)
      formPayload.append("TeamLimitMax", formData.teamLimitMax)
      formPayload.append("AppealSubmitDays", formData.appealSubmitDays)
      formPayload.append("AppealReviewDays", formData.appealReviewDays)
      formPayload.append("JudgeRescoreDays", formData.judgeRescoreDays)
      formPayload.append("RewardsText", formData.rewardsText)

      if (formData.imgFile) formPayload.append("ImageFile", formData.imgFile)

      await addContest(formPayload).unwrap()
      toast.success(t("organizerContestForm.messages.createSuccess"))
      navigate("/organizer/contests")
    } catch (err) {
      console.error(err)

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

      toast.error(
        err?.data?.errorMessage ||
          t("organizerContestForm.messages.createError")
      )
    }
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
          isSubmitting={isLoading}
          mode="create"
        />
      </AnimatedSection>
    </PageContainer>
  )
}
