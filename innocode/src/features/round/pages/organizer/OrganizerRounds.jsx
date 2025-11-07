import React, { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Calendar,
  Clock,
  Eye,
  FileText,
  PlusCircle,
  Trash2,
} from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useConfirmDelete } from "@/shared/hooks/useConfirmDelete"
import { fetchRounds, deleteRound } from "@/features/round/store/roundThunk"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { formatDateTime } from "@/shared/utils/dateTime"
import { createBreadcrumbWithPaths } from "../../../../config/breadcrumbs"
import Actions from "@/shared/components/Actions"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { motion } from "framer-motion"

const OrganizerRounds = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  const { contestId } = useParams()
  const { contests } = useAppSelector((s) => s.contests)
  const { rounds, loading, error } = useAppSelector((state) => state.rounds)

  // --- Fetch contest if missing ---
  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  useEffect(() => {
    if (!contest && contestId) {
      dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contest, contestId, dispatch])

  // --- Fetch all rounds globally then filter by contest ---
  useEffect(() => {
    dispatch(fetchRounds({ contestId, pageNumber: 1, pageSize: 50 }))
  }, [dispatch, contestId])

  const { items, paths } = createBreadcrumbWithPaths(
    "ORGANIZER_ROUNDS",
    contestId,
    contest?.name ?? "Contest"
  )

  const handleDelete = (round) =>
    confirmDeleteEntity({
      entityName: "Round",
      item: round,
      deleteAction: deleteRound,
      idKey: "roundId",
      onSuccess: () =>
        dispatch(
          fetchRounds({ contestId, pageNumber: 1, pageSize: 50 })
        ),
    })

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="space-y-4">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <PlusCircle size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Round Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage rounds for this contest
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() =>
              navigate(`/organizer/contests/${contestId}/rounds/new`)
            }
          >
            Add round
          </button>
        </div>

        {/* Rounds List */}
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Round list
          </div>

          <div className="flex flex-col gap-1">
            {loading ? (
              <Spinner />
            ) : error ? (
              <p className="text-sm text-red-500">
                {typeof error === "object"
                  ? error.Message || JSON.stringify(error)
                  : error}
              </p>
            ) : rounds.length === 0 ? (
              <div className="border border-[#E5E5E5] rounded-[5px] bg-white flex justify-center items-center text-[12px] leading-[16px] text-[#7A7574] min-h-[70px]">
                No rounds yet. Create your first round to get started.
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05, // animate children sequentially
                    },
                  },
                }}
                className="flex flex-col gap-1"
              >
                {rounds.map((round) => (
                  <motion.div
                    key={round.roundId}
                    variants={{
                      hidden: { y: -20, opacity: 0 },
                      visible: {
                        y: 0,
                        opacity: 1,
                        transition: {
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1], // Fluent-style easing
                        },
                      },
                    }}
                    className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] transition-colors"
                  >
                    <div className="flex gap-5 items-center">
                      <Calendar size={20} />
                      <div>
                        <p className="text-[14px] leading-[20px]">
                          {round.name || "Untitled Round"}
                        </p>
                        <p className="text-[12px] leading-[16px] text-[#7A7574] flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            {formatDateTime(round.start)} →{" "}
                            {formatDateTime(round.end)}
                          </span>
                          <span>|</span>
                          <span>Type: {round.problemType || "—"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Kebab Menu (Actions) */}
                    <Actions
                      row={round}
                      items={[
                        {
                          label: "View details",
                          icon: Eye,
                          onClick: () =>
                            navigate(
                              `/organizer/contests/${contestId}/rounds/${round.roundId}`
                            ),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          className: "text-red-500",
                          onClick: () => handleDelete(round),
                        },
                      ]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerRounds
