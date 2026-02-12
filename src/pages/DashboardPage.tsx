import React from "react";
import {
  Users,
  DoorOpen,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { StatsCard, StatusBadge } from "../components/common";
import {
  formatCurrency,
  formatMonthShort,
  formatDateLong,
} from "../utils/helpers";
import { residents, getActiveResidents } from "../data/residents";
import { rooms, getOccupancyStats } from "../data/rooms";
import {
  feeTransactions,
  getMonthlyFeeStats,
  getTotalPendingAmount,
} from "../data/fees";
import { expenses, getMonthlyExpenseTrend } from "../data/expenses";

export const DashboardPage: React.FC = () => {
  const activeResidents = getActiveResidents();
  const occupancyStats = getOccupancyStats();
  const pendingAmount = getTotalPendingAmount();
  const monthlyFeeStats = getMonthlyFeeStats();
  const expenseTrend = getMonthlyExpenseTrend();

  // Calculate total revenue and expenses for last 6 months
  const totalRevenue = Object.values(monthlyFeeStats).reduce(
    (sum, m) => sum + m.collected,
    0
  );
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Monthly data for charts
  const monthlyData = Object.entries(monthlyFeeStats).map(([month, stats]) => ({
    month: formatMonthShort(month),
    revenue: stats.collected,
    expenses: expenseTrend.find((e) => e.month === month)?.total || 0,
    pending: stats.pending + stats.overdue,
  }));

  // Occupancy pie chart data
  const occupancyData = [
    { name: "Occupied", value: occupancyStats.occupiedBeds, color: "#0d6efd" },
    { name: "Vacant", value: occupancyStats.vacantBeds, color: "#6c757d" },
  ];

  // Fee status pie chart
  const feeStatusData = [
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

  // Recent activities
  const recentActivities = [
    {
      type: "payment",
      message: "Payment received from Ahmed Khan",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "success",
    },
    {
      type: "alert",
      message: "Rent overdue for Bilal Ahmed",
      time: "5 hours ago",
      icon: AlertTriangle,
      color: "danger",
    },
    {
      type: "resident",
      message: "New resident: Zubair Khan joined",
      time: "1 day ago",
      icon: Users,
      color: "primary",
    },
    {
      type: "expense",
      message: "Electricity bill paid - Rs. 75,000",
      time: "2 days ago",
      icon: Wallet,
      color: "info",
    },
    {
      type: "pending",
      message: "5 fee reminders sent",
      time: "3 days ago",
      icon: Clock,
      color: "warning",
    },
  ];

  // Overdue residents
  const overdueResidents = feeTransactions
    .filter((f) => f.status === "overdue" && f.type === "rent")
    .slice(0, 5)
    .map((f) => {
      const resident = residents.find((r) => r.id === f.residentId);
      return {
        ...f,
        residentName: resident?.name || "Unknown",
        roomNumber:
          rooms.find((r) => r.id === resident?.roomId)?.roomNumber || "-",
      };
    });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Dashboard</h4>
          <p className="text-muted mb-0">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-muted">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <StatsCard
            title="Total Residents"
            value={activeResidents.length}
            icon={Users}
            color="primary"
            trend={{ value: 5, isPositive: true }}
            subtitle={`${residents.length - activeResidents.length} inactive`}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatsCard
            title="Occupancy Rate"
            value={`${occupancyStats.occupancyRate}%`}
            icon={DoorOpen}
            color="success"
            subtitle={`${occupancyStats.vacantBeds} beds available`}
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={TrendingUp}
            color="info"
            trend={{ value: 12, isPositive: true }}
            subtitle="Last 6 months"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <StatsCard
            title="Pending Fees"
            value={formatCurrency(pendingAmount)}
            icon={Receipt}
            color="warning"
            subtitle={`${
              feeTransactions.filter((f) => f.status === "overdue").length
            } overdue`}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0">Revenue vs Expenses</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#0d6efd"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#dc3545"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0">Occupancy Status</h6>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0">Fee Collection Status</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={feeStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {feeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="d-flex justify-content-center gap-3 mt-2">
                {feeStatusData.map((item) => (
                  <div
                    key={item.name}
                    className="d-flex align-items-center small"
                  >
                    <div
                      className="rounded-circle me-1"
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: item.color,
                      }}
                    />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Overdue Payments</h6>
              <a href="/fees" className="small text-decoration-none">
                View all
              </a>
            </div>
            <div className="card-body p-0">
              {overdueResidents.length === 0 ? (
                <div className="text-center text-muted py-4">
                  No overdue payments
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {overdueResidents.map((item) => (
                    <div
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center py-2"
                    >
                      <div>
                        <div className="fw-medium small">
                          {item.residentName}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "11px" }}
                        >
                          Room {item.roomNumber} | Due:{" "}
                          {formatDateLong(item.dueDate)}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-medium text-danger small">
                          {formatCurrency(item.amount)}
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0">Recent Activity</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="list-group-item d-flex align-items-start py-2"
                  >
                    <div
                      className={`bg-${activity.color} bg-opacity-10 p-2 rounded me-3`}
                    >
                      <activity.icon
                        size={16}
                        className={`text-${activity.color}`}
                      />
                    </div>
                    <div>
                      <div className="small">{activity.message}</div>
                      <div className="text-muted" style={{ fontSize: "11px" }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center py-3">
            <div className="text-muted small">Total Rooms</div>
            <div className="fw-bold fs-4">{rooms.length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center py-3">
            <div className="text-muted small">This Month Revenue</div>
            <div className="fw-bold fs-4 text-success">
              {formatCurrency(monthlyFeeStats["2024-03"]?.collected || 0)}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center py-3">
            <div className="text-muted small">This Month Expenses</div>
            <div className="fw-bold fs-4 text-danger">
              {formatCurrency(
                expenseTrend.find((e) => e.month === "2024-03")?.total || 0
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center py-3">
            <div className="text-muted small">Net Income (6 months)</div>
            <div
              className={`fw-bold fs-4 ${
                totalRevenue - totalExpenses > 0
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              {formatCurrency(totalRevenue - totalExpenses)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
