import React from "react"
import { Pencil, Trash } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from '@/shared/components/PageContainer'
import InfoSection from '@/features/contest/components/InfoSection'
import DetailTable from '@/features/contest/components/DetailTable'
import TableFluent from '@/shared/components/TableFluent'
import Actions from '@/features/contest/components/Actions'
import { useOrganizerBreadcrumb } from '@/features/organizer/hooks/useOrganizerBreadcrumb'
import { useModal } from '@/features/organizer/hooks/useModal'
import { useProblems } from '@/features/problem/hooks/useProblems'
import useTestCase from '@/features/problem/hooks/useTestCase'
import { formatDateTime } from "@/shared/utils/formatDateTime"

const OrganizerProblemDetail = () => {
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
    problems,
    loading: problemsLoading,
    error: problemsError,
    updateProblem,
    deleteProblem,
  } = useProblems(contestId, roundId)

  const {
    testCases,
    loading: testCaseLoading,
    error: testCaseError,
    addTestCase,
    updateTestCase,
    deleteTestCase,
  } = useTestCase(contestId, roundId, problemId)

  // --- Get current problem ---
  const problem = problems.find((p) => p.problem_id === problemId)

  // --- Handlers ---
  const handleProblemModal = () => {
    if (!problem) return
    openModal("problem", {
      mode: "edit",
      initialData: { ...problem },
      onSubmit: async (data) => updateProblem(problem.problem_id, data),
    })
  }

  const handleDeleteProblem = () => {
    if (!problem) return
    openModal("confirmDelete", {
      type: "problem",
      item: problem,
      onConfirm: async (onClose) => {
        await deleteProblem(problem.problem_id)
        onClose()
        navigate(`/organizer/contests/${contestId}/rounds/${roundId}`)
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
      loading={problemsLoading || testCaseLoading}
      error={problemsError || testCaseError}
    >
      {!problem ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          Problem not found
        </div>
      ) : (
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
      )}
    </PageContainer>
  )
}

export default OrganizerProblemDetail
