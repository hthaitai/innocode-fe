import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetContestByIdQuery,
  useUpdateContestMutation,
} from "../../../../services/contestApi";
import { toast } from "react-hot-toast";
import ContestForm from "../../components/organizer/ContestForm";
import { validateContest } from "@/features/contest/validators/contestValidator";
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs";
import { fromDatetimeLocal, toDatetimeLocal } from "../../../../shared/utils/dateTime";

export default function EditContestPage() {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const { data: contest, isLoading, isError } = useGetContestByIdQuery(contestId);
  const [updateContest, { isLoading: updating }] = useUpdateContestMutation();

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form data once contest is loaded
  useEffect(() => {
    if (!contest) return;
    const formatted = {
      ...contest,
      description: contest.description ?? "",
      rewardsText: contest.rewardsText ?? "",
      start: toDatetimeLocal(contest.start),
      end: toDatetimeLocal(contest.end),
      registrationStart: toDatetimeLocal(contest.registrationStart),
      registrationEnd: toDatetimeLocal(contest.registrationEnd),
    };
    setFormData(formatted);
    setOriginalData(formatted);
  }, [contest]);

  // Detect changes for submit button state
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false;
    return Object.keys(formData).some((key) => {
      if (key === "imgFile") return formData.imgFile !== originalData.imgFile;
      return formData[key] !== originalData[key];
    });
  }, [formData, originalData]);

  const breadcrumbItems = useMemo(
    () => BREADCRUMBS.ORGANIZER_CONTEST_EDIT(contest?.name ?? "Edit Contest"),
    [contest?.name]
  );

  const breadcrumbPaths = useMemo(
    () => BREADCRUMB_PATHS.ORGANIZER_CONTEST_EDIT(contestId),
    [contestId]
  );

  const handleSubmit = async () => {
    if (!formData) return;

    // Validate form
    const validationErrors = validateContest(formData, { isEdit: true });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`);
      return;
    }

    // Build FormData
    const payload = new FormData();
    payload.append("year", formData.year);
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("start", fromDatetimeLocal(formData.start));
    payload.append("end", fromDatetimeLocal(formData.end));
    payload.append("registrationStart", fromDatetimeLocal(formData.registrationStart));
    payload.append("registrationEnd", fromDatetimeLocal(formData.registrationEnd));
    payload.append("teamMembersMax", formData.teamMembersMax);
    payload.append("teamLimitMax", formData.teamLimitMax);
    payload.append("rewardsText", formData.rewardsText);

    if (formData.imgFile) {
      payload.append("ImageFile", formData.imgFile);
    } else if (formData.imgUrl) {
      payload.append("imgUrl", formData.imgUrl);
    }

    try {
      await updateContest({ id: contestId, data: payload }).unwrap();
      toast.success("Contest updated successfully!");
      navigate(`/organizer/contests/${contestId}`);
    } catch (err) {
      const fieldErrors = {};
      if (err?.data?.errors) {
        if (Array.isArray(err.data.errors)) {
          err.data.errors.forEach((e) => {
            if (e.field) fieldErrors[e.field] = e.message;
          });
        } else {
          Object.assign(fieldErrors, err.data.errors);
        }
        setErrors(fieldErrors);
      }

      if (err?.data?.Code === "DUPLICATE") {
        toast.error(err.data.Message);
        if (err.data.AdditionalData?.suggestion) {
          setErrors((prev) => ({
            ...prev,
            nameSuggestion: err.data.AdditionalData.suggestion,
          }));
        }
      } else {
        toast.error(err?.data?.message || "Failed to update contest.");
      }
    }
  };

  if (isLoading || !formData) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={isLoading}
      />
    );
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isLoading}
      error={isError}
    >
      <ContestForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={updating}
        mode="edit"
        hasChanges={hasChanges}
      />
    </PageContainer>
  );
}
