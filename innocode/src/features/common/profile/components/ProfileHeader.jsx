import React from "react"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export default function ProfileHeader({ user, role }) {
  const { t } = useTranslation("common")
  const { t: tPages } = useTranslation("pages")
  const initials = (user?.fullName || user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-6 p-6 bg-white rounded-[5px] border border-[#E5E5E5]">
      <div className="flex-shrink-0">
        <div className="w-[80px] h-[80px] rounded-[5px] bg-[#E05307] flex items-center justify-center text-white text-title-1">
          {initials}
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <h2 className="text-title-2 text-[#18181B] m-0">
          {user?.fullName || user?.name}
        </h2>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[#52525B]">
            <Icon
              icon="mdi:email-outline"
              width="20"
              className="text-[#A1A1AA]"
            />
            <span className="text-body-1">{user?.email}</span>
          </div>
          {user?.details?.schoolName && (
            <div className="flex items-center gap-2 text-[#52525B]">
              <Icon
                icon="mdi:school-outline"
                width="20"
                className="text-[#A1A1AA]"
              />
              <span className="text-body-1">{user?.details.schoolName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
