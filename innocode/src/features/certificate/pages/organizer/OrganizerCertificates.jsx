import React from "react"
import { useParams } from "react-router-dom"
import { Award, LayoutTemplate, FileBadge2, ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { Link } from "react-router-dom"

export default function OrganizerCertificates() {
  const { contestId } = useParams()

  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const contestName = contest?.name || "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATES(contestName)
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CERTIFICATES(contestId)

  const items = [
    {
      title: "Template gallery",
      subtitle: "Browse templates for this contest or upload new ones",
      icon: <LayoutTemplate size={20} />,
      path: "certificates/templates",
    },
    {
      title: "Issue certificates",
      subtitle: "Select a team or member and award a template",
      icon: <Award size={20} />,
      path: "certificates/issue",
    },
    {
      title: "Issued certificates",
      subtitle: "View every certificate that has been issued so far",
      icon: <FileBadge2 size={20} />,
      path: "certificates/issued",
    },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={contestLoading}
      error={contestError}
    >
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.title}
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
    </PageContainer>
  )
}
