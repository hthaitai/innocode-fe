import { Link } from "react-router-dom"
import { Users, Trophy, Award, ChevronRight, Scale } from "lucide-react"

const items = [
  // {
  //   title: "Teams",
  //   subtitle: "Manage registered teams and members",
  //   icon: <Users size={20} />,
  //   path: "teams",
  // },
  {
    title: "Leaderboard",
    subtitle: "View and refresh contest leaderboard",
    icon: <Trophy size={20} />,
    path: "leaderboard",
  },
  {
    title: "Certificates",
    subtitle: "Manage templates and issued certificates",
    icon: <Award size={20} />,
    path: "certificates",
  },
  {
    title: "Appeals",
    subtitle: "Review and resolve team appeals",
    icon: <Scale size={20} />,
    path: "appeals",
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
]

const ContestRelatedSettings = ({ contestId }) => (
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

export default ContestRelatedSettings
