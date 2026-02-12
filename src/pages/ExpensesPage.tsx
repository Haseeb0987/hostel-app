import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Trash2,
  Wallet,
  Zap,
  Wrench,
  ShoppingCart,
  Home,
  MoreHorizontal,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  DataTable,
  SearchInput,
  Pagination,
  Modal,
  ConfirmDialog,
  StatusBadge,
  ExportButtons,
  FormInput,
  DateRangePicker,
} from "../components/common";
import { usePagination, useSearchSort, useModal } from "../hooks";
import { Expense } from "../types";
import {
  expenses as initialExpenses,
  getExpenseCategoryTotals,
  getMonthlyExpenseTrend,
} from "../data/expenses";
import { expenseCategories } from "../data/settings";
import { formatCurrency, formatDate, formatMonthShort } from "../utils/helpers";

const categoryIcons: { [key: string]: React.ElementType } = {
  utility: Zap,
  maintenance: Wrench,
  salary: Wallet,
  mess: ShoppingCart,
  supplies: ShoppingCart,
  rent: Home,
  other: MoreHorizontal,
};

const categoryColors: { [key: string]: string } = {
  utility: "#0d6efd",
  maintenance: "#fd7e14",
  salary: "#20c997",
  mess: "#6f42c1",
  supplies: "#e83e8c",
  rent: "#17a2b8",
  other: "#6c757d",
};

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const addModal = useModal<Expense>();
  const deleteDialog = useModal<Expense>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Expense>>();

  const categoryTotals = getExpenseCategoryTotals();
  const monthlyTrend = getMonthlyExpenseTrend();

  // Get unique months
  const months = [...new Set(expenses.map((e) => e.date.substring(0, 7)))]
    .sort()
    .reverse();

  // Filter
  const filteredExpenses = useMemo(() => {
    let result = expenses;
    if (filterCategory !== "all") {
      result = result.filter((e) => e.category === filterCategory);
    }
    if (filterMonth !== "all") {
      result = result.filter((e) => e.date.startsWith(filterMonth));
    }
    if (startDate && endDate) {
      result = result.filter((e) => e.date >= startDate && e.date <= endDate);
    }
    return result;
  }, [expenses, filterCategory, filterMonth, startDate, endDate]);

  // Search and sort
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
  } = useSearchSort({
    data: filteredExpenses,
    searchFields: ["description", "paidTo", "category"],
  });

  // Pagination
  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: 10 });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Prepare chart data
  const pieChartData = Object.entries(categoryTotals).map(
    ([category, total]) => ({
      name: expenseCategories.find((c) => c.id === category)?.name || category,
      value: total,
      color: categoryColors[category] || "#6c757d",
    })
  );

  const barChartData = monthlyTrend.map((item) => ({
    month: formatMonthShort(item.month),
    total: item.total,
  }));

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const filteredTotal = filteredData.reduce((sum, e) => sum + e.amount, 0);

  const columns = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (item: Expense) => formatDate(item.date),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (item: Expense) => {
        const Icon = categoryIcons[item.category] || MoreHorizontal;
        const category = expenseCategories.find((c) => c.id === item.category);
        return (
          <div className="d-flex align-items-center">
            <div
              className="rounded p-1 me-2"
              style={{ backgroundColor: `${categoryColors[item.category]}20` }}
            >
              <Icon
                size={16}
                style={{ color: categoryColors[item.category] }}
              />
            </div>
            <div>
              <div className="small">{category?.name || item.category}</div>
              {item.subcategory && (
                <div className="text-muted small">{item.subcategory}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (item: Expense) => (
        <div style={{ maxWidth: "200px" }}>
          <div className="text-truncate">{item.description}</div>
        </div>
      ),
    },
    {
      key: "paidTo",
      label: "Paid To",
      sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (item: Expense) => (
        <span className="fw-medium text-danger">
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Method",
      render: (item: Expense) => (
        <span className="text-capitalize badge bg-light text-dark">
          {item.paymentMethod}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Expense) => (
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item);
            }}
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={(e) => {
              e.stopPropagation();
              deleteDialog.openModal(item);
            }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    reset(expense);
    addModal.openModal(expense);
  };

  const handleAdd = () => {
    setSelectedExpense(null);
    reset({
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
    });
    addModal.openModal();
  };

  const onSubmit = (data: Partial<Expense>) => {
    if (selectedExpense) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === selectedExpense.id ? ({ ...e, ...data } as Expense) : e
        )
      );
    } else {
      const newExpense: Expense = {
        ...data,
        id: `EXP${String(expenses.length + 1).padStart(3, "0")}`,
      } as Expense;
      setExpenses((prev) => [...prev, newExpense]);
    }
    addModal.closeModal();
    reset({});
  };

  const handleDelete = () => {
    if (deleteDialog.data) {
      setExpenses((prev) => prev.filter((e) => e.id !== deleteDialog.data!.id));
    }
  };

  const categoryOptions = expenseCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Expense Management</h4>
          <p className="text-muted mb-0">Track and manage hostel expenses</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} className="me-2" />
          Add Expense
        </button>
      </div>

      {/* Stats and Charts */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-3">Total Expenses (6 months)</h6>
              <h3 className="text-danger mb-3">
                {formatCurrency(totalExpenses)}
              </h3>
              <div className="row g-2">
                {Object.entries(categoryTotals)
                  .slice(0, 4)
                  .map(([cat, total]) => {
                    const category = expenseCategories.find(
                      (c) => c.id === cat
                    );
                    return (
                      <div key={cat} className="col-6">
                        <div className="d-flex align-items-center small">
                          <div
                            className="rounded-circle me-2"
                            style={{
                              width: 10,
                              height: 10,
                              backgroundColor: categoryColors[cat],
                            }}
                          />
                          <span className="text-muted">{category?.name}</span>
                        </div>
                        <div className="fw-medium small">
                          {formatCurrency(total)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-3">By Category</h6>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-3">Monthly Trend</h6>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" fontSize={10} />
                  <YAxis
                    fontSize={10}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Bar dataKey="total" fill="#dc3545" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search expenses..."
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-select-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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
                    {formatMonthShort(m)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>
            <div className="col-md-2 text-end">
              <ExportButtons data={filteredData} filename="expenses" />
            </div>
          </div>
          {(filterCategory !== "all" || filterMonth !== "all" || startDate) && (
            <div className="mt-2">
              <small className="text-muted">
                Filtered Total:{" "}
                <strong className="text-danger">
                  {formatCurrency(filteredTotal)}
                </strong>
                ({filteredData.length} records)
              </small>
            </div>
          )}
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
            emptyMessage="No expenses found"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        title={selectedExpense ? "Edit Expense" : "Add New Expense"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <FormInput
                label="Date"
                name="date"
                register={register}
                error={errors.date}
                required
                type="date"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Category"
                name="category"
                register={register}
                error={errors.category}
                required
                type="select"
                options={categoryOptions}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Subcategory (Optional)"
                name="subcategory"
                register={register}
                placeholder="e.g., electricity, plumbing"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Amount"
                name="amount"
                register={register}
                error={errors.amount}
                required
                type="number"
                placeholder="Enter amount"
              />
            </div>
            <div className="col-md-12">
              <FormInput
                label="Description"
                name="description"
                register={register}
                error={errors.description}
                required
                placeholder="Brief description of expense"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Paid To"
                name="paidTo"
                register={register}
                error={errors.paidTo}
                required
                placeholder="Vendor/Recipient name"
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
                label="Receipt Number (Optional)"
                name="receiptNumber"
                register={register}
                placeholder="Receipt/Bill number"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Approved By"
                name="approvedBy"
                register={register}
                type="select"
                options={[
                  { value: "E001", label: "Muhammad Aslam (Manager)" },
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
              onClick={addModal.closeModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedExpense ? "Update" : "Add"} Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.closeModal}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
