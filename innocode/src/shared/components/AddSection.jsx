import React from "react"

/**
 * General-purpose "Add Section" component.
 * Displays an icon, title, subtitle, and an add button.
 *
 * Example:
 * <AddSection
 *   icon={Trophy}
 *   title="Contest Management"
 *   subtitle="Create and manage contests"
 *   addLabel="Add contest"
 *   onAdd={handleAdd}
 * />
 */

const AddSection = ({
  icon: Icon,
  title,
  subtitle,
  addLabel = "Add",
  onAdd,
  className = "",
}) => {
  return (
    <div
      className={`border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] ${className}`}
    >
      <div className="flex gap-5 items-center">
        {Icon && <Icon size={20} />}
        <div>
          <p className="text-[14px] leading-[20px]">{title}</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {subtitle}
          </p>
        </div>
      </div>

      <button className="button-orange" onClick={onAdd}>
        {addLabel}
      </button>
    </div>
  )
}

export default AddSection
