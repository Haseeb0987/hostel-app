import React from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { exportToExcel, exportToPDF } from "../../utils/helpers";

interface ExportButtonsProps {
  data: unknown[];
  filename: string;
  className?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  filename,
  className = "",
}) => {
  return (
    <div className={`btn-group ${className}`}>
      <button
        type="button"
        className="btn btn-outline-success btn-sm"
        onClick={() => exportToExcel(data, filename)}
        title="Export to Excel"
      >
        <FileSpreadsheet size={16} className="me-1" />
        Excel
      </button>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={() => exportToPDF(data, filename)}
        title="Export to PDF"
      >
        <FileText size={16} className="me-1" />
        PDF
      </button>
    </div>
  );
};
