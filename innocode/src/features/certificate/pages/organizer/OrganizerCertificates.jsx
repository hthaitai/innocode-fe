import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Award, Download, Trash2, FileBadge } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import Actions from "@/shared/components/Actions"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

const OrganizerCertificates = ({ certificates = [], loading = false, error = null }) => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { contests } = useAppSelector((s) => s.contests)
  const [contestName, setContestName] = useState("Contest")

  // --- Fetch contest if missing and update contestName ---
  useEffect(() => {
    if (contestId) {
      if (!contests || contests.length === 0) {
        dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
      } else {
        const contest = contests.find((c) => String(c.contestId) === String(contestId))
        if (contest) setContestName(contest.name)
      }
    }
  }, [contestId, contests, dispatch])

  // --- Breadcrumb ---
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CERTIFICATES(contestName)
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CERTIFICATES(contestId)

  const handleViewCertificate = (certificate) => {
    if (!certificate.file_url) return
    window.open(certificate.file_url, "_blank")
  }

  const handleRevoke = (certificate) => {
    console.warn(
      "Revoke functionality disabled — requires `useModal` and `revokeCertificate`"
    )
  }

  const handleIssue = (certificate) => {
    console.warn(
      "Issue functionality disabled — requires `useCertificateTemplates` and `issueCertificate`"
    )
  }

  // --- Table columns ---
  const certificateColumns = useMemo(
    () => [
      { accessorKey: "certificate_id", header: "ID" },
      {
        accessorKey: "template_name",
        header: "Template",
        cell: () => "—", // fallback since templates hook is gone
      },
      {
        accessorKey: "team_name",
        header: "Team",
        cell: ({ row }) => row.original.team_name || "—", // fallback since teams hook is gone
      },
      {
        accessorKey: "issued_at",
        header: "Issued At",
        cell: ({ row }) => new Date(row.original.issued_at).toLocaleString(),
      },
      {
        accessorKey: "file_url",
        header: "File",
        cell: ({ row }) =>
          row.original.file_url ? (
            <a
              href={row.original.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              View File
            </a>
          ) : (
            "—"
          ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <Actions
            row={row.original}
            items={[
              {
                label: "Download",
                icon: Download,
                onClick: () => handleViewCertificate(row.original),
              },
              {
                label: "Issue",
                icon: FileBadge,
                onClick: () => handleIssue(row.original),
                className: "text-gray-400", // indicate disabled
              },
              {
                label: "Revoke",
                icon: Trash2,
                onClick: () => handleRevoke(row.original),
                className: "text-gray-400", // indicate disabled
              },
            ]}
          />
        ),
      },
    ],
    []
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="space-y-1">
        {/* Header Section */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Award size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Certificates</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                View and manage all issued certificates
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="button-orange"
              onClick={() =>
                navigate(`/organizer/contests/${contestId}/certificates/templates/new`)
              }
            >
              New Template
            </button>
          </div>
        </div>

        {/* Table Section */}
        <TableFluent
          data={certificates}
          columns={certificateColumns}
          title="Certificates"
          loading={loading}
          error={error}
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerCertificates
