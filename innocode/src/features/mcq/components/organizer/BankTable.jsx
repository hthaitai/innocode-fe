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
    <div>
      <TableFluent
        data={banks}
        columns={columns}
        loading={isLoading}
        error={isError && "Failed to load banks"}
        pagination={pagination}
        onPageChange={setPage}
        renderActions={() => (
          <div className="min-h-[70px] px-5 flex items-center">
            <p className="text-[14px] leading-[20px] font-medium">
              Question banks
            </p>
          </div>
        )}
      />
    </div>
  )
}

export default BankTable
