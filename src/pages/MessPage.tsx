import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  UtensilsCrossed,
  ShoppingBasket,
  Beef,
  Milk,
  Flame,
  Users,
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
  Legend,
} from "recharts";
import {
  DataTable,
  SearchInput,
  Pagination,
  Modal,
  ExportButtons,
  FormInput,
} from "../components/common";
import { usePagination, useSearchSort, useModal } from "../hooks";
import { MessExpense } from "../types";
import {
  messExpenses as initialExpenses,
  messMembers,
  getMessCategoryTotals,
  getTotalMessExpensesByMonth,
  getActiveMessMembers,
} from "../data/mess";
import { employees, getEmployeeById } from "../data/employees";
import { residents, getResidentById } from "../data/residents";
import { formatCurrency, formatDate, formatMonthShort } from "../utils/helpers";

const categoryIcons: { [key: string]: React.ElementType } = {
  grocery: ShoppingBasket,
  vegetables: UtensilsCrossed,
  meat: Beef,
  dairy: Milk,
  gas: Flame,
  other: UtensilsCrossed,
};

const categoryColors: { [key: string]: string } = {
  grocery: "#0d6efd",
  vegetables: "#198754",
  meat: "#dc3545",
  dairy: "#ffc107",
  gas: "#fd7e14",
  other: "#6c757d",
};

export const MessPage: React.FC = () => {
  const [expenses, setExpenses] = useState<MessExpense[]>(initialExpenses);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"expenses" | "members">(
    "expenses"
  );

  const addModal = useModal<MessExpense>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<MessExpense>>();

  const categoryTotals = getMessCategoryTotals();
  const activeMembers = getActiveMessMembers();

  // Get unique months
  const months = [...new Set(expenses.map((e) => e.date.substring(0, 7)))]
    .sort()
    .reverse();

  // Monthly expense data for chart
  const monthlyData = months.map((month) => ({
    month: formatMonthShort(month),
    total: getTotalMessExpensesByMonth(month),
    ...Object.fromEntries(
      Object.keys(categoryColors).map((cat) => [
        cat,
        expenses
          .filter((e) => e.date.startsWith(month) && e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0),
      ])
    ),
  }));

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    let result = expenses;
    if (filterCategory !== "all") {
      result = result.filter((e) => e.category === filterCategory);
    }
    if (filterMonth !== "all") {
      result = result.filter((e) => e.date.startsWith(filterMonth));
    }
    return result;
  }, [expenses, filterCategory, filterMonth]);

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
    searchFields: ["description", "vendor"],
  });

  // Pagination
  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: 15 });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Pie chart data
  const pieChartData = Object.entries(categoryTotals).map(
    ([category, total]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: total,
      color: categoryColors[category] || "#6c757d",
    })
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perHeadCost =
    activeMembers.length > 0
      ? Math.round(totalExpenses / activeMembers.length / 6)
      : 0;

  const expenseColumns = [
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (item: MessExpense) => formatDate(item.date),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (item: MessExpense) => {
        const Icon = categoryIcons[item.category] || UtensilsCrossed;
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
            <span className="text-capitalize">{item.category}</span>
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (item: MessExpense) => (
        <span className="fw-medium">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: "vendor",
      label: "Vendor",
      sortable: true,
    },
    {
      key: "paidBy",
      label: "Paid By",
      render: (item: MessExpense) => {
        const employee = getEmployeeById(item.paidBy);
        return employee?.name || item.paidBy;
      },
    },
  ];

  const handleAdd = () => {
    reset({ date: new Date().toISOString().split("T")[0] });
    addModal.openModal();
  };

  const onSubmit = (data: Partial<MessExpense>) => {
    const newExpense: MessExpense = {
      ...data,
      id: `MESS${String(expenses.length + 1).padStart(3, "0")}`,
    } as MessExpense;
    setExpenses((prev) => [newExpense, ...prev]);
    addModal.closeModal();
    reset({});
  };

  const categoryOptions = Object.keys(categoryColors).map((c) => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1),
  }));

  const cookOptions = employees
    .filter((e) => e.role === "cook")
    .map((e) => ({ value: e.id, label: e.name }));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Mess Management</h4>
          <p className="text-muted mb-0">Track mess expenses and members</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} className="me-2" />
          Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <UtensilsCrossed size={24} className="text-primary mb-2" />
              <div className="text-muted small">Total Expenses (6 mo)</div>
              <div className="fw-bold fs-4">
                {formatCurrency(totalExpenses)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Users size={24} className="text-success mb-2" />
              <div className="text-muted small">Active Members</div>
              <div className="fw-bold fs-4">{activeMembers.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <ShoppingBasket size={24} className="text-info mb-2" />
              <div className="text-muted small">Avg. Monthly Expense</div>
              <div className="fw-bold fs-4">
                {formatCurrency(totalExpenses / 6)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Beef size={24} className="text-danger mb-2" />
              <div className="text-muted small">Per Head (Monthly)</div>
              <div className="fw-bold fs-4">{formatCurrency(perHeadCost)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0">Expense Breakdown</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
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
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0">Monthly Expense Trend</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar
                    dataKey="grocery"
                    name="Grocery"
                    stackId="a"
                    fill={categoryColors.grocery}
                  />
                  <Bar
                    dataKey="vegetables"
                    name="Vegetables"
                    stackId="a"
                    fill={categoryColors.vegetables}
                  />
                  <Bar
                    dataKey="meat"
                    name="Meat"
                    stackId="a"
                    fill={categoryColors.meat}
                  />
                  <Bar
                    dataKey="dairy"
                    name="Dairy"
                    stackId="a"
                    fill={categoryColors.dairy}
                  />
                  <Bar
                    dataKey="gas"
                    name="Gas"
                    stackId="a"
                    fill={categoryColors.gas}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            Expenses
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Members ({activeMembers.length})
          </button>
        </li>
      </ul>

      {activeTab === "expenses" && (
        <>
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
                    {Object.keys(categoryColors).map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
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
                <div className="col-md-5 text-end">
                  <ExportButtons data={filteredData} filename="mess-expenses" />
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <DataTable
                columns={expenseColumns}
                data={paginatedData}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                emptyMessage="No mess expenses found"
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

      {activeTab === "members" && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Resident</th>
                  <th>Room</th>
                  <th>Meal Type</th>
                  <th>Join Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {messMembers.map((member) => {
                  const resident = getResidentById(member.residentId);
                  return (
                    <tr key={member.id}>
                      <td className="fw-medium">
                        {resident?.name || "Unknown"}
                      </td>
                      <td>{resident?.roomId || "-"}</td>
                      <td className="text-capitalize">{member.mealType}</td>
                      <td>{formatDate(member.joinDate)}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            member.status === "active" ? "success" : "secondary"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal
        isOpen={addModal.isOpen}
        onClose={addModal.closeModal}
        title="Add Mess Expense"
        size="md"
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
            <div className="col-md-12">
              <FormInput
                label="Description"
                name="description"
                register={register}
                error={errors.description}
                required
                placeholder="e.g., Rice 50kg, Chicken 20kg"
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
            <div className="col-md-6">
              <FormInput
                label="Vendor"
                name="vendor"
                register={register}
                error={errors.vendor}
                required
                placeholder="Vendor name"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Paid By"
                name="paidBy"
                register={register}
                error={errors.paidBy}
                required
                type="select"
                options={cookOptions}
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
              Add Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
