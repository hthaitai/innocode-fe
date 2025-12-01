import TableFluent from "@/shared/components/TableFluent"
import { getResultColumns } from "../columns/getResultColumns"

const columns = getResultColumns()

const ResultsTable = ({ results, loading, pagination, onPageChange }) => {
  const renderSubComponent = (submission) => {
    return (
      <div className="overflow-x-auto">
        <table className="table-fixed w-full border-b border-t border-[#E5E5E5] border-collapse">
          <thead>
            <tr>
              <th className="p-2 px-5 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] text-left">
                Criterion
              </th>
              <th className="p-2 px-5 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] text-left">
                Score
              </th>
              <th className="p-2 px-5 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] text-left">
                Max
              </th>
              <th className="p-2 px-5 text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-[#E5E5E5] text-left">
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {submission.criterionResults.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-[14px] leading-[20px] text-[#7A7574] py-4"
                >
                  No criteria available.
                </td>
              </tr>
            ) : (
              submission.criterionResults.map((criterion, index) => (
                <tr
                  key={index}
                  className="group hover:bg-[#F6F6F6] transition-colors"
                >
                  <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                    {criterion.description}
                  </td>
                  <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                    {criterion.score}
                  </td>
                  <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                    {criterion.maxScore}
                  </td>
                  <td className="text-[14px] leading-[20px] border-[#E5E5E5] align-middle p-2 px-5 truncate">
                    {criterion.note || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <TableFluent
      data={results}
      columns={columns}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
      renderSubComponent={renderSubComponent}
      renderActions={() => (
        <div className="min-h-[70px] px-5 flex items-center">
          <p className="text-[14px] leading-[20px] font-medium">
            Results
          </p>
        </div>
      )}
    />
  )
}

export default ResultsTable
