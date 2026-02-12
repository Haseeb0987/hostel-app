import React from "react";
import { getStatusColor, getStatusLabel } from "../../utils/helpers";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return <span className={`badge bg-${color} ${className}`}>{label}</span>;
};
