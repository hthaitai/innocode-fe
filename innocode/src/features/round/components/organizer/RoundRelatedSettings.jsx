import React from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import {
  Code2,
  ListChecks,
  ClipboardList,
  Settings2,
  ChevronRight,
  Scale,
} from "lucide-react"

const RoundRelatedSettings = ({ contestId, round }) => {
  const { t } = useTranslation("round")
  if (!round) return null

  const items = []

  // Manual coding problem
  if (round.problemType === "Manual") {
    items.push(
      {
        title: t("settings.rubric"),
        subtitle: t("settings.rubricDesc"),
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/manual/rubric`,
        icon: Code2,
      },
      {
        title: t("settings.manualResults"),
        subtitle: t("settings.manualResultsDesc"),
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/manual/results`,
        icon: ClipboardList,
      }
    )
  }

  // MCQ Test
  if (round.problemType === "McqTest") {
    items.push(
      {
        title: t("settings.mcq"),
        subtitle: t("settings.mcqDesc"),
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/mcqs`,
        icon: ListChecks,
      },
      {
        title: t("settings.studentAttempts"),
        subtitle: t("settings.studentAttemptsDesc"),
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/attempts`,
        icon: ClipboardList,
      }
    )
  }

  // Auto Evaluation
  if (round.problemType === "AutoEvaluation") {
    // Show 'Manage auto test' ONLY if testType is InputOutput (or null/default)
    const isMockTest = round.problem?.testType === "MockTest"

    if (!isMockTest) {
      items.push({
        title: t("settings.manageTestCases"),
        subtitle: t("settings.manageTestCasesDesc"),
        path: `/organizer/contests/${contestId}/rounds/${round.roundId}/auto-evaluation`,
        icon: Settings2,
      })
    }

    items.push({
      title: t("settings.autoResults"),
      subtitle: t("settings.autoResultsDesc"),
      path: `/organizer/contests/${contestId}/rounds/${round.roundId}/auto-evaluation/results`,
      icon: ClipboardList,
    })
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
