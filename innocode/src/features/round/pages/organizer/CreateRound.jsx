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
import {
  formatDateTime,
  fromDatetimeLocal,
  toDatetimeLocal,
} from "../../../../shared/utils/dateTime"
import { useGetRoundsByContestIdQuery } from "@/services/roundApi"
import ExistingRoundsPanel from "../../components/organizer/ExistingRoundsPanel"

const EMPTY = {
  isRetakeRound: false,
  mainRoundId: "",
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
  const { data: roundsData, isLoading: roundsLoading } =
    useGetRoundsByContestIdQuery(contestId)
    
  const rounds = roundsData?.data || []

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

      // append all
      formPayload.append("IsRetakeRound", form.isRetakeRound)
      if (form.isRetakeRound) {
        formPayload.append("MainRoundId", form.mainRoundId)
      }

      formPayload.append("Name", form.name)
      formPayload.append("Start", fromDatetimeLocal(form.start))
      formPayload.append("End", fromDatetimeLocal(form.end))
      formPayload.append("ProblemType", form.problemType)
      formPayload.append("TimeLimitSeconds", form.timeLimitSeconds)

      // Append MCQ config when problem type is McqTest
      if (form.problemType === "McqTest") {
        formPayload.append("McqTestConfig.Name", form.mcqTestConfig.name)
        formPayload.append("McqTestConfig.Config", form.mcqTestConfig.config)
      }

      // Append problem config for non-MCQ problem types
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

      if (form.isRetakeRound && form.mainRoundId) {
        const mainRound = rounds.find(
          (r) => String(r.roundId) === String(form.mainRoundId)
        )
        const mainRoundName = mainRound?.roundName || ""
        formPayload.append("MainRoundName", mainRoundName)
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

      <div className="space-y-5">
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Active rounds
          </div>
          <ExistingRoundsPanel
            rounds={rounds}
            selectedStart={form.start}
            selectedEnd={form.end}
          />
        </div>

        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Create a round
          </div>
          <RoundForm
            contestId={contestId}
            formData={form}
            setFormData={setForm}
            errors={errors}
            setErrors={setErrors}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            mode="create"
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default CreateRound
