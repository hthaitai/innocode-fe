import React, { useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCreateRoundMutation } from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import RoundForm from "../../components/organizer/RoundForm"
import RoundDateInfo from "@/features/round/components/organizer/RoundDateInfo"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import { validateRound } from "@/features/round/validators/roundValidator"
import { BREADCRUMB_PATHS } from "../../../../config/breadcrumbs"
import { fromDatetimeLocal } from "../../../../shared/utils/dateTime"

const EMPTY = { name: "", start: "", end: "", problemType: "" }

const CreateRound = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [createRound, { isLoading }] = useCreateRoundMutation()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)

  // Breadcrumbs
  const breadcrumbItems = useMemo(
    () => BREADCRUMBS.ORGANIZER_ROUND_CREATE(contest?.name ?? "Contest"),
    [contest?.name]
  )

  const breadcrumbPaths = useMemo(
    () => BREADCRUMB_PATHS.ORGANIZER_ROUND_CREATE(contestId),
    [contestId]
  )

  const handleSubmit = async () => {
    const validationErrors = validateRound(form, contest)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      const formData = new FormData()

      // append all fields
      formData.append("Name", form.name)
      formData.append("Start", fromDatetimeLocal(form.start))
      formData.append("End", fromDatetimeLocal(form.end))
      formData.append("ProblemType", form.problemType)
      formData.append("TimeLimitSeconds", String(form.timeLimitSeconds || 0))

      if (form.problemConfig) {
        formData.append("ProblemConfig.Type", form.problemConfig.type)
        formData.append(
          "ProblemConfig.Description",
          form.problemConfig.description || ""
        )
        formData.append(
          "ProblemConfig.Language",
          form.problemConfig.language || ""
        )
        formData.append(
          "ProblemConfig.PenaltyRate",
          String(form.problemConfig.penaltyRate || 0.1)
        )
        if (form.TemplateFile) {
          formData.append("ProblemConfig.TemplateFile", form.TemplateFile)
        }
      }

      await createRound({ contestId, data: formData }).unwrap()

      toast.success("Round created")
      navigate(`/organizer/contests/${contestId}`)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.errorMessage || "Failed to create round")
    }
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={contestLoading}
    >
      {contest && <RoundDateInfo contest={contest} />}
      <RoundForm
        formData={form}
        setFormData={setForm}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        mode="create"
      />
    </PageContainer>
  )
}

export default CreateRound
