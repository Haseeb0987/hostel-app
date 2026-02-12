import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <div className={`input-group ${className}`}>
      <span className="input-group-text bg-white border-end-0">
        <Search size={16} className="text-muted" />
      </span>
      <input
        type="text"
        className="form-control border-start-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => onChange("")}
        >
          &times;
        </button>
      )}
    </div>
  );
};
