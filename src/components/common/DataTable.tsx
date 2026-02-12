import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (item: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (item: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hover?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  sortField,
  sortDirection,
  onSort,
  onRowClick,
  isLoading,
  emptyMessage = "No data available",
  className = "",
  striped = true,
  hover = true,
}) => {
  const renderSortIcon = (column: Column) => {
    if (!column.sortable) return null;

    const isActive = sortField === column.key;
    return (
      <span
        className="ms-1 d-inline-flex flex-column"
        style={{ lineHeight: "0.5" }}
      >
        <ChevronUp
          size={12}
          className={
            isActive && sortDirection === "asc" ? "text-primary" : "text-muted"
          }
        />
        <ChevronDown
          size={12}
          className={
            isActive && sortDirection === "desc" ? "text-primary" : "text-muted"
          }
        />
      </span>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCellValue = (item: any, column: Column) => {
    if (column.render) {
      return column.render(item);
    }
    const keys = column.key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = item;
    for (const key of keys) {
      value = value?.[key];
    }
    return value as React.ReactNode;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-responsive ${className}`}>
      <table
        className={`table ${striped ? "table-striped" : ""} ${
          hover ? "table-hover" : ""
        } align-middle mb-0`}
      >
        <thead className="table-light">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${
                  column.sortable ? "cursor-pointer user-select-none" : ""
                } ${column.className || ""}`}
                onClick={() => column.sortable && onSort?.(column.key)}
                style={column.sortable ? { cursor: "pointer" } : undefined}
              >
                <span className="d-flex align-items-center">
                  {column.label}
                  {renderSortIcon(column)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-muted py-4"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => onRowClick?.(item)}
                style={onRowClick ? { cursor: "pointer" } : undefined}
              >
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {getCellValue(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
