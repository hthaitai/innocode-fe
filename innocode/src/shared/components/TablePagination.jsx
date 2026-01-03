import React from "react"
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"
import { useTranslation } from "react-i18next"

const TablePagination = ({ pagination, onPageChange }) => {
  const { t } = useTranslation("common")
  if (!pagination) return null

  const currentPage = pagination.pageNumber || pagination.currentPage
  const totalPages = pagination.totalPages
  const maxPagesToShow = 5

  // Calculate which pages to show
  let startPage, endPage
  if (totalPages <= maxPagesToShow) {
    startPage = 1
    endPage = totalPages
  } else {
    const halfRange = Math.floor(maxPagesToShow / 2)
    if (currentPage <= halfRange) {
      startPage = 1
      endPage = maxPagesToShow
    } else if (currentPage + halfRange >= totalPages) {
      startPage = totalPages - maxPagesToShow + 1
      endPage = totalPages
    } else {
      startPage = currentPage - halfRange
      endPage = currentPage + halfRange
    }
  }

  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i)

  const buttonClass = (disabled) =>
    `w-8 h-8 rounded-[5px] p-2 transition-colors ${
      disabled
        ? "bg-[#BFBFBF] text-white cursor-not-allowed"
        : "bg-white border border-[#ECECEC] border-b-[#D3D3D3] hover:bg-[#FAFAFA] active:bg-[#D3D3D3]"
    }`

  const pageNumberClass = (pageNum) =>
    `w-8 h-8 rounded-[5px] text-[14px] leading-[20px] transition-colors ${
      pageNum === currentPage
        ? "bg-[#E05307] text-white"
        : "bg-white border border-[#ECECEC] border-b-[#D3D3D3] hover:bg-[#FAFAFA] active:bg-[#E05307] active:text-white"
    }`

  return (
    <div className="flex justify-between items-center mt-3">
      <div className="text-sm leading-5 text-[#7A7574] mb-2">
        {t("common.pagination.pageOfItems", {
          page: currentPage,
          totalPages: totalPages,
          totalCount: pagination.totalCount,
        })}
      </div>

      <div className="flex gap-1 items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className={buttonClass(currentPage === 1)}
          title={t("common.pagination.firstPage")}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
          className={buttonClass(!pagination.hasPreviousPage)}
          title={t("common.pagination.previousPage")}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={pageNumberClass(pageNum)}
          >
            {pageNum}
          </button>
        ))}

        <button
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className={buttonClass(!pagination.hasNextPage)}
          title={t("common.pagination.nextPage")}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className={buttonClass(currentPage === totalPages)}
          title={t("common.pagination.lastPage")}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TablePagination
