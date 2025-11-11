import React from "react"

const DetailTable = ({ data }) => (
  <table className="table-auto border-collapse">
    <tbody>
      {data.map((row, index) => {
        if (row.spacer) {
          return (
            <tr key={`spacer-${index}`} className="h-4">
              <td colSpan={2}></td>
            </tr>
          )
        }

        const displayValue =
          row.value === null || row.value === undefined || row.value === ""
            ? "-"
            : row.value

        return (
          <tr key={row.label}>
            <th
              className="py-1 pr-7 font-normal align-top text-left"
              scope="row"
            >
              {row.label}
            </th>
            <td className="py-1 text-[#7A7574]">{displayValue}</td>
          </tr>
        )
      })}
    </tbody>
  </table>
)

export default DetailTable
