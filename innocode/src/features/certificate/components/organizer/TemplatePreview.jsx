import React, { useRef, useState, useEffect } from "react"
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
} from "react-konva"

export default function TemplatePreview({ formData, setFormData }) {
  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [imageObj, setImageObj] = useState(null)
  const [stageScale, setStageScale] = useState(1)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })

  // Track container size
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      setContainerSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      })
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Load image
  useEffect(() => {
    if (!formData.file) return
    const url =
      formData.file.type === "application/pdf"
        ? "/pdf-placeholder.png"
        : URL.createObjectURL(formData.file)

    const img = new window.Image()
    img.src = url
    img.onload = () => setImageObj(img)

    return () => {
      if (formData.file.type !== "application/pdf") URL.revokeObjectURL(url)
    }
  }, [formData.file])

  // Compute image fit & scale
  const getImageFit = () => {
    if (!imageObj) return { width: 0, height: 0, scaleX: 1, scaleY: 1 }
    const scaleX = containerSize.width / imageObj.width
    const scaleY = containerSize.height / imageObj.height
    const scale = Math.min(scaleX, scaleY) // keep aspect ratio
    return {
      width: imageObj.width * scale,
      height: imageObj.height * scale,
      scale,
    }
  }

  const {
    width: fitWidth,
    height: fitHeight,
    scale: imageScale,
  } = getImageFit()
  const imageOffset = {
    x: (containerSize.width - fitWidth) / 2,
    y: (containerSize.height - fitHeight) / 2,
  }

  // Zoom handler
  const handleWheel = (e) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const oldScale = stageScale
    const pointer = {
      x: (e.evt.x - stagePosition.x) / oldScale,
      y: (e.evt.y - stagePosition.y) / oldScale,
    }
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    const clamped = Math.max(0.2, Math.min(4, newScale))
    setStageScale(clamped)
    setStagePosition({
      x: e.evt.x - pointer.x * clamped,
      y: e.evt.y - pointer.y * clamped,
    })
  }

  // Text drag handler
  const handleTextDragEnd = (e) => {
    const { x, y } = e.target.position()
    setFormData((prev) => ({
      ...prev,
      text: {
        ...prev.text,
        x: Math.round((x - imageOffset.x) / imageScale), // round to integer
        y: Math.round((y - imageOffset.y) / imageScale),
      },
    }))
  }

  // Handle file input directly if needed
  const fileInputRef = useRef(null)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFormData((prev) => ({ ...prev, file }))
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {!formData.file && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-[5px] border border-[#E5E5E5]">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
          />
          <button
            className="button-orange"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Template
          </button>
          <p className="text-gray-500 mt-2">
            Upload a template image to start editing.
          </p>
        </div>
      )}

      {imageObj && containerSize.width > 0 && containerSize.height > 0 && (
        <Stage
          width={containerSize.width}
          height={containerSize.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePosition.x}
          y={stagePosition.y}
          draggable
          onWheel={handleWheel}
          style={{ background: "#f0f0f0" }}
          className="rounded-[5px] border border-[#E5E5E5]"
        >
          <Layer>
            <KonvaImage
              image={imageObj}
              width={fitWidth}
              height={fitHeight}
              x={imageOffset.x}
              y={imageOffset.y}
            />

            {formData.text && (
              <KonvaText
                text={formData.text.value}
                x={imageOffset.x + formData.text.x * imageScale}
                y={imageOffset.y + formData.text.y * imageScale}
                fontSize={formData.text.fontSize * imageScale}
                fontFamily={formData.text.fontFamily}
                fill={formData.text.colorHex}
                width={formData.text.maxWidth * imageScale}
                align={formData.text.align}
                draggable
                onDragEnd={handleTextDragEnd}
              />
            )}
          </Layer>
        </Stage>
      )}
    </div>
  )
}
