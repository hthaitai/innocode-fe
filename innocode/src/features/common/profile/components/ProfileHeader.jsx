import React from "react"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"

export default function ProfileHeader({ user, role }) {
  const initials = (user?.fullName || user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6 mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
    >
      <div className="relative group">
        <div className="w-[100px] h-[100px] rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] shadow-lg flex items-center justify-center text-white text-3xl font-bold transform transition-transform duration-300">
          {initials}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-bold text-2xl text-gray-900 tracking-tight">
            {user?.fullName || user?.name}
          </h2>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {role}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Icon icon="mdi:email-outline" className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          {user?.details?.schoolName && (
            <div className="flex items-center gap-2 text-gray-500">
              <Icon icon="mdi:school-outline" className="w-4 h-4" />
              <span className="text-sm font-medium">
                {user?.details.schoolName}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex gap-4">
        <div className="text-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-xs text-gray-400 font-bold uppercase mb-0.5">
            Role
          </div>
          <div className="text-sm font-bold text-gray-700 capitalize">
            {role}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
