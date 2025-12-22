import React, { useCallback, useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import {
  useGetOpenCodeQuery,
  useGenerateOpenCodeMutation,
} from "../../../../services/openCodeApi"
import BaseModal from "../../../../shared/components/BaseModal"
import { Spinner } from "../../../../shared/components/SpinnerFluent"

const OrganizerOpenCodeModal = ({ isOpen, onClose, roundId }) => {
  const {
    data: openCode,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetOpenCodeQuery(roundId, {
    skip: !isOpen,
  })
  const [generateOpenCode, { isLoading: isGenerating }] =
    useGenerateOpenCodeMutation()

  const hasCode = Boolean(openCode)
  const isReloading = isFetching && !isLoading // refetch after initial load
  const showLoadingOverlay = isLoading || isReloading || isGenerating

  const errorMessage = error?.data?.message || error?.message || ""
  const isNotFoundError =
    errorMessage.toLowerCase().includes("not found") ||
    (error?.status === 403 && error?.data?.errorCode === "FORBIDDEN")

  const handleReload = () => refetch()

  const handleGenerate = async () => {
    try {
      await generateOpenCode(roundId).unwrap()
    } catch (e) {
      console.error("Generate failed:", e)
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Open Code" size="md">
      {/* Error */}
      {error && !isNotFoundError && (
        <div className="bg-red-50 border border-red-200 rounded-[5px] p-4">
          <div className="flex items-center gap-2 text-red-600">
            <Icon icon="mdi:alert-circle" width="20" />
            <p className="text-sm text-red-500">
              {errorMessage || "Failed to load open code"}
            </p>
          </div>
        </div>
      )}

      {/* Code Display */}
      {hasCode && (
        <div className="space-y-4">
          <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-5 relative">
            {/* Single overlay */}
            {showLoadingOverlay && (
              <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[5px]">
                <Spinner />
              </div>
            )}

            <code className="text-lg font-mono font-bold break-all">
              {openCode}
            </code>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-[5px] p-3">
            <div className="flex items-start gap-2">
              <Icon
                icon="mdi:information"
                width="20"
                className="text-[#E05307]"
              />
              <p className="text-sm leading-5 text-[#7A7574]">
                Share this code with students so they can access this round.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* No code */}
      {!hasCode && !isLoading && (
        <div className="text-center py-8 text-[#7A7574]">
          <Icon
            icon="mdi:code-braces"
            width="48"
            className="mx-auto mb-4 opacity-50"
          />
          <p className="mb-4 text-sm leading-5">
            No open code available for this round.
          </p>
        </div>
      )}
      {/* Header buttons */}
      <div className="flex justify-end items-center gap-2 mt-5">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={isGenerating ? "button-gray" : "button-orange"}
        >
          Generate
        </button>

        <button
          onClick={handleReload}
          disabled={isReloading}
          className="button-white"
        >
          Reload
        </button>
      </div>
    </BaseModal>
  )
}

export default OrganizerOpenCodeModal
