import React, { useEffect, useRef } from "react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"
import TemplatePreview from "./TemplatePreview"
import TemplateFileUpload from "./TemplateFileUpload"
import TextOverlaySettings from "./TextOverlaySettings"

export default function CertificateTemplateForm({
  formData,
  setFormData,
  errors = {},
}) {
  const imgRef = useRef(null)

  // Initialize text overlay
  useEffect(() => {
    if (!formData.text) {
      setFormData((prev) => ({
        ...prev,
        text: {
          fontFamily: "Arial",
          fontSize: 24,
          colorHex: "#000000",
          x: 50,
          y: 50,
          maxWidth: 300,
          align: "left",
        },
      }))
    }
  }, [formData.text, setFormData])

  // Get image dimensions
  useEffect(() => {
    if (imgRef.current && !formData.imgWidth) {
      setFormData((prev) => ({
        ...prev,
        imgWidth: imgRef.current.width,
        imgHeight: imgRef.current.height,
      }))
    }
  }, [formData.imgWidth, setFormData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      {/* Image: 2/3 width */}
      <div className="col-span-2">
        <TemplatePreview formData={formData} imgRef={imgRef} />
      </div>

      {/* Editor: 1/3 width */}
      <div className="col-span-1 flex flex-col gap-3">
        <TextFieldFluent
          label="Template Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TemplateFileUpload
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />

        <TextOverlaySettings formData={formData} setFormData={setFormData} />
      </div>
    </div>
  )
}
