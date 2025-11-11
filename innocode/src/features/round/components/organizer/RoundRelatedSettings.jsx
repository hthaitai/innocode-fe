import React from "react"
import { Link } from "react-router-dom"
import {
  Code2,
  ListChecks,
  ClipboardList,
  Settings2,
  ChevronRight,
} from "lucide-react"

const RoundRelatedSettings = ({ contestId, round }) => {
  if (!round) return null

  const items = []

  // Manual coding problem
  if (round.problemType === "Manual") {
    items.push(
      {
        title: "Rubric / Criteria",
        subtitle: "Define scoring rules and judge guidelines",
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/manual/rubric`,
        icon: Code2,
      },
      {
        title: "Manual Results",
        subtitle: "View submissions and assign scores",
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/manual/results`,
        icon: ClipboardList,
      }
    )
  }

  // MCQ Test
  if (round.problemType === "McqTest") {
    items.push(
      {
        title: "MCQ Test Details",
        subtitle: "View or edit the MCQ test for this round",
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/mcqs`,
        icon: ListChecks,
      },
      {
        title: "MCQ Attempts",
        subtitle: "See all participant attempts for this MCQ test",
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/attempts`,
        icon: ClipboardList,
      }
    )
  }

  // Auto Evaluation
  if (round.problemType === "AutoEvaluation") {
    items.push(
      {
        title: "Manage Auto Evaluation",
        subtitle: "View or edit auto evaluation settings for this round",
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/auto-evaluation`,
        icon: Settings2,
      },
      {
        title: "Auto Evaluation Results",
        subtitle: "View auto-scored submissions",
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/auto-evaluation/results`,
        icon: ClipboardList,
      }
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            to={item.path}
            className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors"
          >
            <div className="flex gap-5 items-center">
              <Icon size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">{item.title}</p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  {item.subtitle}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#7A7574]" />
          </Link>
        )
      })}
    </div>
  )
}

export default RoundRelatedSettings
