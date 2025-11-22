import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAddContestMutation } from "../../../../services/contestApi"
import { toast } from "react-hot-toast"
import ContestForm from "../../components/organizer/ContestForm"
import { validateContest } from "@/features/contest/validators/contestValidator"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const EMPTY_CONTEST = {
  year: new Date().getFullYear(),
  name: "",
  description: "",
  imgUrl: "",
  start: "",
  end: "",
  registrationStart: "",
  registrationEnd: "",
  teamMembersMax: "",
  teamLimitMax: "",
  rewardsText: "",
  saveAsDraft: true,
}

export default function AddContestPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(EMPTY_CONTEST)
  const [errors, setErrors] = useState({})
  const [addContest, { isLoading }] = useAddContestMutation()

  // Breadcrumbs (consistent style)
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_CREATE
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_CREATE

  const handleSubmit = async () => {
    // 1️⃣ Frontend validation
    const validationErrors = validateContest(formData, { isEdit: false })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      // 2️⃣ Prepare FormData
      const data = new FormData()
      data.append("Year", formData.year)
      data.append("Name", formData.name)
      data.append("Description", formData.description || "")
      data.append("Start", new Date(formData.start).toISOString())
      data.append("End", new Date(formData.end).toISOString())
      data.append(
        "RegistrationStart",
        new Date(formData.registrationStart).toISOString()
      )
      data.append(
        "RegistrationEnd",
        new Date(formData.registrationEnd).toISOString()
      )
      data.append("TeamMembersMax", formData.teamMembersMax)
      data.append("TeamLimitMax", formData.teamLimitMax)
      data.append("RewardsText", formData.rewardsText || "")
      if (formData.imgFile) data.append("ImageFile", formData.imgFile)

      // 3️⃣ Call API
      await addContest(data).unwrap()
      toast.success("Contest created successfully!")
      navigate("/organizer/contests")
    } catch (err) {
      // 4️⃣ Handle backend field validation errors
      if (err?.data?.errors) {
        const fieldErrors = {}
        if (Array.isArray(err.data.errors)) {
          err.data.errors.forEach((e) => {
            if (e.field) fieldErrors[e.field] = e.message
          })
        } else if (typeof err.data.errors === "object") {
          Object.assign(fieldErrors, err.data.errors)
        }
        setErrors(fieldErrors)
        toast.error("Please fix the highlighted errors.")
        return
      }

      // 5️⃣ Handle duplicate contest name
      if (err?.data?.errorCode === "DUPLICATE") {
        toast.error(err.data.errorMessage)
        // Set inline error next to name field
        setErrors((prev) => ({
          ...prev,
          name: err.data.errorMessage,
          ...(err.data.AdditionalData?.suggestion
            ? { nameSuggestion: err.data.AdditionalData.suggestion }
            : {}),
        }))
        return
      }

      // 6️⃣ Fallback error
      toast.error(err?.data?.errorMessage || "Failed to create contest.")
    }
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <ContestForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        mode="create"
      />
    </PageContainer>
  )
}
