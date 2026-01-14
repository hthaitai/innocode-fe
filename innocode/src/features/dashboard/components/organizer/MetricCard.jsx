import React from "react"

const MetricCard = ({ icon: Icon, iconBgColor, iconColor, label, value }) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5 h-[160px]">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-full rounded-full ${iconBgColor} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-caption-1 text-gray-600">{label}</span>
      </div>
      <div className="text-title-2 text-gray-800">{value || 0}</div>
    </div>
  )
}

export default MetricCard
