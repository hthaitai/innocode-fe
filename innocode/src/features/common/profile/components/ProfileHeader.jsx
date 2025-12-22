import React from "react"
import { Icon } from "@iconify/react"

export default function ProfileHeader({ user, role }) {
  return (
    <div className="flex items-center gap-5 mb-5">
      <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-b from-orange-400 to-orange-200 shadow-md" />
      <div>
        <h2 className="font-medium text-base leading-[22px]">{user?.fullName || user?.name}</h2>
        <div className="text-sm leading-5">{user?.email}</div>
        <div className="text-sm leading-5">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>
      </div>
    </div>
  )
}

