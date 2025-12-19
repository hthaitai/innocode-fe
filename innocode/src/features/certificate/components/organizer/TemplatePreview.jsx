import { ArrowLeft } from "lucide-react"
import React, { useRef, useState, useEffect } from "react"
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Rect,
  Group,
} from "react-konva"
import useImage from "use-image"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { FileDropzone } from "../../../../shared/components/dropzone/FileDropzone"

export default function TemplatePreview({ formData, setFormData, zoom }) {
  const fileInputRef = useRef(null)
  const groupRef = useRef(null)
  const [imageUrl, setImageUrl] = useState(null)

  const textToShow = {
    value: formData.text?.value || "Nguyen Van A",
    x: formData.text?.x ?? 0,
    y: formData.text?.y ?? 0,
    fontSize: formData.text?.fontSize ?? 64,
    fontFamily: formData.text?.fontFamily ?? "Arial",
    colorHex: formData.text?.colorHex ?? "#1F2937",
    maxWidth: formData.text?.maxWidth ?? 1600,
    align: formData.text?.align ?? "center",
  }

  // Handle file / URL changes
  useEffect(() => {
    if (!formData.file && !formData.fileUrl) {
      setImageUrl(null)
      return
    }

    if (formData.file) {
      if (formData.file.type === "application/pdf") {
        setImageUrl("/pdf-placeholder.png")
      } else {
        const url = URL.createObjectURL(formData.file)
        setImageUrl(url)
        return () => URL.revokeObjectURL(url)
      }
    } else {
      setImageUrl(formData.fileUrl)
    }
  }, [formData.file, formData.fileUrl])

  const [image] = useImage(imageUrl, "anonymous")

  // Use image width for base scaling, fallback to 1
  const baseScale = image ? 1 : 1
  const scale = baseScale * zoom

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setFormData((p) => ({ ...p, file }))
  }

  const handleDragEnd = () => {
    if (!groupRef.current) return
    const { x, y } = groupRef.current.position()
    setFormData((prev) => ({
      ...prev,
      text: {
        ...prev.text,
        x: Math.round(x),
        y: Math.round(y),
      },
    }))
  }

  // TemplatePreview
  if (!imageUrl) {
    return (
      <div>
        <FileDropzone
          selectedFile={formData.file}
          onFileSelected={(file) => setFormData((prev) => ({ ...prev, file }))}
          label="Drag & drop your template image here or click to select"
          accept={{ "image/*": [], "application/pdf": [] }}
          noBorder
        />
      </div>
    )
  }

  // Show spinner while image is loading
  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Spinner />
        <p className="text-sm leading-4">Loading image...</p>
      </div>
    )
  }

  return (
    <Stage
      width={image.width * scale}
      height={image.height * scale}
      scaleX={scale}
      scaleY={scale}
    >
      <Layer>
        <KonvaImage image={image} />
        {textToShow && (
          <Group
            ref={groupRef}
            x={textToShow.x}
            y={textToShow.y}
            draggable
            onDragEnd={handleDragEnd}
          >
            <Rect
              width={textToShow.maxWidth}
              height={textToShow.fontSize}
              stroke="red"
            />
            <Text
              text={textToShow.value}
              fontSize={textToShow.fontSize}
              fontFamily={textToShow.fontFamily}
              fill={textToShow.colorHex}
              width={textToShow.maxWidth}
              align={textToShow.align}
            />
          </Group>
        )}
      </Layer>
    </Stage>
  )
}
