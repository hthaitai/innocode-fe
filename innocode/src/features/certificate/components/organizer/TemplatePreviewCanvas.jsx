import React, { useEffect, useRef } from "react"

export default function TemplatePreviewCanvas({ template }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!template?.fileUrl) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = template.fileUrl

    img.onload = () => {
      // Fit the image into the canvas (card size)
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Draw the background image cropped to cover
      const imgRatio = img.width / img.height
      const canvasRatio = w / h

      let drawWidth = w
      let drawHeight = h

      if (imgRatio > canvasRatio) {
        drawHeight = h
        drawWidth = img.width * (h / img.height)
      } else {
        drawWidth = w
        drawHeight = img.height * (w / img.width)
      }

      const offsetX = (w - drawWidth) / 2
      const offsetY = (h - drawHeight) / 2

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      // Render sample text
      const t = template.text
      ctx.font = `${t.fontSize / 3}px ${t.fontFamily}`
      ctx.fillStyle = t.colorHex
      ctx.textAlign = t.align

      // Convert original coordinates to thumbnail scale
      const scaleX = w / img.width
      const scaleY = h / img.height

      const textX = t.x * scaleX
      const textY = t.y * scaleY

      ctx.fillText("Sample Text", textX, textY)
    }
  }, [template])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={225}
      className="absolute inset-0 w-full h-full rounded-t-[5px]"
    />
  )
}
