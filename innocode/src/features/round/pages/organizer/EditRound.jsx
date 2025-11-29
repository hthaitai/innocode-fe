import React, { useState, useEffect, useMemo } from "react"
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

const EditRound = () => {
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()

  // Fetch contest and round data
  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)
  const { data: round, isLoading: roundLoading } = useGetRoundByIdQuery(roundId)

  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const [updateRound, { isLoading: isUpdating }] = useUpdateRoundMutation()

  // Initialize form data once round is loaded
  useEffect(() => {
    if (!round) return

    const formatted = {
      name: round.roundName || "",
      start: toDatetimeLocal(round.start),
      end: toDatetimeLocal(round.end),
      problemType: round.problemType || "",
      mcqTestConfig: round.mcqTest || null,
      problemConfig: round.problem || null,
      timeLimitSeconds: round.timeLimitSeconds || 0,
    }

    setFormData(formatted)
    setOriginalData(formatted)
  }, [round])

  // Detect changes for submit button
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    )
  }, [formData, originalData])

  // Breadcrumbs
  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_ROUND_EDIT(
        round?.contestName ?? "Contest",
        round?.roundName ?? "Round"
      ),
    [round?.contestName, round?.roundName]
  )

  const breadcrumbPaths = useMemo(
    () =>
      BREADCRUMB_PATHS.ORGANIZER_ROUND_EDIT(
        round?.contestId ?? contestId,
        round?.roundId ?? roundId
      ),
    [round?.contestId, round?.roundId, contestId, roundId]
  )

  // Submit handler
  const handleSubmit = async () => {
    if (!formData) return

    const validationErrors = validateRound(formData, contest, [], {
      isEdit: true,
    })
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    const payload = {
      ...formData,
      start: fromDatetimeLocal(formData.start),
      end: fromDatetimeLocal(formData.end),
    }

    try {
      await updateRound({ id: roundId, data: payload }).unwrap()
      toast.success("Round updated successfully!")
      navigate(`/organizer/contests/${contestId}/rounds/${roundId}`)
    } catch (err) {
      console.error(err)

      const fieldErrors = {}

      // Example: map BADREQUEST for timeLimitSeconds
      if (err?.data?.errorCode === "BADREQUEST" && err?.data?.errorMessage) {
        if (err.data.errorMessage.includes("Time limit")) {
          fieldErrors.timeLimitSeconds = err.data.errorMessage
        } else {
          // Optionally handle other field errors here
        }
      }

      // Set errors to form
      setErrors((prev) => ({ ...prev, ...fieldErrors }))

      // Fallback toast for global errors
      if (!Object.keys(fieldErrors).length) {
        toast.error(err?.data?.errorMessage || "Failed to update round")
      }
    }
  }

  // Show loading until data is ready
  if (contestLoading || roundLoading || !formData) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading
      />
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
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
    </PageContainer>
  )
}

export default EditRound
