import React from "react"
import { Icon } from "@iconify/react"

export default function ProfileHeader({ user, role }) {
  return (
    <div className="flex items-start gap-6 mb-6">
      <div className="w-32 h-32 rounded-full bg-gradient-to-b from-orange-400 to-orange-200 shadow-md" />
      <div>
        <h2 className="text-3xl font-bold">{user?.fullName || user?.name}</h2>
        <div className="text-base text-gray-600">{user?.email}</div>
        <div className="text-sm text-gray-500">
          {role.charAt(0).toUpperCase() + role.slice(1)} account
        </div>
      </div>
    </div>
  )
}

