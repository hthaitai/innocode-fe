import React from "react"
import { useTranslation } from "react-i18next"
import { Trophy, Medal, Award, Star } from "lucide-react"

const TopPerformanceTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Mock data - replace with actual API calls
  const topStudents = [
    {
      rank: 1,
      name: "Nguyễn Văn A",
      school: "THPT Chuyên Lê Hồng Phong",
      points: 9850,
      contests: 15,
    },
    {
      rank: 2,
      name: "Trần Thị B",
      school: "THPT Chuyên Trần Đại Nghĩa",
      points: 9720,
      contests: 14,
    },
    {
      rank: 3,
      name: "Lê Văn C",
      school: "THPT Chuyên Nguyễn Huệ",
      points: 9650,
      contests: 13,
    },
    {
      rank: 4,
      name: "Phạm Thị D",
      school: "THPT Chuyên Lê Quý Đôn",
      points: 9580,
      contests: 12,
    },
    {
      rank: 5,
      name: "Hoàng Văn E",
      school: "THPT Chuyên Hà Nội - Amsterdam",
      points: 9500,
      contests: 11,
    },
  ]

  const topSchools = [
    {
      rank: 1,
      name: "THPT Chuyên Lê Hồng Phong",
      students: 234,
      avgScore: 8.5,
      contests: 45,
    },
    {
      rank: 2,
      name: "THPT Chuyên Trần Đại Nghĩa",
      students: 198,
      avgScore: 8.3,
      contests: 42,
    },
    {
      rank: 3,
      name: "THPT Chuyên Nguyễn Huệ",
      students: 176,
      avgScore: 8.1,
      contests: 38,
    },
  ]

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />
      default:
        return <Star className="w-5 h-5 text-gray-300" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Students */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("dashboard.topPerformance.topStudents")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.topPerformance.rank")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.topPerformance.studentName")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.topPerformance.school")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.topPerformance.points")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.topPerformance.contestsJoined")}
                </th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((student) => (
                <tr
                  key={student.rank}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(student.rank)}
                      <span className="text-sm font-semibold text-gray-800">
                        #{student.rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {student.school}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-orange-600">
                    {student.points.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {student.contests}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Schools */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("dashboard.topPerformance.topSchools")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topSchools.map((school) => (
            <div
              key={school.rank}
              className="border border-gray-200 rounded-[5px] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getRankIcon(school.rank)}
                  <span className="text-sm font-semibold text-gray-800">
                    #{school.rank}
                  </span>
                </div>
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  {school.avgScore} {t("dashboard.topPerformance.avgScore")}
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                {school.name}
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  {t("dashboard.topPerformance.students")}: {school.students}
                </p>
                <p>
                  {t("dashboard.topPerformance.contests")}: {school.contests}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopPerformanceTab
