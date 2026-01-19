import { Link } from "react-router-dom"
import {
  Users,
  Trophy,
  Award,
  ChevronRight,
  Scale,
  Mail,
  UserCheck,
  LayoutTemplate,
  FileBadge2,
  UsersRound,
  GraduationCap,
  Gavel,
} from "lucide-react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"

const ContestRelatedSettings = ({ contestId }) => {
  const { t } = useTranslation("pages")

  const items = useMemo(
    () => [
      {
        title: t("organizerContestDetail.relatedSettings.teams.title"),
        subtitle: t("organizerContestDetail.relatedSettings.teams.subtitle"),
        icon: <Users size={20} />,
        path: "teams",
      },
      {
        title: t("organizerContestDetail.relatedSettings.judges.title"),
        subtitle: t("organizerContestDetail.relatedSettings.judges.subtitle"),
        icon: <Gavel size={20} />,
        path: "judges",
      },
      // {
      //   title: t("organizerContestDetail.relatedSettings.activeJudges.title"),
      //   subtitle: t(
      //     "organizerContestDetail.relatedSettings.activeJudges.subtitle",
      //   ),
      //   icon: <UserCheck size={20} />,
      //   path: "judges/active",
      // },

      {
        title: t("organizerContestDetail.relatedSettings.leaderboard.title"),
        subtitle: t(
          "organizerContestDetail.relatedSettings.leaderboard.subtitle",
        ),
        icon: <Trophy size={20} />,
        path: "leaderboard",
      },
      {
        title: "Certificates",
        subtitle: "Manage certificates and templates",
        icon: <Award size={20} />, // Using Award icon instead of individual icons
        path: "certificates",
      },
      {
        title: t("organizerContestDetail.relatedSettings.appeals.title"),
        subtitle: t("organizerContestDetail.relatedSettings.appeals.subtitle"),
        icon: <Scale size={20} />,
        path: "appeals",
      },
      {
        title: t("organizerContestDetail.relatedSettings.plagiarism.title"),
        subtitle: t(
          "organizerContestDetail.relatedSettings.plagiarism.subtitle",
        ),
        icon: <FileBadge2 size={20} />,
        path: "plagiarism",
      },
      // {
      //   title: "Activity Logs",
      //   subtitle: "View contest-related user actions",
      //   icon: <ListChecks size={20} />,
      //   path: "activity",
      // },
      // {
      //   title: "Notifications",
      //   subtitle: "Manage notifications and announcements",
      //   icon: <Bell size={20} />,
      //   path: "notifications",
      // },
    ],
    [t],
  )

  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.path}
          to={`/organizer/contests/${contestId}/${item.path}`}
          className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors"
        >
          <div className="flex gap-5 items-center">
            {item.icon}
            <div>
              <p className="text-[14px] leading-[20px]">{item.title}</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                {item.subtitle}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#7A7574]" />
        </Link>
      ))}
    </div>
  )
}

export default ContestRelatedSettings
