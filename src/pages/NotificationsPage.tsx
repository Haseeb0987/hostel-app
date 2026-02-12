import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Bell,
  Send,
  MessageSquare,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import {
  DataTable,
  SearchInput,
  Pagination,
  Modal,
  ConfirmDialog,
  StatusBadge,
  FormInput,
} from "../components/common";
import { usePagination, useSearchSort, useModal } from "../hooks";
import { Notification, NotificationTemplate } from "../types";
import {
  notifications as initialNotifications,
  notificationTemplates as initialTemplates,
  getNotificationsByStatus,
} from "../data/notifications";
import { residents, getResidentById } from "../data/residents";
import { formatDate, formatDateLong } from "../utils/helpers";

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [templates, setTemplates] =
    useState<NotificationTemplate[]>(initialTemplates);
  const [activeTab, setActiveTab] = useState<"notifications" | "templates">(
    "notifications"
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const sendModal = useModal<NotificationTemplate>();
  const templateModal = useModal<NotificationTemplate>();
  const deleteDialog = useModal<NotificationTemplate>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filterStatus !== "all" && n.status !== filterStatus) return false;
    if (filterType !== "all" && n.type !== filterType) return false;
    return true;
  });

  // Search and sort
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
  } = useSearchSort({
    data: filteredNotifications,
    searchFields: ["title", "message"],
  });

  // Pagination
  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: 10 });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Stats
  const sentCount = notifications.filter((n) => n.status === "sent").length;
  const pendingCount = notifications.filter(
    (n) => n.status === "pending"
  ).length;
  const failedCount = notifications.filter((n) => n.status === "failed").length;

  const notificationColumns = [
    {
      key: "title",
      label: "Notification",
      sortable: true,
      render: (item: Notification) => (
        <div>
          <div className="fw-medium">{item.title}</div>
          <small
            className="text-muted text-truncate d-block"
            style={{ maxWidth: "300px" }}
          >
            {item.message}
          </small>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (item: Notification) => (
        <span className="badge bg-light text-dark text-capitalize">
          {item.type.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "channel",
      label: "Channel",
      render: (item: Notification) => (
        <div className="d-flex gap-1">
          {(item.channel === "sms" || item.channel === "both") && (
            <span className="badge bg-primary" title="SMS">
              <Phone size={12} />
            </span>
          )}
          {(item.channel === "whatsapp" || item.channel === "both") && (
            <span className="badge bg-success" title="WhatsApp">
              <MessageSquare size={12} />
            </span>
          )}
        </div>
      ),
    },
    {
      key: "recipient",
      label: "Recipient",
      render: (item: Notification) => {
        if (item.recipientId) {
          const resident = getResidentById(item.recipientId);
          return resident?.name || "Unknown";
        }
        return <span className="text-muted">Bulk</span>;
      },
    },
    {
      key: "sentAt",
      label: "Sent At",
      sortable: true,
      render: (item: Notification) =>
        item.sentAt ? formatDate(item.sentAt) : "-",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Notification) => <StatusBadge status={item.status} />,
    },
  ];

  const handleSendNotification = (template?: NotificationTemplate) => {
    if (template) {
      setValue("type", template.type);
      setValue("channel", template.channel);
      setValue("message", template.messageTemplate);
    }
    sendModal.openModal(template);
  };

  const onSendSubmit = (data: Record<string, unknown>) => {
    const newNotification: Notification = {
      id: `NOT${String(notifications.length + 1).padStart(3, "0")}`,
      type: data.type as Notification["type"],
      title: data.title as string,
      message: data.message as string,
      recipientId: data.recipientId as string,
      channel: data.channel as Notification["channel"],
      status: "pending",
      scheduledAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
    sendModal.closeModal();
    reset();

    // Simulate sending
    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === newNotification.id
            ? { ...n, status: "sent", sentAt: new Date().toISOString() }
            : n
        )
      );
    }, 2000);

    alert("Notification queued for sending!");
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    reset(template);
    templateModal.openModal(template);
  };

  const onTemplateSubmit = (data: Record<string, unknown>) => {
    if (templateModal.data) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateModal.data!.id
            ? ({ ...t, ...data } as NotificationTemplate)
            : t
        )
      );
    } else {
      const newTemplate: NotificationTemplate = {
        ...data,
        id: `TPL${String(templates.length + 1).padStart(3, "0")}`,
        isActive: true,
      } as NotificationTemplate;
      setTemplates((prev) => [...prev, newTemplate]);
    }
    templateModal.closeModal();
    reset();
  };

  const handleDeleteTemplate = () => {
    if (deleteDialog.data) {
      setTemplates((prev) =>
        prev.filter((t) => t.id !== deleteDialog.data!.id)
      );
    }
  };

  const residentOptions = residents
    .filter((r) => r.status === "active")
    .map((r) => ({ value: r.id, label: `${r.name} (${r.phone})` }));

  const typeOptions = [
    { value: "fee_reminder", label: "Fee Reminder" },
    { value: "payment_confirmation", label: "Payment Confirmation" },
    { value: "announcement", label: "Announcement" },
    { value: "alert", label: "Alert" },
  ];

  const channelOptions = [
    { value: "sms", label: "SMS Only" },
    { value: "whatsapp", label: "WhatsApp Only" },
    { value: "both", label: "Both SMS & WhatsApp" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Alerts & Notifications</h4>
          <p className="text-muted mb-0">
            Manage SMS and WhatsApp notifications
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleSendNotification()}
        >
          <Send size={18} className="me-2" />
          Send Notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Bell size={24} className="text-primary mb-2" />
              <div className="text-muted small">Total Sent</div>
              <div className="fw-bold fs-4">{notifications.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <CheckCircle size={24} className="text-success mb-2" />
              <div className="text-muted small">Delivered</div>
              <div className="fw-bold fs-4 text-success">{sentCount}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Clock size={24} className="text-warning mb-2" />
              <div className="text-muted small">Pending</div>
              <div className="fw-bold fs-4 text-warning">{pendingCount}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <AlertCircle size={24} className="text-danger mb-2" />
              <div className="text-muted small">Failed</div>
              <div className="fw-bold fs-4 text-danger">{failedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "notifications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={16} className="me-1" />
            Notifications
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "templates" ? "active" : ""}`}
            onClick={() => setActiveTab("templates")}
          >
            <Copy size={16} className="me-1" />
            Templates
          </button>
        </li>
      </ul>

      {activeTab === "notifications" && (
        <>
          {/* Filters */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-md-4">
                  <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search notifications..."
                  />
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select form-select-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select form-select-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="fee_reminder">Fee Reminder</option>
                    <option value="payment_confirmation">
                      Payment Confirmation
                    </option>
                    <option value="announcement">Announcement</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <DataTable
                columns={notificationColumns}
                data={paginatedData}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                emptyMessage="No notifications found"
              />
            </div>
            <div className="card-footer bg-white border-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                totalItems={filteredData.length}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            </div>
          </div>
        </>
      )}

      {activeTab === "templates" && (
        <div className="row g-3">
          {templates.map((template) => (
            <div key={template.id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{template.name}</h6>
                      <span className="badge bg-light text-dark text-capitalize me-1">
                        {template.type.replace("_", " ")}
                      </span>
                      <span className="badge bg-light text-dark text-capitalize">
                        {template.channel}
                      </span>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={template.isActive}
                        onChange={() => {
                          setTemplates((prev) =>
                            prev.map((t) =>
                              t.id === template.id
                                ? { ...t, isActive: !t.isActive }
                                : t
                            )
                          );
                        }}
                      />
                    </div>
                  </div>
                  <p
                    className="text-muted small mb-3"
                    style={{ minHeight: "60px" }}
                  >
                    {template.messageTemplate}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleSendNotification(template)}
                    >
                      <Send size={14} className="me-1" />
                      Use
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteDialog.openModal(template)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="col-md-6">
            <div
              className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center"
              style={{
                minHeight: "200px",
                cursor: "pointer",
                border: "2px dashed #dee2e6",
              }}
              onClick={() => {
                reset({});
                templateModal.openModal();
              }}
            >
              <div className="text-center text-muted">
                <Plus size={32} className="mb-2" />
                <p className="mb-0">Add New Template</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      <Modal
        isOpen={sendModal.isOpen}
        onClose={sendModal.closeModal}
        title="Send Notification"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSendSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <FormInput
                label="Notification Type"
                name="type"
                register={register}
                error={errors.type}
                required
                type="select"
                options={typeOptions}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Channel"
                name="channel"
                register={register}
                error={errors.channel}
                required
                type="select"
                options={channelOptions}
              />
            </div>
            <div className="col-md-12">
              <FormInput
                label="Recipient"
                name="recipientId"
                register={register}
                type="select"
                options={[
                  { value: "", label: "All Residents (Bulk)" },
                  ...residentOptions,
                ]}
              />
            </div>
            <div className="col-md-12">
              <FormInput
                label="Title"
                name="title"
                register={register}
                error={errors.title}
                required
                placeholder="Notification title"
              />
            </div>
            <div className="col-md-12">
              <FormInput
                label="Message"
                name="message"
                register={register}
                error={errors.message}
                required
                type="textarea"
                placeholder="Use {name}, {amount}, {month}, {dueDate} as placeholders"
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={sendModal.closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} className="me-2" />
              Send Now
            </button>
          </div>
        </form>
      </Modal>

      {/* Template Modal */}
      <Modal
        isOpen={templateModal.isOpen}
        onClose={templateModal.closeModal}
        title={templateModal.data ? "Edit Template" : "Add New Template"}
        size="md"
      >
        <form onSubmit={handleSubmit(onTemplateSubmit)}>
          <FormInput
            label="Template Name"
            name="name"
            register={register}
            error={errors.name}
            required
            placeholder="e.g., Fee Reminder English"
          />
          <FormInput
            label="Type"
            name="type"
            register={register}
            error={errors.type}
            required
            type="select"
            options={typeOptions}
          />
          <FormInput
            label="Channel"
            name="channel"
            register={register}
            error={errors.channel}
            required
            type="select"
            options={channelOptions}
          />
          <FormInput
            label="Message Template"
            name="messageTemplate"
            register={register}
            error={errors.messageTemplate}
            required
            type="textarea"
            placeholder="Use {name}, {amount}, {month}, {dueDate}, {receiptNumber} as placeholders"
          />
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={templateModal.closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {templateModal.data ? "Update" : "Create"} Template
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.closeModal}
        onConfirm={handleDeleteTemplate}
        title="Delete Template"
        message={`Are you sure you want to delete "${deleteDialog.data?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
