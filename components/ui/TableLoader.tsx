import React from "react";
import clsx from "clsx";

type TableLoaderProps = {
  rows?: number;
  columns?: number;
  className?: string;
};

export const TableLoader: React.FC<TableLoaderProps> = ({
  rows = 5,
  columns = 4,
  className = "",
}) => {
  return (
    <table className={clsx("w-full table-auto", className)}>
      <tbody>
        <></>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {[...Array(columns)].map((_, colIndex) => (
              <td key={colIndex} className="px-4 py-3">
                <div className="h-5 bg-gray-200 rounded w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
