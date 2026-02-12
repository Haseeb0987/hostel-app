import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  message = "There are no items to display.",
  icon,
  action,
}) => {
  return (
    <div className="text-center py-5">
      <div className="mb-3 text-muted">{icon || <Inbox size={48} />}</div>
      <h5 className="text-muted">{title}</h5>
      <p className="text-muted mb-3">{message}</p>
      {action}
    </div>
  );
};
