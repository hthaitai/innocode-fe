import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useUpdateRoundMutation,
  useGetRoundsByContestIdQuery,
} from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import RoundForm from "../../components/organizer/RoundForm"
import { BREADCRUMBS } from "@/config/breadcrumbs"

const EditRound = () => {
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()

  // Fetch contest info
  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)

  // Fetch rounds of this contest
  const { data: roundsData, isLoading: roundsLoading } =
    useGetRoundsByContestIdQuery(contestId)

  const [updateRound, { isLoading: isUpdating }] = useUpdateRoundMutation()

  // Find the round we want to edit
  const existing = roundsData?.data?.find(
    (r) => String(r.roundId) === String(roundId)
  )

  // Form state
  const [form, setForm] = useState({
    name: "",
    start: "",
    end: "",
    problemType: "",
  })
  const [errors, setErrors] = useState({})
  const [original, setOriginal] = useState(null)

  // Initialize form when existing round is loaded
  useEffect(() => {
    if (existing) {
      const init = {
        name: existing.name || existing.roundName || "",
        start: existing.start || "",
        end: existing.end || "",
        problemType: existing.problemType || "",
      }
      setForm(init)
      setOriginal(init)
    }
  }, [existing])

  // Check if form has unsaved changes
  const hasChanges = useMemo(() => {
    if (!original) return false
    return Object.keys(form).some((key) => form[key] !== original[key])
  }, [form, original])

  // Breadcrumbs
  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
        contestId,
        contest?.name ?? "Contest",
        existing?.name ?? "Edit Round"
      ),
    [contestId, contest?.name, existing?.name]
  )

  const breadcrumbPaths = useMemo(
    () => [
      "/organizer/contests",
      `/organizer/contests/${contestId}`,
      `/organizer/contests/${contestId}/rounds/${roundId}/edit`,
    ],
    [contestId, roundId]
  )

  // Submit handler
  const handleSubmit = async () => {
    // ✅ validate before API
    const validationErrors = validateRound(
      form,
      contest,
      roundsData?.data || [],
      { isEdit: true }
    )
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      await updateRound({
        id: roundId,
        data: form,
      }).unwrap()
      toast.success("Round updated")
      navigate(`/organizer/contests/${contestId}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update round")
    }
  }

  // Show loading until both contest and round data are ready
  if (contestLoading || roundsLoading || !existing) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={true}
      />
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={false}
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
