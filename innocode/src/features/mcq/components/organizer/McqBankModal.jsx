import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import { useGetBanksQuery } from "@/services/mcqApi"
import { Check, Database } from "lucide-react"
import { Spinner } from "../../../../shared/components/SpinnerFluent"

const McqBankModal = ({ isOpen, onClose, selectedBanks, setSelectedBanks }) => {
  const [localSelectedBanks, setLocalSelectedBanks] = useState(
    selectedBanks || []
  )

  const {
    data: banksData,
    isLoading,
    isError,
  } = useGetBanksQuery({
    pageNumber: 1,
    pageSize: 100,
  })

  const banks = banksData?.data || []

  useEffect(() => {
    setLocalSelectedBanks(selectedBanks || [])
  }, [selectedBanks, isOpen])

  const toggleSelectBank = (bank) => {
    setLocalSelectedBanks((prev) => {
      if (prev.find((b) => b.bankId === bank.bankId)) {
        return prev.filter((b) => b.bankId !== bank.bankId)
      }
      return [...prev, bank]
    })
  }

  const handleSave = () => {
    setSelectedBanks(localSelectedBanks)
    onClose()
  }

  const handleClose = () => {
    setLocalSelectedBanks(selectedBanks || [])
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Choose a bank to import"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" className="button-white" onClick={handleClose}>
            Cancel
          </button>
          <button type="button" className="button-orange" onClick={handleSave}>
            Import
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto text-sm leading-5">
        {isLoading && <Spinner />}

        {isError && (
          <p className="text-red-500 text-center">Failed to load banks</p>
        )}

        {!isLoading && !isError && banks.length === 0 && (
          <p className="text-center text-[#7A7574]">
            No banks available, import csv to add bank.
          </p>
        )}

        <div className="flex flex-col gap-1">
          {!isLoading &&
            !isError &&
            banks.map((bank) => {
              const isSelected = localSelectedBanks.some(
                (b) => b.bankId === bank.bankId
              )
              return (
                <div
                  key={bank.bankId}
                  className={`flex justify-between items-center min-h-[70px] px-5 rounded-[5px] cursor-pointer transition-colors ${
                    isSelected ? "bg-[#F6F6F6]" : "hover:bg-[#F6F6F6]"
                  }`}
                  onClick={() => toggleSelectBank(bank)}
                >
                  <div className="flex gap-5 items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelectBank(bank)}
                      className="w-5 h-5 text-[#E05307] accent-[#E05307]"
                    />

                    <div className="flex flex-col">
                      <span className={isSelected ? "" : "text-black"}>
                        {bank.name}
                      </span>
                      <span className="text-xs leading-4 text-[#7A7574]">
                        {new Date(bank.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className="text-[#7A7574]">
                    {bank.totalQuestions ?? 0} questions
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    </BaseModal>
  )
}

export default McqBankModal
