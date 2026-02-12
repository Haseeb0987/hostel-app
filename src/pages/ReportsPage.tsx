import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DoorOpen,
  Receipt,
  Wallet,
  Download,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ExportButtons, DateRangePicker } from "../components/common";
import { formatCurrency, formatMonthShort } from "../utils/helpers";
import { residents, getActiveResidents } from "../data/residents";
import { rooms, getOccupancyStats } from "../data/rooms";
import { feeTransactions, getMonthlyFeeStats } from "../data/fees";
import {
  expenses,
  getMonthlyExpenseTrend,
  getExpenseCategoryTotals,
} from "../data/expenses";
import { employees, getTotalMonthlySalary } from "../data/employees";
import { expenseCategories } from "../data/settings";

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<
    "financial" | "occupancy" | "fees" | "expenses"
  >("financial");
  const [startDate, setStartDate] = useState("2023-10-01");
  const [endDate, setEndDate] = useState("2024-03-31");

  const monthlyFeeStats = getMonthlyFeeStats();
  const expenseTrend = getMonthlyExpenseTrend();
  const occupancyStats = getOccupancyStats();
  const categoryTotals = getExpenseCategoryTotals();
  const activeResidents = getActiveResidents();
  const totalMonthlySalary = getTotalMonthlySalary();

  // Prepare financial data
  const financialData = Object.entries(monthlyFeeStats).map(
    ([month, stats]) => {
      const monthExpenses =
        expenseTrend.find((e) => e.month === month)?.total || 0;
      return {
        month: formatMonthShort(month),
        revenue: stats.collected,
        expenses: monthExpenses,
        profit: stats.collected - monthExpenses,
      };
    }
  );

  // Totals
  const totalRevenue = Object.values(monthlyFeeStats).reduce(
    (sum, m) => sum + m.collected,
    0
  );
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPending = Object.values(monthlyFeeStats).reduce(
    (sum, m) => sum + m.pending + m.overdue,
    0
  );
  const netProfit = totalRevenue - totalExpenses;

  // Occupancy data
  const occupancyData = rooms.reduce((acc, room) => {
    const existing = acc.find((a) => a.floor === `Floor ${room.floor}`);
    if (existing) {
      existing.total += room.capacity;
      existing.occupied += room.occupiedBeds;
    } else {
      acc.push({
        floor: `Floor ${room.floor}`,
        total: room.capacity,
        occupied: room.occupiedBeds,
      });
    }
    return acc;
  }, [] as { floor: string; total: number; occupied: number }[]);

  // Fee collection data
  const feeCollectionData = [
    {
      name: "Paid",
      value: feeTransactions.filter((f) => f.status === "paid").length,
      color: "#198754",
    },
    {
      name: "Pending",
      value: feeTransactions.filter((f) => f.status === "pending").length,
      color: "#ffc107",
    },
    {
      name: "Overdue",
      value: feeTransactions.filter((f) => f.status === "overdue").length,
      color: "#dc3545",
    },
  ];

  // Expense category data
  const expenseCategoryData = Object.entries(categoryTotals).map(
    ([cat, total]) => ({
      name: expenseCategories.find((c) => c.id === cat)?.name || cat,
      value: total,
    })
  );

  const COLORS = [
    "#0d6efd",
    "#198754",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#fd7e14",
    "#20c997",
  ];

  const generateReport = () => {
    alert(`Generating ${reportType} report for ${startDate} to ${endDate}...`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Reports</h4>
          <p className="text-muted mb-0">Financial and operational reports</p>
        </div>
        <div className="d-flex gap-2">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <button className="btn btn-primary" onClick={generateReport}>
            <Download size={18} className="me-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${reportType === "financial" ? "active" : ""}`}
            onClick={() => setReportType("financial")}
          >
            <TrendingUp size={16} className="me-1" />
            Financial
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${reportType === "occupancy" ? "active" : ""}`}
            onClick={() => setReportType("occupancy")}
          >
            <DoorOpen size={16} className="me-1" />
            Occupancy
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${reportType === "fees" ? "active" : ""}`}
            onClick={() => setReportType("fees")}
          >
            <Receipt size={16} className="me-1" />
            Fee Collection
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${reportType === "expenses" ? "active" : ""}`}
            onClick={() => setReportType("expenses")}
          >
            <Wallet size={16} className="me-1" />
            Expenses
          </button>
        </li>
      </ul>

      {/* Financial Report */}
      {reportType === "financial" && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm bg-success bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">Total Revenue</p>
                      <h4 className="text-success mb-0">
                        {formatCurrency(totalRevenue)}
                      </h4>
                    </div>
                    <TrendingUp className="text-success" size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm bg-danger bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">Total Expenses</p>
                      <h4 className="text-danger mb-0">
                        {formatCurrency(totalExpenses)}
                      </h4>
                    </div>
                    <TrendingDown className="text-danger" size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">Pending Fees</p>
                      <h4 className="text-warning mb-0">
                        {formatCurrency(totalPending)}
                      </h4>
                    </div>
                    <Receipt className="text-warning" size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className={`card border-0 shadow-sm ${
                  netProfit >= 0 ? "bg-primary" : "bg-danger"
                } bg-opacity-10`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="text-muted small mb-1">Net Profit</p>
                      <h4
                        className={
                          netProfit >= 0 ? "text-primary" : "text-danger"
                        }
                        style={{ marginBottom: 0 }}
                      >
                        {formatCurrency(netProfit)}
                      </h4>
                    </div>
                    <BarChart3
                      className={
                        netProfit >= 0 ? "text-primary" : "text-danger"
                      }
                      size={24}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Revenue vs Expenses (Monthly)</h6>
              <ExportButtons data={financialData} filename="financial-report" />
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#198754"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#dc3545"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="profit"
                    name="Profit"
                    fill="#0d6efd"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0">Monthly Breakdown</h6>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="text-end">Revenue</th>
                    <th className="text-end">Expenses</th>
                    <th className="text-end">Profit</th>
                    <th className="text-end">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {financialData.map((row, i) => (
                    <tr key={i}>
                      <td>{row.month}</td>
                      <td className="text-end text-success">
                        {formatCurrency(row.revenue)}
                      </td>
                      <td className="text-end text-danger">
                        {formatCurrency(row.expenses)}
                      </td>
                      <td
                        className={`text-end ${
                          row.profit >= 0 ? "text-primary" : "text-danger"
                        }`}
                      >
                        {formatCurrency(row.profit)}
                      </td>
                      <td className="text-end">
                        {row.revenue > 0
                          ? `${((row.profit / row.revenue) * 100).toFixed(1)}%`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  <tr className="table-dark">
                    <td className="fw-bold">Total</td>
                    <td className="text-end fw-bold text-success">
                      {formatCurrency(totalRevenue)}
                    </td>
                    <td className="text-end fw-bold text-danger">
                      {formatCurrency(totalExpenses)}
                    </td>
                    <td
                      className={`text-end fw-bold ${
                        netProfit >= 0 ? "text-info" : "text-danger"
                      }`}
                    >
                      {formatCurrency(netProfit)}
                    </td>
                    <td className="text-end fw-bold">
                      {totalRevenue > 0
                        ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%`
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Occupancy Report */}
      {reportType === "occupancy" && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <DoorOpen size={24} className="text-primary mb-2" />
                  <p className="text-muted small mb-1">Total Rooms</p>
                  <h4>{occupancyStats.totalRooms}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <Users size={24} className="text-success mb-2" />
                  <p className="text-muted small mb-1">Total Beds</p>
                  <h4>{occupancyStats.totalBeds}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <Users size={24} className="text-info mb-2" />
                  <p className="text-muted small mb-1">Occupied</p>
                  <h4>{occupancyStats.occupiedBeds}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center">
                  <BarChart3 size={24} className="text-warning mb-2" />
                  <p className="text-muted small mb-1">Occupancy Rate</p>
                  <h4>{occupancyStats.occupancyRate}%</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0">Floor-wise Occupancy</h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={occupancyData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="floor" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="occupied" name="Occupied" fill="#0d6efd" />
                      <Bar
                        dataKey="total"
                        name="Total Capacity"
                        fill="#e9ecef"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0">Room Status</h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Available Rooms</span>
                      <strong className="text-success">
                        {rooms.filter((r) => r.status === "available").length}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Full Rooms</span>
                      <strong className="text-danger">
                        {rooms.filter((r) => r.status === "full").length}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Under Maintenance</span>
                      <strong className="text-warning">
                        {rooms.filter((r) => r.status === "maintenance").length}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fee Collection Report */}
      {reportType === "fees" && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0">Fee Status Distribution</h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={feeCollectionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                        }
                      >
                        {feeCollectionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0">Collection Trend</h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={Object.entries(monthlyFeeStats).map(
                        ([month, stats]) => ({
                          month: formatMonthShort(month),
                          collected: stats.collected,
                          pending: stats.pending + stats.overdue,
                        })
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="collected"
                        name="Collected"
                        stroke="#198754"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="pending"
                        name="Pending"
                        stroke="#ffc107"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Expenses Report */}
      {reportType === "expenses" && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0">Expense by Category</h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                        }
                      >
                        {expenseCategoryData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
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
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0">Category Breakdown</h6>
                </div>
                <div className="card-body p-0">
                  <table className="table table-striped mb-0">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenseCategoryData.map((cat, i) => (
                        <tr key={i}>
                          <td>{cat.name}</td>
                          <td className="text-end">
                            {formatCurrency(cat.value)}
                          </td>
                          <td className="text-end">
                            {((cat.value / totalExpenses) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                      <tr className="table-dark">
                        <td className="fw-bold">Total</td>
                        <td className="text-end fw-bold">
                          {formatCurrency(totalExpenses)}
                        </td>
                        <td className="text-end fw-bold">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
