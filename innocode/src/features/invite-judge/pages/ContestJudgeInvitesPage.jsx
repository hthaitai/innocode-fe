import React, { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetJudgeInvitesByContestQuery } from "@/services/contestJudgeApi"
import { getJudgeInviteColumns } from "../columns/getJudgeInviteColumns"

const ContestJudgeInvitesPage = () => {
  const { contestId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 20
  const { t } = useTranslation(["judge", "pages"])

  const { data: contest, isLoading: isContestLoading } =
    useGetContestByIdQuery(contestId)

  const {
    data: invitesData,
    isLoading: isInvitesLoading,
    isError,
  } = useGetJudgeInvitesByContestQuery({ contestId, page, pageSize })

  const invites = invitesData?.data || []
  const pagination = invitesData?.additionalData || {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_JUDGE_INVITES(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGE_INVITES(contestId)

  const columns = getJudgeInviteColumns(t)

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isContestLoading || isInvitesLoading}
      error={isError}
    >
      <div>
        <TableFluent
          data={invites || []}
          columns={columns}
          loading={isInvitesLoading}
          pagination={pagination}
          renderActions={() => (
            <div className="text-sm leading-5 font-semibold px-5 flex items-center min-h-[70px]">
              {t("invitationList")}
            </div>
          )}
        />
      </div>
    </PageContainer>
  )
}

export default ContestJudgeInvitesPage
