import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { ArrowLeft, School, UserPlus } from "lucide-react"
import {
  useGetSchoolByIdQuery,
  useGetMentorsBySchoolIdQuery,
} from "@/services/schoolApi"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import TableFluent from "@/shared/components/TableFluent"
import AddMentorModal from "@/features/school/components/AddMentorModal"
import { formatDateTime } from "@/shared/utils/dateTime"

const SchoolDetail = () => {
  const { t } = useTranslation("pages")
  const { id } = useParams()
  const navigate = useNavigate()
  const [isAddMentorModalOpen, setIsAddMentorModalOpen] = useState(false)

  const {
    data: school,
    isLoading,
    error,
  } = useGetSchoolByIdQuery(id, {
    skip: !id,
  })

  const {
    data: mentors = [],
    isLoading: mentorsLoading,
    refetch: refetchMentors,
  } = useGetMentorsBySchoolIdQuery(id, {
    skip: !id,
  })

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
        breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_MANAGEMENT}
        loading={isLoading}
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
        breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_MANAGEMENT}
        error={error}
      >
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">
            {t("schoolDetail.errorLoadingSchool")}
          </p>
          <p className="text-sm text-gray-500">
            {error?.data?.errorMessage ||
              error?.data?.message ||
              error?.message ||
              t("schools.pleaseTryAgain")}
          </p>
        </div>
      </PageContainer>
    )
  }

  if (!school) {
    return (
      <PageContainer
        breadcrumb={BREADCRUMBS.SCHOOL_MANAGEMENT}
        breadcrumbPaths={BREADCRUMB_PATHS.SCHOOL_MANAGEMENT}
      >
        <div className="text-center py-8 text-gray-500">
          {t("schoolDetail.schoolNotFound")}
        </div>
      </PageContainer>
    )
  }

  // Prepare school data for DetailTable
  const schoolData = [
    {
      label: t("schools.schoolName"),
      value: school?.name || school?.Name || "—",
    },

    {
      label: t("schools.province"),
      value: school?.provinceName || school?.ProvinceName || "—",
    },
    {
      label: t("schools.address"),
      value: school?.address || school?.Address || "—",
    },
    {
      label: t("schools.contact"),
      value: school?.contact || school?.Contact || "—",
    },
    {
      label: t("schools.manager"),
      value: school?.managerUsername || school?.ManagerUsername || "—",
    },
    {
      label: t("schools.createdDate"),
      value:
        school?.createdAt || school?.CreatedAt
          ? formatDateTime(school.createdAt || school.CreatedAt)
          : "—",
    },
  ]

  // Breadcrumb for detail page
  const schoolName = school?.name || school?.Name || "School"
  const breadcrumbItems = ["My Managed Schools", schoolName]
  const breadcrumbPaths = ["/school-manager", `/schools/${id}`]

  // Mentors table columns
  const mentorColumns = [
    {
      accessorKey: "fullname",
      header: t("schoolDetail.fullName"),
      cell: ({ row }) => {
        const mentor = row.original
        return (
          <span className="font-medium">
            {mentor.fullname ||
              mentor.fullName ||
              mentor.userFullname ||
              mentor.user?.fullname ||
              mentor.user?.name ||
              "—"}
          </span>
        )
      },
      size: 200,
    },
    {
      accessorKey: "email",
      header: t("schoolDetail.email"),
      cell: ({ row }) => {
        const mentor = row.original
        return (
          <span className="text-gray-700">
            {mentor.email || mentor.userEmail || mentor.user?.email || "—"}
          </span>
        )
      },
      size: 200,
    },
    {
      accessorKey: "phone",
      header: t("schoolDetail.phone"),
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.phone || "—"}</span>
      ),
      size: 150,
    },
    {
      accessorKey: "createdAt",
      header: t("schools.createdDate"),
      cell: ({ row }) => {
        const date =
          row.original.createdAt ||
          row.original.created_at ||
          row.original.CreatedAt
        return (
          <span className="text-gray-700 text-sm">
            {date ? formatDateTime(date) : "—"}
          </span>
        )
      },
      size: 180,
    },
  ]

  // Handle add mentor modal close
  const handleAddMentorClose = () => {
    setIsAddMentorModalOpen(false)
    refetchMentors()
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="space-y-5">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/school-manager")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t("schoolDetail.backToMyManagedSchools")}</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-4">
          <div className="flex gap-5 items-center">
            <School size={24} className="text-orange-500" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {schoolName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t("schoolDetail.schoolInformationDetails")}
              </p>
            </div>
          </div>
        </div>

        {/* School Information */}
        <InfoSection title={t("schoolDetail.schoolInformation")}>
          <DetailTable data={schoolData} labelWidth="180px" />
        </InfoSection>

        {/* Mentors Section */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white">
          <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("schoolDetail.mentors")} ({mentors.length})
            </h2>
            <button
              onClick={() => setIsAddMentorModalOpen(true)}
              className="button-orange flex justify-center items-center gap-2"
            >
              <UserPlus size={20} />
              <span>{t("schoolDetail.addMentor")}</span>
            </button>
          </div>
          <div>
            {mentorsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>{t("schoolDetail.noMentorsFound")}</p>
              </div>
            ) : (
              <TableFluent
                data={mentors}
                columns={mentorColumns}
                loading={mentorsLoading}
              />
            )}
          </div>
        </div>

        {/* Add Mentor Modal */}
        <AddMentorModal
          isOpen={isAddMentorModalOpen}
          onClose={handleAddMentorClose}
          schoolId={id}
        />
      </div>
    </PageContainer>
  )
}

export default SchoolDetail
