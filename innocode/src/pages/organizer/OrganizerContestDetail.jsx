import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageContainer from "../../components/PageContainer"
import {
  createBreadcrumbWithPaths,
  BREADCRUMBS,
} from "../../config/breadcrumbs"
import { contestsDataOrganizer } from "../../data/contestsDataOrganizer"
import DetailTable from "../../components/organizer/contests/DetailTable"
import InfoSection from "../../components/organizer/contests/InfoSection"
import TableFluent from "../../components/TableFluent"
import Actions from "../../components/organizer/contests/Actions"
import { formatDateTime } from "../../components/organizer/utils/TableUtils"
import {
  Award,
  Bell,
  Calendar,
  ListChecks,
  MessageCircle,
  Trash,
  Trophy,
  Users,
} from "lucide-react"
import ContestModal from "../../components/organizer/contests/modals/ContestModal"
import RoundModal from "../../components/organizer/contests/modals/RoundModal"
import ConfirmDeleteModal from "../../components/organizer/contests/modals/ConfirmDeleteModal"
import { useContestDetailState } from "../../hooks/organizer/useContestDetailState"
import ContestRelatedSettings from "../../components/organizer/contests/ContestRelatedSettings"
import { useOrganizerBreadcrumb } from "../../hooks/organizer/useOrganizerBreadcrumb"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { contest, breadcrumbData } = useOrganizerBreadcrumb(
    "ORGANIZER_CONTEST_DETAIL"
  )
  const [contestState, setContestState] = useState(contest)
  const {
    contestModal,
    roundModal,
    confirmDeleteModal,
    openContestModal,
    openRoundModal,
    openDeleteModal,
    closeContestModal,
    closeRoundModal,
    closeDeleteModal,
    rounds,
    setRounds,
    setContestModal,
    setRoundModal,
  } = useContestDetailState(contest)

  // ---------- Save Handlers ----------
  const handleContestSave = () => {
    setContestModal((prev) => ({ ...prev, showErrors: true }))
    const data = contestModal.formData
    if (!data.name || !data.year || !data.description || !data.status) return

    if (contestModal.mode === "create") {
      console.log("Creating contest:", data)
    } else {
      setContestState((prev) => ({ ...prev, ...data }))
      console.log("Updated contest:", { ...contestState, ...data })
    }
    closeContestModal()
  }

  const handleRoundSave = () => {
    setRoundModal((prev) => ({ ...prev, showErrors: true }))
    const data = roundModal.formData
    if (!data.name || !data.start || !data.end || data.end < data.start) return

    if (roundModal.mode === "create") {
      setRounds((prev) => [
        ...prev,
        { ...data, round_id: Date.now(), contest_id: contest?.contest_id },
      ])
    } else {
      setRounds((prev) =>
        prev.map((r) => (r.round_id === data.round_id ? { ...data } : r))
      )
    }
    closeRoundModal()
  }

  // ---------- Delete Handler ----------
  const handleDelete = () => {
    if (confirmDeleteModal.type === "round") {
      setRounds((prev) =>
        prev.filter((r) => r.round_id !== confirmDeleteModal.item.round_id)
      )
    } else if (confirmDeleteModal.type === "contest") {
      console.log("Deleting contest:", confirmDeleteModal.item)
      closeDeleteModal()
      navigate("/organizer/contests")
      return
    }
    closeDeleteModal()
  }

  // ---------- Round Table ----------
  const roundColumns = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "start",
      header: "Start",
      cell: ({ row }) => formatDateTime(row.original.start),
    },
    {
      accessorKey: "end",
      header: "End",
      cell: ({ row }) => formatDateTime(row.original.end),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Actions
          row={row.original}
          onEdit={() => openRoundModal("edit", row.original)}
          onDelete={() => openDeleteModal("round", row.original)}
        />
      ),
    },
  ]

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
    >
      <div className="space-y-5">
        {/* Contest Info */}
        <InfoSection
          title="Contest Information"
          onEdit={() => openContestModal("edit", contestState)}
        >
          <DetailTable
            data={[
              { label: "Name", value: contestState.name },
              { label: "Year", value: contestState.year },
              { label: "Description", value: contestState.description },
              { label: "Status", value: contestState.status },
              { label: "Created at", value: contestState.created_at },
            ]}
          />
        </InfoSection>

        {/* Rounds */}
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            Rounds
          </div>
          <div className="space-y-1">
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <Calendar size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">Round Management</p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    Create and manage rounds
                  </p>
                </div>
              </div>
              <button
                className="button-orange"
                onClick={() => openRoundModal("create")}
              >
                New Round
              </button>
            </div>

            <TableFluent
              data={rounds}
              columns={roundColumns}
              title="Rounds"
              onRowClick={(round) => console.log("Clicked round:", round)}
            />
          </div>
        </div>

        <ContestRelatedSettings contestId={contestId} />

        {/* Delete Contest */}
        <div>
          <div className="text-sm leading-5 font-semibold pt-3 pb-2">
            More actions
          </div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <div className="flex gap-5 items-center">
              <Trash size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">Delete contest</p>
              </div>
            </div>
            <button
              className="button-white"
              onClick={() => openDeleteModal("contest", contestState)}
            >
              Delete Contest
            </button>
          </div>
        </div>

        <ContestModal
          {...contestModal}
          onChange={(data) =>
            setContestModal((p) => ({ ...p, formData: data }))
          }
          onSave={handleContestSave}
          onClose={closeContestModal}
        />
        <RoundModal
          {...roundModal}
          onChange={(data) => setRoundModal((p) => ({ ...p, formData: data }))}
          onSave={handleRoundSave}
          onClose={closeRoundModal}
        />
        <ConfirmDeleteModal
          {...confirmDeleteModal}
          onConfirm={handleDelete}
          onClose={closeDeleteModal}
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerContestDetail
