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

const EMPTY = {
  name: "",
  start: "",
  end: "",
  timeLimitSeconds: 0,
  problemType: "",
  mcqTestConfig: {
    name: "",
    config: "",
  },
  problemConfig: {
    type: "",
    description: "",
    language: "Python 3",
    penaltyRate: 0.1,
    codeTemplate: "",
    templateUrl: "",
  },
  TemplateFile: null,
}

const CreateRound = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [createRound, { isLoading }] = useCreateRoundMutation()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_ROUND_CREATE(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_CREATE(contestId)

  const handleSubmit = async () => {
    const validationErrors = validateRound(form, contest)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      const formPayload = new FormData()

      // append all fields
      formPayload.append("Name", form.name)
      formPayload.append("Start", fromDatetimeLocal(form.start))
      formPayload.append("End", fromDatetimeLocal(form.end))
      formPayload.append("ProblemType", form.problemType)
      formPayload.append("TimeLimitSeconds", form.timeLimitSeconds)

      if (form.problemType !== "McqTest") {
        formPayload.append("ProblemConfig.Type", form.problemConfig.type)
        formPayload.append(
          "ProblemConfig.Description",
          form.problemConfig.description
        )
        formPayload.append(
          "ProblemConfig.Language",
          form.problemConfig.language
        )
        formPayload.append(
          "ProblemConfig.PenaltyRate",
          form.problemConfig.penaltyRate
        )
        if (form.TemplateFile) {
          formPayload.append("ProblemConfig.TemplateFile", form.TemplateFile)
        }
      }

      await createRound({ contestId, data: formPayload }).unwrap()
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
