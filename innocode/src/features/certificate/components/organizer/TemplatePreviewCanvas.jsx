import React, { useEffect, useRef } from "react"

export default function TemplatePreviewCanvas({ template, zoom = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!template?.fileUrl) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = template.fileUrl

    // Handle image load error
    img.onerror = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw a placeholder
      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#999"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Image not found", canvas.width / 2, canvas.height / 2)
    }

    img.onload = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Scale image to fit width (like Konva)
      const scale = (w / img.width) * zoom
      const imgWidth = img.width * scale
      const imgHeight = img.height * scale

      ctx.drawImage(img, 0, 0, imgWidth, imgHeight)

      const t = template.text
      if (t) {
        const fontSizeScaled = (t.fontSize || 48) * scale
        ctx.font = `${fontSizeScaled}px ${t.fontFamily || "Arial"}`
        ctx.fillStyle = t.colorHex || "#000"
        ctx.textBaseline = "top"

        const textX = (t.x || 0) * scale
        const textY = (t.y || 0) * scale
        const maxWidthScaled = (t.maxWidth || img.width) * scale
        const align = t.align || "left"

        // Draw multi-line text with wrapping
        function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, align) {
          const words = text.split(" ")
          let line = ""
          const lines = []

          for (let n = 0; n < words.length; n++) {
            const testLine = line ? line + " " + words[n] : words[n]
            const metrics = ctx.measureText(testLine)
            if (metrics.width > maxWidth && line) {
              lines.push(line)
              line = words[n]
            } else {
              line = testLine
            }
          }
          lines.push(line)

          lines.forEach((lineText, i) => {
            let drawX = x
            if (align === "center") drawX = x + maxWidth / 2
            if (align === "right") drawX = x + maxWidth
            ctx.textAlign = align
            ctx.fillText(lineText, drawX, y + i * lineHeight)
          })
        }

        drawWrappedText(
          ctx,
          t.value || "Nguyen Van A",
          textX - maxWidthScaled / 2,
          textY,
          maxWidthScaled,
          fontSizeScaled,
          align
        )
      }
    }
  }, [template, zoom])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={225}
      className="absolute inset-0 w-full h-full rounded-t-[5px]"
    />
  )
}
