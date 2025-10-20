import React from "react"
import { Pencil, Trash } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "../../components/PageContainer"
import InfoSection from "../../components/organizer/contests/InfoSection"
import DetailTable from "../../components/organizer/contests/DetailTable"
import TableFluent from "../../components/TableFluent"
import Actions from "../../components/organizer/contests/Actions"
import { formatDateTime } from "../../components/organizer/utils/TableUtils"
import { useOrganizerBreadcrumb } from "../../hooks/organizer/useOrganizerBreadcrumb"
import { useModal } from "../../hooks/organizer/useModal"
import { useProblemDetail } from "../../hooks/organizer/useProblemDetail"
import { useTestCase } from "../../hooks/organizer/useTestCase"

const ProblemDetailPage = () => {
  const {
    contestId: contestIdParam,
    roundId: roundIdParam,
    problemId: problemIdParam,
  } = useParams()
  const contestId = Number(contestIdParam)
  const roundId = Number(roundIdParam)
  const problemId = Number(problemIdParam)

  const navigate = useNavigate()
  const { openModal } = useModal()
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_PROBLEM_DETAIL")

  // --- Hooks ---
  const {
    problem,
    loading: problemLoading,
    error: problemError,
    updateProblem,
    deleteProblem,
  } = useProblemDetail(contestId, roundId, problemId)
  const {
    testCases,
    loading: testCaseLoading,
    error: testCaseError,
    addTestCase,
    updateTestCase,
    deleteTestCase,
  } = useTestCase(contestId, roundId, problemId)

  if (problemLoading || testCaseLoading)
    return <PageContainer>Loading...</PageContainer>
  if (problemError) return <PageContainer>Error: {problemError}</PageContainer>
  if (testCaseError)
    return <PageContainer>Error: {testCaseError}</PageContainer>
  if (!problem) return <PageContainer>Problem not found</PageContainer>

  // --- Handlers ---
  const handleProblemModal = () => {
    openModal("problem", {
      mode: "edit",
      initialData: { ...problem },
      onSubmit: async (data) => updateProblem(problem.problem_id, data),
    })
  }

  const handleDeleteProblem = () => {
    openModal("confirmDelete", {
      type: "problem",
      item: problem,
      onConfirm: async (onClose) => {
        await deleteProblem(problem.problem_id)
        onClose()
        navigate("/organizer/problems")
      },
    })
  }

  const handleTestCaseModal = (mode, testCase = {}) => {
    openModal("testCase", {
      mode,
      initialData: { ...testCase },
      onSubmit: async (data) => {
        if (mode === "create") return await addTestCase(data)
        if (mode === "edit")
          return await updateTestCase(testCase.test_case_id, data)
      },
    })
  }

  const handleDeleteTestCase = (testCase) => {
    openModal("confirmDelete", {
      type: "testCase",
      item: testCase,
      onConfirm: async (onClose) => {
        await deleteTestCase(testCase.test_case_id)
        onClose()
      },
    })
  }

  // --- Table Columns ---
  const testCaseColumns = [
    { accessorKey: "test_case_id", header: "ID" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "weight", header: "Weight" },
    { accessorKey: "time_limit_ms", header: "Time Limit (ms)" },
    { accessorKey: "memory_kb", header: "Memory (KB)" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Actions
          row={row.original}
          items={[
            {
              label: "Edit",
              icon: Pencil,
              onClick: () => handleTestCaseModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash,
              className: "text-red-500",
              onClick: () => handleDeleteTestCase(row.original),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      <div className="space-y-5">
        {/* Problem Info */}
        <InfoSection title="Problem Information" onEdit={handleProblemModal}>
          <DetailTable
            data={[
              { label: "Language", value: problem.language },
              { label: "Type", value: problem.type },
              { label: "Penalty Rate", value: problem.penalty_rate },
              {
                label: "Created At",
                value: formatDateTime(problem.created_at),
              },
            ]}
          />
        </InfoSection>

        {/* Test Cases */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Test Cases</div>
          <div className="space-y-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div>
                <p className="text-[14px] leading-[20px]">
                  Test Case Management
                </p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  Create and manage test cases for this problem
                </p>
              </div>
              <button
                className="button-orange"
                onClick={() => handleTestCaseModal("create")}
              >
                New Test Case
              </button>
            </div>

            <TableFluent
              data={testCases}
              columns={testCaseColumns}
              title="Test Cases"
            />
          </div>
        </div>

        {/* Delete Problem */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex gap-5 items-center">
              <Trash size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">Delete Problem</p>
              </div>
            </div>
            <button className="button-white" onClick={handleDeleteProblem}>
              Delete Problem
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default ProblemDetailPage
