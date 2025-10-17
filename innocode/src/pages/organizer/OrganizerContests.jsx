// OrganizerContests.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/PageContainer";
import Modal from "../../components/Modal";
import TableFluent from "../../components/TableFluent";
import ContestForm from "../../components/organizer/forms/ContestForm";
import Actions from "../../components/organizer/contests/Actions";
import { BREADCRUMBS } from "../../config/breadcrumbs";
import { contestsDataOrganizer } from "../../data/contestsDataOrganizer";
import { Trophy } from "lucide-react";
import { formatDateTime, StatusBadge } from "../../components/organizer/utils/TableUtils";

const OrganizerContests = () => {
  const navigate = useNavigate();

  // ----- State -----
  const [contests, setContests] = useState(contestsDataOrganizer);

  const [contestModal, setContestModal] = useState({
    isOpen: false,
    mode: null, // 'create' | 'edit'
    formData: null,
    errors: {},
  });

  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    contestId: null,
    contestName: "",
  });

  // ----- Modal handlers -----
  const openCreateContestModal = () =>
    setContestModal({
      isOpen: true,
      mode: "create",
      formData: { year: new Date().getFullYear(), name: "", description: "", img_url: "", status: "draft" },
      errors: {},
    });

  const openEditContestModal = (contest) =>
    setContestModal({
      isOpen: true,
      mode: "edit",
      formData: { ...contest },
      errors: {},
    });

  const closeContestModal = () =>
    setContestModal({ isOpen: false, mode: null, formData: null, errors: {} });

  // ----- Validation -----
  const validateForm = () => {
    const errors = {};
    const { formData } = contestModal;

    if (!formData.name?.trim()) errors.name = "Contest name is required";
    if (!formData.year) errors.year = "Year is required";
    if (!formData.description?.trim()) errors.description = "Description is required";
    if (!formData.status) errors.status = "Status is required";

    setContestModal((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // ----- Save contest -----
  const handleSaveContest = () => {
    if (!validateForm()) return;

    const { formData, mode } = contestModal;

    if (mode === "create") {
      setContests((prev) => [...prev, { ...formData, contest_id: Date.now(), created_at: new Date() }]);
    } else if (mode === "edit") {
      setContests((prev) =>
        prev.map((c) => (c.contest_id === formData.contest_id ? { ...formData } : c))
      );
    }
    closeContestModal();
  };

  // ----- Delete contest -----
  const handleConfirmDelete = () => {
    setContests((prev) => prev.filter((c) => c.contest_id !== confirmDeleteModal.contestId));
    setConfirmDeleteModal({ isOpen: false, contestId: null, contestName: "" });
  };

  // ----- Table columns -----
  const contestColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "year", header: "Year" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
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
          onEdit={() => openEditContestModal(row.original)}
          onDelete={() =>
            setConfirmDeleteModal({
              isOpen: true,
              contestId: row.original.contest_id,
              contestName: row.original.name,
            })
          }
        />
      ),
    },
  ];

  const contestModalTitle =
    contestModal.mode === "create" ? "Create New Contest" : `Edit Contest: ${contestModal.formData?.name}`;

  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="flex flex-col gap-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Trophy size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Contest Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage contests
              </p>
            </div>
          </div>
          <button className="button-orange" onClick={openCreateContestModal}>
            New Contest
          </button>
        </div>

        {/* Table */}
        <TableFluent
          data={contests}
          columns={contestColumns}
          title="Contests"
          onRowClick={(contest) => navigate(`/organizer/contests/${contest.contest_id}`)}
        />

        {/* Contest Modal */}
        {contestModal.isOpen && (
          <Modal
            isOpen={contestModal.isOpen}
            onClose={closeContestModal}
            title={contestModalTitle}
            size="lg"
            footer={
              <>
                <button className="button-white" onClick={closeContestModal}>
                  Cancel
                </button>
                <button className="button-orange" onClick={handleSaveContest}>
                  {contestModal.mode === "create" ? "Create" : "Save Changes"}
                </button>
              </>
            }
          >
            <ContestForm
              formData={contestModal.formData}
              onChange={(newData) =>
                setContestModal((prev) => ({ ...prev, formData: newData }))
              }
              errors={contestModal.errors}
            />
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteModal.isOpen && (
          <Modal
            isOpen={confirmDeleteModal.isOpen}
            onClose={() => setConfirmDeleteModal({ isOpen: false, contestId: null, contestName: "" })}
            title="Delete Contest"
            size="sm"
            footer={
              <>
                <button className="button-white" onClick={() => setConfirmDeleteModal({ isOpen: false, contestId: null, contestName: "" })}>
                  Cancel
                </button>
                <button className="button-orange" onClick={handleConfirmDelete}>
                  Delete
                </button>
              </>
            }
          >
            <p>
              Are you sure you want to delete the contest <strong>{confirmDeleteModal.contestName}</strong>?
            </p>
          </Modal>
        )}
      </div>
    </PageContainer>
  );
};

export default OrganizerContests;
