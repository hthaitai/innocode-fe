import React, { useEffect, useRef, useState } from "react"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"
import TemplatePreview from "./TemplatePreview"
import TemplateFileUpload from "./TemplateFileUpload"
import TextOverlaySettings from "./TextOverlaySettings"
import { ArrowLeft, ZoomIn, ZoomOut } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

export default function CertificateTemplateForm({
  formData,
  setFormData,
  errors = {},
  onSubmit,
  submitting,
  mode = "create",
  hasChanges = true,
}) {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [zoom, setZoom] = useState(1)
  const hasImage = !!formData.file || !!formData.fileUrl

  return (
    <div className="flex h-full">
      {/* Left editor column */}
      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        {/* Header */}
        <div className="p-2 flex items-center gap-2 border-b border-[#E5E5E5]">
          <button
            className="w-10 h-9 rounded-[5px] cursor-pointer hover:bg-[#EAEAEA] transition flex items-center justify-center"
            onClick={() =>
              navigate(
                `/organizer/contests/${contestId}/certificates/templates`
              )
            }
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-sm">Back to templates</span>
        </div>

        {/* Preview fills remaining space */}
        <div className="flex-1 min-h-0 overflow-auto">
          <TemplatePreview
            formData={formData}
            setFormData={setFormData}
            zoom={zoom}
          />
        </div>

        {/* Fixed-height zoom bar */}
        {hasImage && (
          <div className="border-t border-[#E5E5E5] px-5 py-2 shrink-0 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ZoomIn size={16} />
            </button>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.2))}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="0.2"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />

            <span className="w-12 text-right text-sm">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Scrollable Editor Drawer */}
      {hasImage && (
        <div className="w-[320px] bg-white border-l border-[#E5E5E5] overflow-y-auto max-h-screen">
          <div className="flex justify-end p-5">
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting || (mode === "edit" && !hasChanges)}
              className={`flex items-center justify-center gap-2 ${
                submitting || (mode === "edit" && !hasChanges)
                  ? "button-gray"
                  : "button-orange"
              }`}
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
              )}
              {submitting
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                ? "Update"
                : "Create"}
            </button>
          </div>

          <div className="space-y-3 border-t border-[#E5E5E5] p-5">
            <TextFieldFluent
              label="Template name"
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
          </div>

          <div className="border-t border-[#E5E5E5] p-5">
            <TextOverlaySettings
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </div>
      )}
    </div>
  )
}
