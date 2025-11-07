import React, { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, Trash2 } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { formatDateTime } from "@/shared/utils/dateTime"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import Actions from "@/shared/components/Actions"
import TableFluent from "@/shared/components/TableFluent"
import { fetchRoundMcqs } from "@/features/mcq/store/mcqThunk"
import { clearMcqs } from "@/features/mcq/store/mcqSlice"
import { fetchRounds } from "@/features/round/store/roundThunk"

const OrganizerMcq = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { contestId, roundId } = useParams()

  const { contests } = useAppSelector((s) => s.contests)
  const { mcqs, loading, error } = useAppSelector((s) => s.mcq)
  const { rounds } = useAppSelector((s) => s.rounds)

  // --- Breadcrumb ---
  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  const round = rounds.find((r) => String(r.roundId) === String(roundId))
  const items = BREADCRUMBS.ORGANIZER_MCQ(
    contest?.name ?? "Contest",
    round?.name ?? "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ(contestId, roundId)

  // --- Fetch MCQs on mount ---
  useEffect(() => {
    if (roundId) {
      dispatch(fetchRoundMcqs({ roundId }))
    }

    // Cleanup on unmount
    return () => dispatch(clearMcqs())
  }, [dispatch, roundId])

  // --- Delete handler (example for organizer UI) ---
  const handleDelete = (mcqId) => {
    // Optionally, dispatch a thunk to delete MCQ from backend here
    // For now, we just remove from redux state locally
    // Note: You might want to implement mcqService.deleteMcq for real deletion
    // We'll filter mcqs locally:
    // This pattern depends on whether you store MCQs in redux immutably or fetch again
  }

  const mcqsWithIndex = useMemo(
    () => mcqs?.map((q, i) => ({ ...q, displayId: i + 1 })) || [],
    [mcqs]
  )

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "displayId",
        cell: (info) => info.getValue(),
        size: 50,
      },
      {
        header: "Question",
        accessorKey: "text",
        cell: (info) => info.getValue() || "Untitled Question",
      },
      {
        header: "Weight",
        accessorKey: "weight",
        cell: (info) => info.getValue() ?? "-",
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => (
          <Actions
            row={row.original}
            items={[
              {
                label: "Delete",
                icon: Trash2,
                className: "text-red-500",
                onClick: () => handleDelete(row.original.questionId),
              },
            ]}
          />
        ),
      },
    ],
    []
  )

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="space-y-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Calendar size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">MCQ Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage MCQs for this contest
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() =>
              navigate(`/organizer/contests/${contestId}/mcqs/new`)
            }
          >
            Add MCQ
          </button>
        </div>

        {/* MCQs table */}
        <TableFluent
          data={mcqsWithIndex}
          columns={columns}
          loading={loading}
          error={error}
          onRowClick={(mcq) =>
            navigate(`/organizer/contests/${contestId}/rounds/${roundId}/mcqs/${mcq.questionId}`)
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerMcq
