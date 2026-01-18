import React from "react"

const MetricCard = ({ icon: Icon, iconBgColor, iconColor, label, value }) => {
  const displayValue = value || 0

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5 h-[160px]">
      <div className="flex items-center gap-2 mb-5">
        <Icon className={`w-4 h-4 ${iconColor}`} />

        <span className="text-caption-1 text-gray-600">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 text-title-2">
        <span>{displayValue}</span>
      </div>
    </div>
  )
}

export default MetricCard
