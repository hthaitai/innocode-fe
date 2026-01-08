import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { ArrowLeft, Loader } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import CertificateTemplateForm from "../../components/organizer/CertificateTemplateForm"

import { useUploadCertificateTemplateMutation } from "../../../../services/certificateApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { validateTemplate } from "../../validators/templateValidator"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { useTranslation } from "react-i18next"

const EMPTY_TEMPLATE = {
  name: "",
  fileUrl: null,
  text: {
    value: "Nguyen Van A",
    x: 0,
    y: 0,
    fontSize: 64,
    fontFamily: "Arial",
    colorHex: "#1F2937",
    maxWidth: 1600,
    align: "center",
  },
}

export default function OrganizerCertificateTemplateCreate() {
  const { t } = useTranslation(["certificate"])
  const { contestId } = useParams()
  const navigate = useNavigate()

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const [uploadTemplate] = useUploadCertificateTemplateMutation()
  const [formData, setFormData] = useState(EMPTY_TEMPLATE)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (submitting) return

    const validationErrors = validateTemplate(formData, { t })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      let uploadedFileUrl = formData.fileUrl

      if (formData.file && !formData.fileUrl) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", formData.file)
        formDataUpload.append("upload_preset", "certificate-templates")
        formDataUpload.append("folder", "certificate-templates")

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dkb7cihxq/auto/upload",
          { method: "POST", body: formDataUpload }
        )
        const data = await res.json()
        uploadedFileUrl = data.url
      }

      const payload = {
        contestId,
        name: formData.name.trim(),
        fileUrl: uploadedFileUrl,
        text: { ...formData.text },
      }

      await uploadTemplate(payload).unwrap()

      toast.success(t("certificate:createSuccess"))
      navigate(`/organizer/contests/${contestId}/certificates/templates`)
    } catch (err) {
      console.error(err)
      toast.error(t("certificate:somethingWrong"))
    } finally {
      setSubmitting(false)
    }
  }

  if (contestLoading)
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-3">
        <Spinner />
        <p className="text-sm leading-5">{t("certificate:loading")}</p>
      </div>
    )

  if (contestError || !contest) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 text-sm leading-5">
          {t("certificate:errorContestNotFound")}
        </p>
        <button onClick={() => navigate("/")} className="button-orange">
          {t("certificate:backToHome")}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <CertificateTemplateForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  )
}
