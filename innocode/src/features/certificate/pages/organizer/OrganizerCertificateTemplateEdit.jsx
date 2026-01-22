import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { toast } from "react-hot-toast"
import { ArrowLeft } from "lucide-react"
import CertificateTemplateForm from "../../components/organizer/CertificateTemplateForm"
import {
  useEditCertificateTemplateMutation,
  useGetCertificateTemplateByIdQuery,
} from "../../../../services/certificateApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { validateTemplate } from "../../validators/templateValidator"
import { useTranslation } from "react-i18next"

export default function OrganizerCertificateTemplateEdit() {
  const { t } = useTranslation(["certificate", "common", "errors"])
  const { contestId, templateId } = useParams()
  const navigate = useNavigate()

  const isValidContestId = uuidValidate(contestId)
  const isValidTemplateId = uuidValidate(templateId)

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: templateData,
    isLoading: templateLoading,
    error: templateError,
  } = useGetCertificateTemplateByIdQuery(templateId, {
    skip: !isValidTemplateId,
  })

  const [editTemplate] = useEditCertificateTemplateMutation()
  const [formData, setFormData] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Initialize form data from template
  useEffect(() => {
    if (templateData?.data) {
      const template = templateData.data
      const initial = {
        name: template.name || "",
        file: null, // We don't have the file, only the URL
        fileUrl: template.fileUrl || null,
        text: template.text || null,
      }
      setInitialData(initial)
      setFormData(initial)
    }
  }, [templateData])

  // Check if form has changes
  const hasChanges = () => {
    if (!formData || !initialData) return false

    // Check name
    if (formData.name !== initialData.name) return true

    // Check if file was changed (new file uploaded)
    if (formData.file && !initialData.file) return true

    // Check text overlay settings
    if (formData.text && initialData.text) {
      const textKeys = [
        "value",
        "x",
        "y",
        "fontSize",
        "fontFamily",
        "colorHex",
        "maxWidth",
        "align",
      ]
      for (const key of textKeys) {
        if (formData.text[key] !== initialData.text[key]) return true
      }
    } else if (formData.text !== initialData.text) {
      return true
    }

    return false
  }

  const handleSubmit = async () => {
    if (submitting) return

    // Check if there are any changes
    if (!hasChanges()) {
      toast.error(t("certificate:noChanges"))
      return
    }

    const validationErrors = validateTemplate(formData, { t })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error(t("certificate:fixErrors"))
      return
    }

    setSubmitting(true)
    try {
      let uploadedFileUrl = formData.fileUrl

      // Only upload new file if one was selected
      if (formData.file && !formData.fileUrl) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", formData.file)
        formDataUpload.append("upload_preset", "certificate-templates")
        formDataUpload.append("folder", "certificate-templates")

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dkb7cihxq/auto/upload",
          { method: "POST", body: formDataUpload },
        )
        const data = await res.json()
        uploadedFileUrl = data.url
      }

      const payload = {
        name: formData.name.trim(),
        fileUrl: uploadedFileUrl,
        text: formData.text ? { ...formData.text } : null,
      }

      await editTemplate({ id: templateId, body: payload }).unwrap()

      toast.success(t("certificate:updateSuccess"))
      navigate(`/organizer/contests/${contestId}/certificates/templates`)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || t("certificate:somethingWrong"))
    } finally {
      setSubmitting(false)
    }
  }

  if (contestLoading || templateLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        {t("certificate:loading")}
      </div>
    )

  if (contestError || !contest || !isValidContestId) {
    let errorMessage = t("certificate:errorContestNotFound")

    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 text-sm leading-5">
          {t("common:common.contest")}: {errorMessage}
        </p>
        <button
          onClick={() => navigate("/organizer/contests")}
          className="button-orange"
        >
          {t("certificate:backToHome", { defaultValue: "Back to Contests" })}
        </button>
      </div>
    )
  }

  if (templateError || !templateData || !isValidTemplateId) {
    let errorMessage = t("certificate:errorLoading")

    if (!isValidTemplateId) {
      errorMessage = t("errors:common.invalidId")
    } else if (templateError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (templateError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 text-sm leading-5">
          {t("certificate:template", { defaultValue: "Template" })}:{" "}
          {errorMessage}
        </p>
        <button
          onClick={() =>
            navigate(`/organizer/contests/${contestId}/certificates/templates`)
          }
          className="button-orange"
        >
          {t("certificate:backToTemplates", {
            defaultValue: "Back to Templates",
          })}
        </button>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="h-screen flex items-center justify-center">
        {t("certificate:loadingData")}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 px-5 pb-5 overflow-hidden">
        <CertificateTemplateForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleSubmit}
          submitting={submitting}
          mode="edit"
          hasChanges={hasChanges()}
        />
      </div>
    </div>
  )
}
