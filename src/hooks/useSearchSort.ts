import { useState, useMemo, useCallback } from "react";

type SortDirection = "asc" | "desc";

interface UseSearchSortProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  searchFields?: string[];
  initialSortField?: string;
  initialSortDirection?: SortDirection;
}

interface UseSearchSortReturn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filteredData: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortField: string | null;
  sortDirection: SortDirection;
  handleSort: (field: string) => void;
}

export function useSearchSort({
  data,
  searchFields,
  initialSortField,
  initialSortDirection = "asc",
}: UseSearchSortProps): UseSearchSortReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(
    initialSortField || null
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialSortDirection);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => {
        if (searchFields && searchFields.length > 0) {
          return searchFields.some((field) => {
            const value = item[field];
            if (typeof value === "string") {
              return value.toLowerCase().includes(term);
            }
            if (typeof value === "number") {
              return value.toString().includes(term);
            }
            return false;
          });
        }
        return Object.values(item).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(term);
          }
          if (typeof value === "number") {
            return value.toString().includes(term);
          }
          return false;
        });
      });
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        let comparison = 0;
        if (typeof aVal === "string" && typeof bVal === "string") {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === "number" && typeof bVal === "number") {
          comparison = aVal - bVal;
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, searchFields, sortField, sortDirection]);

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
  };
}
