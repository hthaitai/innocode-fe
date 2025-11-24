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
import { BREADCRUMBS } from "@/config/breadcrumbs"
import { validateRound } from "../../validators/roundValidator"
import { BREADCRUMB_PATHS } from "../../../../config/breadcrumbs"

const EditRound = () => {
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()

  // Fetch contest info
  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)

  // Fetch the round info
  const { data: round, isLoading: roundLoading } = useGetRoundByIdQuery(roundId)

  // Form state
  const [form, setForm] = useState({
    name: "",
    start: "",
    end: "",
    problemType: "",
  })
  const [original, setOriginal] = useState(null)
  const [errors, setErrors] = useState({})

  // Initialize form when round is loaded
  useEffect(() => {
    if (round) {
      const init = {
        name: round.name || round.roundName || "",
        start: round.start || "",
        end: round.end || "",
        problemType: round.problemType || "",
      }
      setForm(init)
      setOriginal(init)
    }
  }, [round])

  const [updateRound, { isLoading: isUpdating }] = useUpdateRoundMutation()

  // Check for unsaved changes
  const hasChanges = useMemo(() => {
    if (!original) return false
    return Object.keys(form).some((key) => form[key] !== original[key])
  }, [form, original])

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
    [contestId, roundId, round?.contestId, round?.roundId]
  )

  // Submit handler
  const handleSubmit = async () => {
    const validationErrors = validateRound(form, contest, [], { isEdit: true })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      await updateRound({ id: roundId, data: form }).unwrap()
      toast.success("Round updated successfully")
      navigate(`/organizer/contests/${contestId}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update round")
    }
  }

  // Show loading until contest or round is ready
  if (contestLoading || roundLoading || !round) {
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
        formData={form}
        setFormData={setForm}
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
