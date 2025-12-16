import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "../../../../shared/components/DropdownFluent"
import Label from "../../../../shared/components/form/Label"

export default function TextOverlaySettings({ formData, setFormData }) {
  const handleTextChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      text: {
        ...prev.text,
        [name]:
          name === "x" ||
          name === "y" ||
          name === "fontSize" ||
          name === "maxWidth"
            ? parseInt(value, 10)
            : value,
      },
    }))
  }

  const fontOptions = [
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
  ]

  const alignOptions = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ]

  return (
    <div>
      <h4 className="text-xs leading-4 mb-2">Text overlay settings</h4>

      <div className="text-sm leading-5 grid grid-cols-[max-content_1fr] gap-x-[28px] gap-y-3 items-start">
        {/* Text Value */}
        <Label htmlFor="value">Text Value</Label>
        <TextFieldFluent
          id="value"
          name="value"
          value={formData.text?.value || ""}
          onChange={handleTextChange}
          placeholder="Enter text"
        />

        {/* Font Family Dropdown */}
        <Label htmlFor="fontFamily">Font Family</Label>
        <DropdownFluent
          id="fontFamily"
          options={fontOptions}
          value={formData.text?.fontFamily || ""}
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              text: { ...prev.text, fontFamily: val },
            }))
          }
          placeholder="Select font"
        />

        {/* Font Size */}
        <Label htmlFor="fontSize">Font Size</Label>
        <TextFieldFluent
          id="fontSize"
          name="fontSize"
          type="number"
          value={formData.text?.fontSize || 24}
          onChange={handleTextChange}
        />

        {/* Color Hex */}
        <Label htmlFor="colorHex">Color Hex</Label>
        <TextFieldFluent
          id="colorHex"
          name="colorHex"
          value={formData.text?.colorHex || "#000000"}
          onChange={handleTextChange}
          placeholder="#000000"
        />

        {/* X Position */}
        <Label htmlFor="x">X Position</Label>
        <TextFieldFluent
          id="x"
          name="x"
          type="number"
          value={formData.text?.x || 50}
          onChange={handleTextChange}
        />

        {/* Y Position */}
        <Label htmlFor="y">Y Position</Label>
        <TextFieldFluent
          id="y"
          name="y"
          type="number"
          value={formData.text?.y || 50}
          onChange={handleTextChange}
        />

        {/* Max Width */}
        <Label htmlFor="maxWidth">Max Width</Label>
        <TextFieldFluent
          id="maxWidth"
          name="maxWidth"
          type="number"
          value={formData.text?.maxWidth || 300}
          onChange={handleTextChange}
        />

        {/* Text Align Dropdown */}
        <Label htmlFor="align">Text Align</Label>
        <DropdownFluent
          id="align"
          options={alignOptions}
          value={formData.text?.align || "left"}
          onChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              text: { ...prev.text, align: val },
            }))
          }
          placeholder="Select alignment"
        />
      </div>
    </div>
  )
}
