import React from "react"

const DetailTable = ({ data }) => (
  <table className="w-full text-left border-collapse table-auto">
    <tbody>
      {data.map((row) => (
        <tr key={row.label}>
          <th className="py-1 pr-5 whitespace-nowrap font-normal text-[#7A7574] align-top" scope="row">
            {row.label}
          </th>
          <td className="py-1">{row.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default DetailTable
