import React, { useState } from "react"
import { useGetAllContestsQuery } from "../../../../services/contestApi"
import PageContainer from "../../../../shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useNavigate } from "react-router-dom"
import { Search, X } from "lucide-react"
import TablePagination from "../../../../shared/components/TablePagination"
import TextFieldFluent from "../../../../shared/components/TextFieldFluent"
import JudgeContestList from "../../components/judge/JudgeContestList"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const JudgeContestListPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 9

  const [searchTerm, setSearchTerm] = useState("")
  const [nameSearch, setNameSearch] = useState("")

  const {
    data: contestsData,
    isLoading,
    isError,
  } = useGetAllContestsQuery({
    pageNumber,
    pageSize,
    nameSearch,
  })

  const contests = contestsData?.data ?? []
  const pagination = contestsData?.additionalData ?? {}

  const navigate = useNavigate()

  const handleContestClick = (contestId) => {
    navigate(`/judge/contests/${contestId}`)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setNameSearch(searchTerm)
      setPageNumber(1)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setNameSearch("")
    setPageNumber(1)
  }

  const breadcrumbItems = BREADCRUMBS.JUDGE_CONTESTS
  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_CONTESTS

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="contests" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="mb-3 flex justify-between items-center">
          <div className="w-[280px]">
            <TextFieldFluent
              placeholder="Search contests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              startIcon={<Search className="text-[#7A7574] w-4 h-4" />}
              endButton={
                searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-[#7A7574] p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )
              }
            />
          </div>
        </div>

        {contests.length === 0 ? (
          <MissingState itemName="contests" />
        ) : (
          <>
            <JudgeContestList
              contests={contests}
              onContestClick={handleContestClick}
            />

            {pagination && (
              <TablePagination
                pagination={pagination}
                onPageChange={setPageNumber}
              />
            )}
          </>
        )}
      </AnimatedSection>
    </PageContainer>
  )
}

export default JudgeContestListPage
