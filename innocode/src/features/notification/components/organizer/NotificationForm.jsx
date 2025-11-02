import React from "react"
import DropdownFluent from "@/shared/components/DropdownFluent"

export default function NotificationForm({ formData, setFormData, errors }) {
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Type */}
      <div>
        <DropdownFluent
          label="Type"
          options={[
            { label: "Round Opened", value: "round_opened" },
            { label: "Result Published", value: "result_published" },
          ]}
          value={formData.type || ""}
          onChange={(val) => handleChange("type", val)}
          placeholder="Select notification type"
        />
        {errors.type && (
          <p className="text-xs text-red-500 mt-1">{errors.type}</p>
        )}
      </div>

      {/* Channel */}
      <div>
        <DropdownFluent
          label="Channel"
          options={[
            { label: "Web", value: "web" },
            { label: "Email", value: "email" },
          ]}
          value={formData.channel || ""}
          onChange={(val) => handleChange("channel", val)}
          placeholder="Select channel"
        />
        {errors.channel && (
          <p className="text-xs text-red-500 mt-1">{errors.channel}</p>
        )}
      </div>

      {/* Payload (message) */}
      <div>
        <div className="text-xs leading-4 mb-2 text-[#7A7574] capitalize">
          Message
        </div>
        <textarea
          name="payload"
          value={formData.payload || ""}
          onChange={(e) => handleChange("payload", e.target.value)}
          className={`w-full border rounded-[5px] px-3 py-2 text-sm leading-5 bg-white border-[#ECECEC] border-b-[#D3D3D3] focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 ${
            errors.payload ? "border-red-400" : ""
          }`}
          rows={4}
          placeholder="Enter notification message"
        />
        {errors.payload && (
          <p className="text-xs text-red-500 mt-1">{errors.payload}</p>
        )}
      </div>
    </div>
  )
}
