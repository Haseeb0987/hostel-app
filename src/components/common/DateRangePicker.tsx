import React from "react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = "",
}) => {
  return (
    <div className={`d-flex gap-2 align-items-center ${className}`}>
      <div className="input-group input-group-sm">
        <span className="input-group-text">From</span>
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div className="input-group input-group-sm">
        <span className="input-group-text">To</span>
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </div>
  );
};
