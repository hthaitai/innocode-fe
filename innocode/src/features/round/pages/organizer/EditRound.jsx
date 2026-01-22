import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { validate as uuidValidate } from "uuid"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { useNavigate, useParams } from "react-router-dom"
import {
  useUpdateRoundMutation,
  useGetRoundByIdQuery,
} from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import RoundForm from "../../components/organizer/RoundForm"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { validateRound } from "../../validators/roundValidator"
import {
  fromDatetimeLocal,
  toDatetimeLocal,
} from "../../../../shared/utils/dateTime"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import RoundDateInfo from "@/features/round/components/organizer/RoundDateInfo"
import RoundsList from "../../components/organizer/RoundsList"
import { useGetRoundsByContestIdQuery } from "../../../../services/roundApi"
import { EMPTY_ROUND } from "../../constants/roundConstants"
import {
  formatRoundError,
  BUFFER_ERROR_REGEX,
  CONFLICT_ERROR_REGEX,
} from "@/features/round/utils/errorUtils"

const EditRound = () => {
  const { contestId, roundId } = useParams()
  const { t } = useTranslation(["round", "common", "contest", "errors"])
  const navigate = useNavigate()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  // Fetch contest and round data
  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })
  const {
    data: round,
    isLoading: roundLoading,
    isError: isRoundError,
    error: roundError,
  } = useGetRoundByIdQuery(roundId, { skip: !isValidRoundId })
  const { data: roundsData, isLoading: roundsLoading } =
    useGetRoundsByContestIdQuery(contestId, { skip: !isValidContestId })

  const rounds = roundsData?.data ?? []

  const [formData, setFormData] = useState(EMPTY_ROUND)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const [updateRound, { isLoading: isUpdating }] = useUpdateRoundMutation()

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || isRoundError
  const hasError = hasContestError || hasRoundError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_ROUND_EDIT(
        contest?.name ?? t("common:common.contest"),
        round?.roundName ?? t("common:common.round"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_EDIT(
    contestId,
    roundId,
  )

  // Initialize form data once round is loaded
  useEffect(() => {
    if (!round) return

    const formatted = {
      isRetakeRound: round.isRetakeRound,
      mainRoundId: round.mainRoundId,
      mainRoundName: round.mainRoundName,
      name: round.roundName,
      start: toDatetimeLocal(round.start),
      end: toDatetimeLocal(round.end),
      problemType: round.problemType,
      mcqTestConfig: round.problemType === "McqTest" ? round.mcqTest : null,
      problemConfig: ["Manual", "AutoEvaluation"].includes(round.problemType)
        ? {
            ...round.problem,
            type: round.problem?.type || round.problemType,
            testType: round.problem?.testType || "InputOutput",
            templateUrl: round.problem?.templateUrl,
            mockTestWeight: round.problem?.mockTestWeight,
          }
        : null,
      TemplateFile: null,
      timeLimitSeconds: round.timeLimitSeconds,
      rankCutoff: round.rankCutoff,
    }

    setFormData(formatted)
    setOriginalData(formatted)
  }, [round])

  // Detect changes for submit button
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key],
    )
  }, [formData, originalData])

  // Submit handler
  const handleSubmit = async () => {
    if (!formData) return

    const validationErrors = validateRound(formData, contest, [], {
      isEdit: true,
      t,
    })
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error(
        t("create.errorValidation", {
          count: Object.keys(validationErrors).length,
        }),
      ) // reusing create's error message since logic is same
      return
    }

    try {
      const formPayload = new FormData()

      formPayload.append("Name", formData.name)
      formPayload.append("Start", fromDatetimeLocal(formData.start))
      formPayload.append("End", fromDatetimeLocal(formData.end))
      formPayload.append("ProblemType", formData.problemType)
      formPayload.append("TimeLimitSeconds", formData.timeLimitSeconds)
      formPayload.append("RankCutoff", formData.rankCutoff)

      // Append MCQ config when editing MCQ rounds
      if (formData.problemType === "McqTest") {
        formPayload.append(
          "McqTestConfig.Config",
          formData.mcqTestConfig.config,
        )
      }

      if (formData.problemConfig) {
        formPayload.append(
          "ProblemConfig.Type",
          formData.problemConfig.type || formData.problemType,
        )
        formPayload.append(
          "ProblemConfig.Description",
          formData.problemConfig.description,
        )
        formPayload.append(
          "ProblemConfig.Language",
          formData.problemConfig.language,
        )
        formPayload.append(
          "ProblemConfig.PenaltyRate",
          formData.problemConfig.penaltyRate,
        )

        if (formData.problemType === "AutoEvaluation") {
          formPayload.append(
            "ProblemConfig.TestType",
            formData.problemConfig.testType || "InputOutput",
          )
          if (formData.problemConfig.testType === "MockTest") {
            formPayload.append(
              "ProblemConfig.MockTestWeight",
              formData.problemConfig.mockTestWeight,
            )
          }
        }

        // Only append TemplateFile if it's actually a File
        if (formData.TemplateFile) {
          formPayload.append(
            "ProblemConfig.TemplateFile",
            formData.TemplateFile,
          )
        }
      }

      await updateRound({ id: roundId, contestId, data: formPayload }).unwrap()

      toast.success(t("edit.success"))
      navigate(`/organizer/contests/${contestId}/rounds/${roundId}`)
    } catch (err) {
      console.error(err)
      const errorMessage = err?.data?.errorMessage || t("edit.errorGeneric")

      // Handle specific error: Cannot update opened round
      if (
        errorMessage === "Cannot update round while it is in 'Opened' status."
      ) {
        toast.error(t("errors.cannotUpdateOpened"))
        return
      }

      const formattedError = formatRoundError(errorMessage)

      // If it's a buffer error, highlight the start time
      if (errorMessage.match(BUFFER_ERROR_REGEX)) {
        setErrors((prev) => ({ ...prev, start: formattedError }))
      }

      // If it's a conflict error, highlight both start and end times
      if (errorMessage.match(CONFLICT_ERROR_REGEX)) {
        setErrors((prev) => ({
          ...prev,
          start: formattedError,
          end: formattedError,
        }))
      }

      toast.error(formattedError)
    }
  }

  if (contestLoading || roundLoading || roundsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || !contest || !isValidContestId) {
    let errorMessage = null

    // Handle specific error status codes for contest
    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    } else if (contestError?.status === 400) {
      errorMessage = t("errors:common.badRequest")
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

  if (isRoundError || !round || !isValidRoundId) {
    let errorMessage = null

    // Handle specific error status codes for round
    if (!isValidRoundId) {
      errorMessage = t("errors:common.invalidId")
    } else if (roundError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (roundError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    } else if (roundError?.status === 400) {
      errorMessage = t("errors:common.badRequest")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.round")}
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
        {contest && <RoundDateInfo contest={contest} />}

        <div className="space-y-5">
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("edit.activeRounds")}
            </div>
            {formData && (
              <RoundsList
                rounds={rounds}
                selectedStart={formData.start}
                selectedEnd={formData.end}
                disableNavigation={true}
              />
            )}
          </div>

          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("edit.sectionTitle")}
            </div>
            <RoundForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              onSubmit={handleSubmit}
              isSubmitting={isUpdating}
              mode="edit"
              hasChanges={hasChanges}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default EditRound
