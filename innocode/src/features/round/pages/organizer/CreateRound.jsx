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

const EMPTY = { name: "", start: "", end: "", problemType: "" }

const CreateRound = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [createRound, { isLoading }] = useCreateRoundMutation()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)

  const breadcrumbItems = useMemo(
    () =>
      BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
        contestId,
        contest?.name ?? "Contest",
        "New Round"
      ),
    [contestId, contest?.name]
  )

  const breadcrumbPaths = useMemo(
    () => [
      "/organizer/contests",
      `/organizer/contests/${contestId}`,
      `/organizer/contests/${contestId}/rounds/new`,
    ],
    [contestId]
  )

  const handleSubmit = async () => {
    // ✅ validate before API
    const validationErrors = validateRound(form, contest)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      await createRound({ contestId, data: form }).unwrap()
      toast.success("Round created")
      navigate(`/organizer/contests/${contestId}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to create round")
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
