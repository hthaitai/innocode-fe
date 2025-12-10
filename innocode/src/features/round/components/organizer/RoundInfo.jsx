import React, { useCallback, useState } from "react";
import InfoSection from "@/shared/components/InfoSection";
import DetailTable from "@/shared/components/DetailTable";
import { formatDateTime } from "@/shared/utils/dateTime";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRoundByIdQuery } from "@/services/roundApi";
import { useGetOpenCodeQuery } from "../../../../services/openCodeApi";
import BaseModal from "@/shared/components/BaseModal";
import { Icon } from "@iconify/react";

const RoundInfo = () => {
  const navigate = useNavigate();
  const { roundId } = useParams();
  const { data: round, isLoading, isError } = useGetRoundByIdQuery(roundId);
  
  // State for open code modal
  const [isOpenCodeModalOpen, setIsOpenCodeModalOpen] = useState(false);
  const [shouldFetchCode, setShouldFetchCode] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  
  // Fetch open code only when modal is opened
  const { data: openCodeData, isLoading: codeLoading, isFetching: codeFetching, error: codeError, refetch: refetchOpenCode } = useGetOpenCodeQuery(roundId, {
    skip: !shouldFetchCode,
  });

 

  const handleEdit = useCallback(() => {
    if (!round) return;
    navigate(
      `/organizer/contests/${round.contestId}/rounds/${round.roundId}/edit`
    );
  }, [round, navigate]);

  // Handle open code button click
  const handleOpenCode = useCallback(() => {
    setShouldFetchCode(true);
    setIsOpenCodeModalOpen(true);
  }, []);

  // Close modal and reset fetch flag
  const handleCloseCodeModal = useCallback(() => {
    setIsOpenCodeModalOpen(false);
    setShouldFetchCode(false);
  }, []);

  // Handle reload open code
  const handleReloadCode = useCallback(() => {
    console.log("Reload button clicked", { roundId, shouldFetchCode });
    // Set reloading state to show loading effect
    setIsReloading(true);
    // Ensure shouldFetchCode is true when reloading
    if (!shouldFetchCode) {
      setShouldFetchCode(true);
    }
    // Always refetch when reload button is clicked
    refetchOpenCode()
      .then((result) => {
        console.log("Refetch result:", result);
        if (result.error) {
          console.error("Refetch returned error:", {
            status: result.error.status,
            errorCode: result.error?.data?.errorCode,
            errorMessage: result.error?.data?.errorMessage,
            fullError: result.error,
          });
        } else if (result.data) {
          console.log("Refetch success - data received:", result.data);
        }
      })
      .catch((error) => {
        console.error("Refetch failed with exception:", error);
      })
      .finally(() => {
        // Reset reloading state after a small delay to ensure loading effect is visible
        setTimeout(() => {
          setIsReloading(false);
        }, 300);
      });
  }, [shouldFetchCode, refetchOpenCode, roundId]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !round) return <div>Failed to load round information.</div>;

  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val;
  const formatPenaltyRate = (rate) =>
    rate == null || rate === "" ? "—" : `${(rate * 100).toFixed(0)}%`;

  const details = [];

  // Core Round Info
  details.push(
    { label: "Round Name", value: safe(round.roundName) },
    { label: "Contest Name", value: safe(round.contestName) },
    {
      label: "Problem Type",
      value:
        round.problemType === "McqTest"
          ? "Multiple Choice Questions (MCQ)"
          : round.problemType === "AutoEvaluation"
          ? "Auto Evaluation (Auto-graded Coding)"
          : round.problemType === "Manual"
          ? "Manual Evaluation (Judge Review)"
          : safe(round.problemType),
    },
    { spacer: true }
  );

  // Timing
  details.push(
    { label: "Start Time", value: safe(formatDateTime(round.start)) },
    { label: "End Time", value: safe(formatDateTime(round.end)) },
    { label: "Time Limit (seconds)", value: safe(round.timeLimitSeconds) },
    { spacer: true }
  );

  // MCQ Test Info
  if (round.mcqTest) {
    details.push({ label: "MCQ Test Name", value: safe(round.mcqTest.name) });

    try {
      const parsedConfig = JSON.parse(round.mcqTest.config || "{}");
      if (Object.keys(parsedConfig).length > 0) {
        Object.entries(parsedConfig).forEach(([key, value]) => {
          details.push({
            label: `MCQ Config – ${key.replace(/_/g, " ")}`,
            value:
              value === true
                ? "Yes"
                : value === false
                ? "No"
                : value?.toString?.() ?? "—",
          });
        });
      } else {
        details.push({ label: "MCQ Config", value: "—" });
      }
    } catch {
      details.push({
        label: "MCQ Config (Raw String)",
        value: safe(round.mcqTest.config),
      });
    }
  }

  // Problem Info (AutoEval / Manual)
  if (round.problem) {
    details.push(
      { label: "Problem Language", value: safe(round.problem.language) },
      {
        label: "Penalty Rate",
        value: formatPenaltyRate(round.problem.penaltyRate),
      },
      { label: "Problem Description", value: safe(round.problem.description) }
    );
  } else if (!round.mcqTest) {
    details.push({ label: "Problem Configuration", value: "—" });
  }

  const filteredDetails = details.filter(
    (d) => d.value !== undefined || d.spacer
  );

  // Extract open code from API response
  const openCode = openCodeData?.data?.openCode || openCodeData?.openCode || openCodeData?.data || "";

  // Check if error is "Open code not found" - should be treated as "no code available" not an error
  const errorMessage = codeError?.data?.errorMessage || 
                       codeError?.data?.message || 
                       codeError?.message || "";
  const isNotFoundError = errorMessage === "Open code not found." || 
                          errorMessage === "Open code not found" ||
                          codeError?.status === 403 && codeError?.data?.errorCode === "FORBIDDEN";

  // Log API response for debugging
  React.useEffect(() => {
    if (openCodeData) {
      console.log("Open Code Data received:", {
        openCodeData,
        extractedOpenCode: openCode,
        roundId,
      });
    }
  }, [openCodeData, openCode, roundId]);

  return (
    <>
      <InfoSection
        title="Round Information"
        onEdit={handleEdit}
      >
        <DetailTable
          data={filteredDetails}
          labelWidth="180px"
        />
        <div className="flex justify-end">
          <button onClick={handleOpenCode} className="button-blue">
            Open Code
          </button>
        </div>
      </InfoSection>

      {/* Open Code Modal */}
      <BaseModal
        isOpen={isOpenCodeModalOpen}
        onClose={handleCloseCodeModal}
        title=""
        size="md"
      >
        {/* Custom header with title and reload icon */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E5E5]">
          <h2 className="text-[20px] leading-[26px] font-semibold">
            Open Code
          </h2>
          <button
            onClick={handleReloadCode}
            disabled={isReloading || codeLoading || codeFetching}
            className="flex items-center cursor-pointer  gap-2 px-3 py-1.5 text-sm text-[#7A7574] hover:text-[#ff6b35] hover:bg-[#f9fafb] rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reload code"
          >
            <Icon
              icon="mdi:reload"
              width="20"
              className={(isReloading || codeLoading || codeFetching) ? "animate-spin" : ""}
            />
            <span>Reload</span>
          </button>
        </div>
        {(codeLoading || codeFetching) && !openCode && !isReloading ? (
          <div className="space-y-4">
            {/* Skeleton loader */}
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-[#7A7574]">
                <Icon
                  icon="mdi:loading"
                  width="20"
                  className="text-[#ff6b35] animate-spin"
                />
                <span className="text-sm">Loading code...</span>
              </div>
            </div>
          </div>
        ) : codeError && !isNotFoundError && !isReloading && !codeFetching ? (
          <div className="bg-red-50 border border-red-200 rounded-[5px] p-4 relative">
            {/* Loading overlay when reloading with error */}
            {(isReloading || codeFetching) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-[5px]">
                <div className="text-center">
                  <Icon
                    icon="mdi:loading"
                    width="32"
                    className="mx-auto mb-2 text-[#ff6b35] animate-spin"
                  />
                  <p className="text-sm text-[#7A7574] font-medium">Reloading...</p>
                </div>
              </div>
            )}
            <div className={isReloading || codeFetching ? "opacity-50 transition-opacity duration-300" : ""}>
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <Icon icon="mdi:alert-circle" width="20" />
                <span className="font-medium">Error loading code</span>
              </div>
              <p className="text-sm text-red-500">
                {errorMessage || "Failed to load open code"}
              </p>
            </div>
          </div>
        ) : openCode ? (
          <div className="space-y-4 relative">
            {/* Loading overlay when refetching */}
            {(isReloading || codeLoading || codeFetching) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-[5px]">
                <div className="text-center">
                  <Icon
                    icon="mdi:loading"
                    width="32"
                    className="mx-auto mb-2 text-[#ff6b35] animate-spin"
                  />
                  <p className="text-sm text-[#7A7574] font-medium">Reloading...</p>
                </div>
              </div>
            )}
            <div className={(isReloading || codeLoading || codeFetching) ? "opacity-50 transition-opacity duration-300" : "transition-opacity duration-300"}>
              <div>
                <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                  <code className="text-lg font-mono font-bold text-[#2d3748] break-all">
                    {openCode}
                  </code>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-[5px] p-3 mt-4">
                <div className="flex items-start gap-2">
                  <Icon
                    icon="mdi:information"
                    width="18"
                    className="flex-shrink-0 text-blue-500 mt-0.5"
                  />
                  <p className="text-sm text-[#4a5568]">
                    Share this code with students so they can access this round.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 relative">
            {/* Loading overlay when reloading */}
            {(isReloading || codeFetching) && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-[5px]">
                <div className="text-center">
                  <Icon
                    icon="mdi:loading"
                    width="32"
                    className="mx-auto mb-2 text-[#ff6b35] animate-spin"
                  />
                  <p className="text-sm text-[#7A7574] font-medium">Reloading...</p>
                </div>
              </div>
            )}
            <div className={isReloading || codeFetching ? "opacity-50 transition-opacity duration-300" : ""}>
              <div className="text-center py-8 text-[#7A7574]">
                <Icon icon="mdi:code-braces" width="48" className="mx-auto mb-2 opacity-50" />
                <p>No open code available for this round.</p>
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    </>
  );
};

export default RoundInfo;
