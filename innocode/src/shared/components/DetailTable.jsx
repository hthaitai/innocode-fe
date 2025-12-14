import React from "react";

const DetailTable = ({ data, labelWidth = "150px", onOpencode }) => (
  <table
    className="table-auto border-collapse w-full"
    style={{ tableLayout: "fixed" }} 
  >
    <tbody>
      {data.map((row, index) => {
        if (row.spacer) {
          return (
            <tr key={`spacer-${index}`} className="h-4">
              <td colSpan={2}></td>
            </tr>
          );
        }

        const displayValue =
          row.value === null || row.value === undefined || row.value === ""
            ? "-"
            : row.value;

        return (
          
          <tr key={`${row.label}-${index}`}>
            <th
              className="py-1 pr-7 font-normal whitespace-nowrap align-top text-left"
              scope="row"
              style={{ width: labelWidth }}
            >
              {row.label}
            </th>
            <td className="py-1 text-[#7A7574] break-words whitespace-pre-wrap">{displayValue}</td>
          </tr>
          
        );
      })} 
    </tbody>
  </table>
);

export default DetailTable;
