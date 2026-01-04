import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
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
import RoundsList from "../../components/organizer/RoundsList"
import { EMPTY_ROUND } from "../../constants/roundConstants"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { formatRoundError } from "@/features/round/utils/errorUtils"

const CreateRound = () => {
  const { contestId } = useParams()
  const { t } = useTranslation("round")
  const navigate = useNavigate()
  const [createRound, { isLoading }] = useCreateRoundMutation()

  const [form, setForm] = useState(EMPTY_ROUND)
  const [errors, setErrors] = useState({})

  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)
  const { data: roundsData, isLoading: roundsLoading } =
    useGetRoundsByContestIdQuery(contestId)

  const rounds = roundsData?.data ?? []

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_ROUND_CREATE(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_CREATE(contestId)

  const handleSubmit = async () => {
    let validationErrors = validateRound(form, contest)

    // If sections are hidden, only show errors for visible fields (Round Type & Round to retake)
    const isHidden = form.isRetakeRound && !form.mainRoundId
    if (isHidden) {
      // Allowed keys are only 'mainRoundId' (and maybe isRetakeRound if validation checks it?)
      // Actually, if it's hidden, the only field visible is "Round to retake" (mainRoundId)
      // So we should filter out everything else.
      const visibleErrors = {}
      if (validationErrors.mainRoundId)
        visibleErrors.mainRoundId = validationErrors.mainRoundId
      validationErrors = visibleErrors
    }

    setErrors(validationErrors)
    console.log(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(
        t("create.errorValidation", {
          count: Object.keys(validationErrors).length,
        })
      )
      return
    }

    try {
      const formPayload = new FormData()

      // Append retake round info if applicable
      if (form.isRetakeRound) {
        formPayload.append("IsRetakeRound", "true")

        if (form.mainRoundId) {
          formPayload.append("MainRoundId", form.mainRoundId)

          const mainRound = rounds.find(
            (r) => String(r.roundId) === String(form.mainRoundId)
          )
          const mainRoundName = mainRound?.roundName || ""
          formPayload.append("MainRoundName", mainRoundName)
        }
      } else {
        // For normal rounds, just indicate it's not a retake
        formPayload.append("IsRetakeRound", "false")
      }

      formPayload.append("Name", form.name)
      formPayload.append("Start", fromDatetimeLocal(form.start))
      formPayload.append("End", fromDatetimeLocal(form.end))
      formPayload.append("ProblemType", form.problemType)
      formPayload.append("TimeLimitSeconds", form.timeLimitSeconds)
      formPayload.append("RankCutoff", form.rankCutoff)

      // Append MCQ config when problem type is McqTest
      if (form.problemType === "McqTest") {
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
        if (form.problemType === "AutoEvaluation") {
          formPayload.append(
            "ProblemConfig.TestType",
            form.problemConfig.testType || "InputOutput"
          )
        }
        if (form.TemplateFile) {
          formPayload.append("ProblemConfig.TemplateFile", form.TemplateFile)
        }
      }

      await createRound({ contestId, data: formPayload }).unwrap()
      toast.success(t("create.success"))
      navigate(`/organizer/contests/${contestId}`)
      navigate(`/organizer/contests/${contestId}`)
    } catch (err) {
      console.error(err)
      const errorMessage = err?.data?.errorMessage || t("create.errorGeneric")
      toast.error(formatRoundError(errorMessage))
    }
  }

  if (contestLoading || roundsLoading) {
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

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        {contest && <RoundDateInfo contest={contest} />}

        <div className="space-y-5">
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("create.activeRounds")}
            </div>
            <RoundsList
              rounds={rounds}
              selectedStart={form.start}
              selectedEnd={form.end}
            />
          </div>

          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("create.title")}
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
      </AnimatedSection>
    </PageContainer>
  )
}

export default CreateRound
