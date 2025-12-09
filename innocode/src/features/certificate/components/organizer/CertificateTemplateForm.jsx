import React, { useEffect, useRef } from "react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"
import TemplatePreview from "./TemplatePreview"
import TemplateFileUpload from "./TemplateFileUpload"
import TextOverlaySettings from "./TextOverlaySettings"

export default function CertificateTemplateForm({
  formData,
  setFormData,
  errors = {},
  onSubmit,
  submitting,
}) {
  const imgRef = useRef(null)

  const hasImage = !!formData.file // <-- check if an image is uploaded

  useEffect(() => {
    if (formData.file && !formData.text) {
      setFormData((prev) => ({
        ...prev,
        text: {
          value: "Text",
          x: 50,
          y: 50,
          fontSize: 24,
          fontFamily: "Arial",
          colorHex: "#000000",
          maxWidth: 300,
          align: "left",
        },
      }))
    }
  }, [formData.file])

  return (
    <div className="flex gap-1 h-full">
      {/* Fixed Preview Area */}
      <div className="flex-1">
        <TemplatePreview
          formData={formData}
          setFormData={setFormData}
          imgRef={imgRef}
        />
      </div>

      {/* Scrollable Editor Drawer */}
      <div className="w-[380px] bg-white rounded-[5px] border border-[#E5E5E5] overflow-y-auto p-4 max-h-screen">
        {hasImage ? (
          <>
            <TextFieldFluent
              label="Template Name"
              name="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={!!errors.name}
              helperText={errors.name}
            />

            <TemplateFileUpload
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />

            <TextOverlaySettings
              formData={formData}
              setFormData={setFormData}
            />

            <div className="flex justify-end pt-8">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className={`flex items-center justify-center gap-2 ${
                  submitting ? "button-gray" : "button-orange"
                }`}
              >
                {submitting && (
                  <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
                )}
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            Please upload a template image to edit the fields.
          </p>
        )}
      </div>
    </div>
  )
}
