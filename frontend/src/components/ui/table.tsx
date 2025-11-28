import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
  // Pagination
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export function Table<T>({
                           columns,
                           data,
                           loading,
                           emptyText = "No data",
                           className,

                           page = 1,
                           pageSize = 10,
                           total = 0,
                           onPageChange,
                         }: TableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border", className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted/50">
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              style={{ width: col.width }}
              className={cn(
                "border-b px-3 py-2 text-left font-medium text-muted-foreground",
                col.className
              )}
            >
              {col.title}
            </th>
          ))}
        </tr>
        </thead>

        <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-3 py-4 text-center text-muted-foreground"
            >
              Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-3 py-4 text-center text-muted-foreground"
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-muted/40 transition-colors"
            >
              {columns.map((col, colIndex) => {
                const value = col.dataIndex
                  ? (item as any)[col.dataIndex]
                  : undefined;

                return (
                  <td key={colIndex} className="border-b px-3 py-2">
                    {col.render
                      ? col.render(value, item, rowIndex)
                      : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))
        )}
        </tbody>
      </table>

      {/* Pagination */}
      {onPageChange && total > 0 && (
        <div className="flex justify-end items-center gap-2 p-3 border-t">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} / {Math.ceil(total / pageSize)}
          </span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === Math.ceil(total / pageSize)}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

