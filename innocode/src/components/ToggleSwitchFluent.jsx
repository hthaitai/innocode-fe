import React from "react"

const ToggleSwitchFluent = ({
  enabled,
  onChange,
  labelLeft = "Leaderboard Frozen",
  labelRight = "Leaderboard Active",
  labelPosition = "left",
}) => {
  const dynamicLabel = enabled ? labelLeft : labelRight

  return (
    <div className="flex items-center gap-2">
      {labelPosition === "left" && (
        <span className="text-sm">
          {dynamicLabel}
        </span>
      )}

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-10 h-5 rounded-full transition-colors duration-200 border ${
            enabled
              ? "bg-[#E05307] border-[#E05307]"
              : "bg-white border-[#7A7574]"
          }`}
        >
          <span
            className={`absolute top-1 left-0 w-3 h-3  rounded-full shadow transform transition-transform duration-200 ${
              enabled ? "translate-x-6 bg-white" : "translate-x-1 bg-[#7A7574]"
            }`}
          />
        </div>
      </label>

      {labelPosition === "right" && (
        <span className="text-sm">
          {dynamicLabel}
        </span>
      )}
    </div>
  )
}

export default ToggleSwitchFluent
