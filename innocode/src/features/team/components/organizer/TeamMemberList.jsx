import React from "react"
import { User } from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useTranslation } from "react-i18next"

const TeamMemberList = ({ members }) => {
  const { t } = useTranslation("common")

  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">
        {t("teams.memberList")}
      </div>
      <div className="flex flex-col gap-1">
        {members?.length > 0 ? (
          members.map((member) => (
            <div
              key={member.studentId}
              className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3 flex justify-between items-center min-h-[70px]"
            >
              <div className="flex gap-5 items-center">
                <User size={20} />

                <div>
                  <p className="text-[14px] leading-[20px]">
                    {member.studentFullname}
                  </p>

                  <div className="flex items-center gap-[10px] text-[12px] leading-[16px] text-[#7A7574]">
                    <p>{member.studentEmail}</p>
                    <span>|</span>
                    <p>{formatDateTime(member.joinedAt)}</p>
                  </div>
                </div>
              </div>

              <div
                className={`text-sm leading-5 font-semibold ${
                  member.memberRole === "Leader"
                    ? "animated-rainbow"
                    : "text-[#7A7574]"
                }`}
              >
                {member.memberRole
                  ? t(`teams.roles.${member.memberRole}`)
                  : t("teams.memberRole")}
              </div>
            </div>
          ))
        ) : (
          <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
            {t("teams.noMembers")}
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamMemberList
