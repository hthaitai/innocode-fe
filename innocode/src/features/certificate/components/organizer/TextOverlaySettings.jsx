import React from "react"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import DropdownFluent from "../../../../shared/components/DropdownFluent"
import Label from "../../../../shared/components/form/Label"
import { useTranslation } from "react-i18next"

export default function TextOverlaySettings({ formData, setFormData }) {
  const { t } = useTranslation(["certificate"])
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
    { label: t("certificate:overlay.left"), value: "left" },
    { label: t("certificate:overlay.center"), value: "center" },
    { label: t("certificate:overlay.right"), value: "right" },
  ]

  return (
    <div className="space-y-5 text-sm leading-5">
      {/* Font Family Dropdown */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="fontFamily" className="mb-1 block">
          {t("certificate:overlay.fontFamily")}
        </Label>
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
          placeholder={t("certificate:overlay.selectFont")}
          disabled
        />
      </div>

      {/* Font Size */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="fontSize" className="mb-1 block">
          {t("certificate:overlay.fontSize")}
        </Label>
        <TextFieldFluent
          id="fontSize"
          name="fontSize"
          type="number"
          value={formData.text?.fontSize || 24}
          onChange={handleTextChange}
          disabled
        />
      </div>

      {/* Color Hex */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="colorHex" className="mb-1 block">
          {t("certificate:overlay.colorHex")}
        </Label>
        <TextFieldFluent
          id="colorHex"
          name="colorHex"
          value={formData.text?.colorHex || "#000000"}
          onChange={handleTextChange}
          placeholder="#000000"
          disabled
        />
      </div>

      {/* X Position */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="x" className="mb-1 block">
          {t("certificate:overlay.xPosition")}
        </Label>
        <TextFieldFluent
          id="x"
          name="x"
          type="number"
          value={formData.text?.x}
          onChange={handleTextChange}
        />
      </div>

      {/* Y Position */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="y" className="mb-1 block">
          {t("certificate:overlay.yPosition")}
        </Label>
        <TextFieldFluent
          id="y"
          name="y"
          type="number"
          value={formData.text?.y}
          onChange={handleTextChange}
        />
      </div>

      {/* Max Width */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="maxWidth" className="mb-1 block">
          {t("certificate:overlay.maxWidth")}
        </Label>
        <TextFieldFluent
          id="maxWidth"
          name="maxWidth"
          type="number"
          value={formData.text?.maxWidth || 300}
          onChange={handleTextChange}
          disabled
        />
      </div>

      {/* Text Align Dropdown */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="align" className="mb-1 block">
          {t("certificate:overlay.textAlign")}
        </Label>
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
          placeholder={t("certificate:overlay.selectAlign")}
          disabled
        />
      </div>
    </div>
  )
}
