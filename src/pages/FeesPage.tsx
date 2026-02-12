import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Eye,
  Receipt,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Printer,
  Send,
} from "lucide-react";
import {
  DataTable,
  SearchInput,
  Pagination,
  Modal,
  StatusBadge,
  ExportButtons,
  FormInput,
  DateRangePicker,
} from "../components/common";
import { usePagination, useSearchSort, useModal } from "../hooks";
import { FeeTransaction, Payment } from "../types";
import {
  feeTransactions as initialFees,
  payments,
  getTotalPendingAmount,
  getMonthlyFeeStats,
} from "../data/fees";
import { residents, getResidentById } from "../data/residents";
import { rooms, getRoomById } from "../data/rooms";
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  generateReceiptNumber,
} from "../utils/helpers";

export const FeesPage: React.FC = () => {
  const [fees, setFees] = useState<FeeTransaction[]>(initialFees);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const addPaymentModal = useModal<FeeTransaction>();
  const viewModal = useModal<FeeTransaction>();
  const receiptModal = useModal<{
    fee: FeeTransaction;
    payment: Partial<Payment>;
  }>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Payment>>();

  const pendingAmount = getTotalPendingAmount();
  const monthlyStats = getMonthlyFeeStats();

  // Get unique months from fees
  const months = [...new Set(fees.map((f) => f.month))].sort().reverse();

  // Filter
  const filteredFees = useMemo(() => {
    let result = fees;
    if (filterStatus !== "all") {
      result = result.filter((f) => f.status === filterStatus);
    }
    if (filterType !== "all") {
      result = result.filter((f) => f.type === filterType);
    }
    if (filterMonth !== "all") {
      result = result.filter((f) => f.month === filterMonth);
    }
    if (startDate && endDate) {
      result = result.filter(
        (f) => f.dueDate >= startDate && f.dueDate <= endDate
      );
    }
    return result;
  }, [fees, filterStatus, filterType, filterMonth, startDate, endDate]);

  // Search and sort
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
  } = useSearchSort({
    data: filteredFees.map((f) => ({
      ...f,
      residentName: getResidentById(f.residentId)?.name || "Unknown",
    })),
    searchFields: ["residentName", "receiptNumber"],
  });

  // Pagination
  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: 15 });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const columns = [
    {
      key: "residentName",
      label: "Resident",
      sortable: true,
      render: (item: FeeTransaction & { residentName: string }) => {
        const resident = getResidentById(item.residentId);
        const room = resident ? getRoomById(resident.roomId) : null;
        return (
          <div>
            <div className="fw-medium">{item.residentName}</div>
            <small className="text-muted">Room {room?.roomNumber || "-"}</small>
          </div>
        );
      },
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (item: FeeTransaction) => (
        <span className="text-capitalize badge bg-light text-dark">
          {item.type}
        </span>
      ),
    },
    {
      key: "month",
      label: "Month",
      sortable: true,
      render: (item: FeeTransaction) => item.month,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (item: FeeTransaction) => (
        <span className="fw-medium">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      render: (item: FeeTransaction) => formatDate(item.dueDate),
    },
    {
      key: "paidDate",
      label: "Paid Date",
      sortable: true,
      render: (item: FeeTransaction) =>
        item.paidDate ? formatDate(item.paidDate) : "-",
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: FeeTransaction) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: FeeTransaction) => (
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              viewModal.openModal(item);
            }}
            title="View"
          >
            <Eye size={14} />
          </button>
          {item.status !== "paid" && (
            <button
              className="btn btn-outline-success"
              onClick={(e) => {
                e.stopPropagation();
                handleRecordPayment(item);
              }}
              title="Record Payment"
            >
              <CreditCard size={14} />
            </button>
          )}
          {item.status === "paid" && item.receiptNumber && (
            <button
              className="btn btn-outline-secondary"
              onClick={(e) => {
                e.stopPropagation();
                handlePrintReceipt(item);
              }}
              title="Print Receipt"
            >
              <Printer size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleRecordPayment = (fee: FeeTransaction) => {
    reset({
      amount: fee.amount,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
    });
    addPaymentModal.openModal(fee);
  };

  const handlePrintReceipt = (fee: FeeTransaction) => {
    const payment = payments.find((p) => p.feeTransactionId === fee.id);
    if (payment) {
      receiptModal.openModal({ fee, payment });
    }
  };

  const onSubmitPayment = (data: Partial<Payment>) => {
    if (addPaymentModal.data) {
      const fee = addPaymentModal.data;
      const receiptNumber = generateReceiptNumber();

      // Update fee status
      setFees((prev) =>
        prev.map((f) =>
          f.id === fee.id
            ? {
                ...f,
                status: "paid",
                paidDate: data.paymentDate,
                paymentMethod: data.paymentMethod,
                receiptNumber,
              }
            : f
        )
      );

      // Show receipt
      receiptModal.openModal({
        fee: {
          ...fee,
          status: "paid",
          paidDate: data.paymentDate,
          receiptNumber,
        },
        payment: { ...data, receiptNumber },
      });

      addPaymentModal.closeModal();
      reset({});
    }
  };

  const sendReminder = (fee: FeeTransaction) => {
    const resident = getResidentById(fee.residentId);
    alert(`Reminder sent to ${resident?.name} at ${resident?.phone}`);
  };

  // Calculate stats
  const totalCollected = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalOverdue = fees
    .filter((f) => f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Fee Management</h4>
          <p className="text-muted mb-0">
            Track rent, mess, and utility fee payments
          </p>
        </div>
        <button
          className="btn btn-warning"
          onClick={() =>
            alert(
              "Bulk reminders would be sent to all residents with pending fees"
            )
          }
        >
          <Send size={18} className="me-2" />
          Send Bulk Reminders
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body text-center">
              <CheckCircle size={24} className="text-success mb-2" />
              <div className="text-muted small">Total Collected</div>
              <div className="fw-bold fs-4 text-success">
                {formatCurrency(totalCollected)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
            <div className="card-body text-center">
              <Clock size={24} className="text-warning mb-2" />
              <div className="text-muted small">Pending</div>
              <div className="fw-bold fs-4 text-warning">
                {formatCurrency(totalPending)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-danger bg-opacity-10">
            <div className="card-body text-center">
              <AlertTriangle size={24} className="text-danger mb-2" />
              <div className="text-muted small">Overdue</div>
              <div className="fw-bold fs-4 text-danger">
                {formatCurrency(totalOverdue)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary bg-opacity-10">
            <div className="card-body text-center">
              <Receipt size={24} className="text-primary mb-2" />
              <div className="text-muted small">Total Outstanding</div>
              <div className="fw-bold fs-4 text-primary">
                {formatCurrency(pendingAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-2">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search..."
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-select-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="rent">Rent</option>
                <option value="mess">Mess</option>
                <option value="utility">Utility</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-select-sm"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="all">All Months</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 text-end">
              <ExportButtons data={filteredData} filename="fee-transactions" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <DataTable
            columns={columns}
            data={paginatedData}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onRowClick={(item) => viewModal.openModal(item)}
            emptyMessage="No fee transactions found"
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

      {/* Record Payment Modal */}
      <Modal
        isOpen={addPaymentModal.isOpen}
        onClose={addPaymentModal.closeModal}
        title="Record Payment"
        size="md"
      >
        {addPaymentModal.data && (
          <form onSubmit={handleSubmit(onSubmitPayment)}>
            <div className="alert alert-info">
              <strong>Fee:</strong> {addPaymentModal.data.type} -{" "}
              {addPaymentModal.data.month}
              <br />
              <strong>Resident:</strong>{" "}
              {getResidentById(addPaymentModal.data.residentId)?.name}
              <br />
              <strong>Amount Due:</strong>{" "}
              {formatCurrency(addPaymentModal.data.amount)}
            </div>
            <div className="row">
              <div className="col-md-6">
                <FormInput
                  label="Amount"
                  name="amount"
                  register={register}
                  error={errors.amount}
                  required
                  type="number"
                />
              </div>
              <div className="col-md-6">
                <FormInput
                  label="Payment Date"
                  name="paymentDate"
                  register={register}
                  error={errors.paymentDate}
                  required
                  type="date"
                />
              </div>
              <div className="col-md-6">
                <FormInput
                  label="Payment Method"
                  name="paymentMethod"
                  register={register}
                  error={errors.paymentMethod}
                  required
                  type="select"
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "bank", label: "Bank Transfer" },
                    { value: "online", label: "Online Payment" },
                    { value: "cheque", label: "Cheque" },
                  ]}
                />
              </div>
              <div className="col-md-6">
                <FormInput
                  label="Received By"
                  name="receivedBy"
                  register={register}
                  type="select"
                  options={[
                    { value: "E001", label: "Muhammad Aslam (Manager)" },
                    { value: "E002", label: "Akbar Ali (Warden)" },
                    { value: "E003", label: "Nasreen Bibi (Accountant)" },
                  ]}
                />
              </div>
              <div className="col-md-12">
                <FormInput
                  label="Notes"
                  name="notes"
                  register={register}
                  type="textarea"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addPaymentModal.closeModal}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-success">
                <CreditCard size={16} className="me-2" />
                Record Payment
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        title="Fee Details"
        size="md"
      >
        {viewModal.data && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-muted">Resident:</td>
                      <td className="fw-medium">
                        {getResidentById(viewModal.data.residentId)?.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Type:</td>
                      <td className="text-capitalize">{viewModal.data.type}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Month:</td>
                      <td>{viewModal.data.month}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Amount:</td>
                      <td className="fw-bold">
                        {formatCurrency(viewModal.data.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-muted">Due Date:</td>
                      <td>{formatDate(viewModal.data.dueDate)}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Paid Date:</td>
                      <td>
                        {viewModal.data.paidDate
                          ? formatDate(viewModal.data.paidDate)
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Status:</td>
                      <td>
                        <StatusBadge status={viewModal.data.status} />
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Receipt:</td>
                      <td>{viewModal.data.receiptNumber || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3">
              {viewModal.data.status !== "paid" && (
                <>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      viewModal.closeModal();
                      sendReminder(viewModal.data!);
                    }}
                  >
                    <Send size={16} className="me-2" />
                    Send Reminder
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      viewModal.closeModal();
                      handleRecordPayment(viewModal.data!);
                    }}
                  >
                    <CreditCard size={16} className="me-2" />
                    Record Payment
                  </button>
                </>
              )}
              {viewModal.data.status === "paid" && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    viewModal.closeModal();
                    handlePrintReceipt(viewModal.data!);
                  }}
                >
                  <Printer size={16} className="me-2" />
                  Print Receipt
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={receiptModal.isOpen}
        onClose={receiptModal.closeModal}
        title="Payment Receipt"
        size="md"
      >
        {receiptModal.data && (
          <div className="receipt-content" id="receipt">
            <div className="text-center mb-4">
              <h4 className="mb-1">Al-Noor Boys Hostel</h4>
              <p className="text-muted mb-0 small">
                House 45, Block C, Model Town, Lahore
              </p>
              <p className="text-muted small">Phone: 0300-1234567</p>
              <hr />
              <h5 className="mb-0">PAYMENT RECEIPT</h5>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <strong>Receipt #:</strong>{" "}
                {receiptModal.data.fee.receiptNumber}
              </div>
              <div className="col-6 text-end">
                <strong>Date:</strong>{" "}
                {formatDateLong(
                  receiptModal.data.payment.paymentDate ||
                    new Date().toISOString()
                )}
              </div>
            </div>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td className="text-muted">Resident Name</td>
                  <td className="fw-medium">
                    {getResidentById(receiptModal.data.fee.residentId)?.name}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Room</td>
                  <td>
                    {getRoomById(
                      getResidentById(receiptModal.data.fee.residentId)
                        ?.roomId || ""
                    )?.roomNumber || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Fee Type</td>
                  <td className="text-capitalize">
                    {receiptModal.data.fee.type}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted">Month</td>
                  <td>{receiptModal.data.fee.month}</td>
                </tr>
                <tr>
                  <td className="text-muted">Payment Method</td>
                  <td className="text-capitalize">
                    {receiptModal.data.payment.paymentMethod}
                  </td>
                </tr>
                <tr className="table-success">
                  <td className="text-muted fw-bold">Amount Paid</td>
                  <td className="fw-bold fs-5">
                    {formatCurrency(receiptModal.data.fee.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-center text-muted small mt-4">
              <p className="mb-1">Thank you for your payment!</p>
              <p>This is a computer-generated receipt.</p>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-4 d-print-none">
              <button
                className="btn btn-outline-secondary"
                onClick={receiptModal.closeModal}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                <Printer size={16} className="me-2" />
                Print Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
