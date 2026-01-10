import React from "react"
import { useTranslation } from "react-i18next"
import { School, Users, MapPin, TrendingUp } from "lucide-react"

const SchoolMetricTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Mock data - replace with actual API calls
  const schoolStats = [
    {
      icon: School,
      label: t("dashboard.schoolMetric.totalSchools"),
      value: "89",
      change: "+3",
      changeType: "increase",
    },
    {
      icon: Users,
      label: t("dashboard.schoolMetric.totalStudents"),
      value: "12,456",
      change: "+234",
      changeType: "increase",
    },
    {
      icon: MapPin,
      label: t("dashboard.schoolMetric.provinces"),
      value: "63",
      change: "+2",
      changeType: "increase",
    },
    {
      icon: TrendingUp,
      label: t("dashboard.schoolMetric.activeSchools"),
      value: "76",
      change: "+5",
      changeType: "increase",
    },
  ]

  const schoolsByProvince = [
    { province: "Hồ Chí Minh", schools: 15, students: 2340, participation: 95 },
    { province: "Hà Nội", schools: 12, students: 1890, participation: 92 },
    { province: "Đà Nẵng", schools: 8, students: 1120, participation: 88 },
    { province: "Cần Thơ", schools: 6, students: 890, participation: 85 },
    { province: "Hải Phòng", schools: 5, students: 750, participation: 82 },
  ]

  const recentSchools = [
    {
      name: "THPT Chuyên Lê Hồng Phong",
      province: "TP. Hồ Chí Minh",
      students: 234,
      contests: 15,
      status: "Active",
    },
    {
      name: "THPT Chuyên Trần Đại Nghĩa",
      province: "TP. Hồ Chí Minh",
      students: 198,
      contests: 14,
      status: "Active",
    },
    {
      name: "THPT Chuyên Nguyễn Huệ",
      province: "Hà Nội",
      students: 176,
      contests: 13,
      status: "Active",
    },
  ]

  return (
    <div className="space-y-6">
      {/* School Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {schoolStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white border border-[#E5E5E5] rounded-[5px] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Schools by Province */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("dashboard.schoolMetric.schoolsByProvince")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.schoolMetric.province")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.schoolMetric.schools")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.schoolMetric.students")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {t("dashboard.schoolMetric.participation")}
                </th>
              </tr>
            </thead>
            <tbody>
              {schoolsByProvince.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {item.province}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.schools}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.students.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${item.participation}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.participation}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Schools */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("dashboard.schoolMetric.recentSchools")}
        </h3>
        <div className="space-y-3">
          {recentSchools.map((school, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-[5px] hover:bg-gray-50"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">
                  {school.name}
                </h4>
                <p className="text-xs text-gray-600">{school.province}</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-gray-600 text-xs">
                    {t("dashboard.schoolMetric.students")}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {school.students}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-xs">
                    {t("dashboard.schoolMetric.contests")}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {school.contests}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {school.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SchoolMetricTab
