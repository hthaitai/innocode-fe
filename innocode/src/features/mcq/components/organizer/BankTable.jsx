import React, { useState, useMemo, useCallback } from "react"
import TableFluent from "@/shared/components/TableFluent"
import { useGetBanksQuery } from "@/services/mcqApi"
import { Database } from "lucide-react"
import { getBankColumns } from "../../columns/getBankColumns"

const BankTable = ({ selectedBanks, setSelectedBanks }) => {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: banksData,
    isLoading,
    isError,
  } = useGetBanksQuery({
    pageNumber: page,
    pageSize,
  })

  const banks = banksData?.data || []
  const pagination = banksData?.additionalData || {
    pageNumber: 1,
    pageSize,
    totalPages: 1,
  }

  const toggleSelectBank = useCallback(
    (bank) => {
      setSelectedBanks((prev) => {
        if (prev.find((b) => b.bankId === bank.bankId)) {
          return prev.filter((b) => b.bankId !== bank.bankId)
        }
        return [...prev, bank]
      })
    },
    [setSelectedBanks]
  )

  const columns = useMemo(
    () => getBankColumns(selectedBanks, toggleSelectBank),
    [selectedBanks, toggleSelectBank]
  )

  return (
    <div className="space-y-1">
      <div className="px-5 py-4 flex justify-between items-center border border-[#E5E5E5] rounded-[5px] bg-white">
        <div className="flex items-center gap-5">
          <Database size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              Import questions from bank
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Select any question bank to preview its questions and add them to
              your test.
            </p>
          </div>
        </div>
      </div>

      <TableFluent
        data={banks}
        columns={columns}
        loading={isLoading}
        error={isError && "Failed to load banks"}
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  )
}

export default BankTable
