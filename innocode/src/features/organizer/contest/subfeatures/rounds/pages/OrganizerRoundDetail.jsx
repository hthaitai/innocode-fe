import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageContainer from '@/shared/components/PageContainer'
import DetailTable from '@/features/contest/components/DetailTable'
import InfoSection from '@/features/contest/components/InfoSection'
import TableFluent from '@/shared/components/TableFluent'
import Actions from '@/features/contest/components/Actions'
import { Calendar, Trash, Pencil } from "lucide-react"
import { useOrganizerBreadcrumb } from '@/features/organizer/hooks/useOrganizerBreadcrumb'
import { useModal } from '@/features/organizer/hooks/useModal'
import { useRounds } from '@/features/contest/subfeatures/rounds/hooks/useRounds'
import { useProblems } from '@/features/contest/subfeatures/problems/hooks/useProblems'
import { formatDateTime } from "@/shared/utils/formatDateTime"

const OrganizerRoundDetail = () => {
  const { contestId: contestIdParam, roundId: roundIdParam } = useParams()
  const contestId = Number(contestIdParam)
  const roundId = Number(roundIdParam)

  const navigate = useNavigate()
  const { openModal } = useModal()
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_ROUND_DETAIL")

  // --- Hooks ---
  const {
    rounds,
    loading: roundLoading,
    error: roundError,
    updateRound,
    deleteRound,
  } = useRounds(contestId)

  const {
    problems,
    loading: problemsLoading,
    error: problemsError,
    addProblem,
    updateProblem,
    deleteProblem,
  } = useProblems(contestId, roundId)

  const round = rounds.find((r) => r.round_id === roundId)

  // --- Format helper ---
  const formatForInput = (dateStr) => {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}`
  }

  // ---------- Handlers ----------
  const handleRoundModal = () => {
    if (!round) return
    const formattedRound = {
      ...round,
      start: formatForInput(round.start),
      end: formatForInput(round.end),
    }

    openModal("round", {
      mode: "edit",
      initialData: formattedRound,
      onSubmit: async (data) => {
        await updateRound(round.round_id, data)
      },
    })
  }

  const handleDeleteRound = () => {
    openModal("confirmDelete", {
      type: "round",
      item: round,
      onConfirm: async (onClose) => {
        await deleteRound(round.round_id)
        onClose()
        navigate(`/organizer/contests/${contestId}`)
      },
    })
  }

  const handleProblemModal = (mode, problem = {}) => {
    openModal("problem", {
      mode,
      initialData: problem,
      onSubmit: async (data) => {
        if (mode === "create") return await addProblem(data)
        if (mode === "edit")
          return await updateProblem(problem.problem_id, data)
      },
    })
  }

  const handleDeleteProblem = (problem) => {
    openModal("confirmDelete", {
      type: "problem",
      item: problem,
      onConfirm: async (onClose) => {
        await deleteProblem(problem.problem_id)
        onClose()
      },
    })
  }

  // ---------- Problem Table ----------
  const problemColumns = [
    { accessorKey: "problem_id", header: "ID" },
    { accessorKey: "language", header: "Language" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "penalty_rate", header: "Penalty Rate" },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => formatDateTime(row.original.created_at),
    },
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
              onClick: () => handleProblemModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash,
              className: "text-red-500",
              onClick: () => handleDeleteProblem(row.original),
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
      loading={roundLoading || problemsLoading}
      error={roundError || problemsError}
    >
      {!round ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          Round not found
        </div>
      ) : (
        <div className="space-y-5">
          {/* Round Info */}
          <InfoSection title="Round Information" onEdit={handleRoundModal}>
            <DetailTable
              data={[
                { label: "Name", value: round.name },
                { label: "Start", value: formatDateTime(round.start) },
                { label: "End", value: formatDateTime(round.end) },
              ]}
            />
          </InfoSection>

          {/* Problems Section */}
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">Problems</div>
            <div className="space-y-1">
              <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
                <div className="flex gap-5 items-center">
                  <Calendar size={20} />
                  <div>
                    <p className="text-[14px] leading-[20px]">
                      Problem Management
                    </p>
                    <p className="text-[12px] leading-[16px] text-[#7A7574]">
                      Create and manage problems in this round
                    </p>
                  </div>
                </div>
                <button
                  className="button-orange"
                  onClick={() => handleProblemModal("create")}
                >
                  New Problem
                </button>
              </div>

              {problemsLoading ? (
                <div className="p-4 text-gray-500">Loading problems...</div>
              ) : problemsError ? (
                <div className="p-4 text-red-500">{problemsError}</div>
              ) : (
                <TableFluent
                  data={problems}
                  columns={problemColumns}
                  title="Problems"
                  onRowClick={(problem) =>
                    navigate(
                      `/organizer/contests/${contestId}/rounds/${roundId}/problems/${problem.problem_id}`
                    )
                  }
                />
              )}
            </div>
          </div>

          {/* Delete Round */}
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">More Actions</div>
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <Trash size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">Delete Round</p>
                </div>
              </div>
              <button className="button-white" onClick={handleDeleteRound}>
                Delete Round
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default OrganizerRoundDetail
