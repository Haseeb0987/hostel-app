import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  UserCog,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  DataTable,
  SearchInput,
  Pagination,
  Modal,
  ConfirmDialog,
  StatusBadge,
  ExportButtons,
  FormInput,
} from "../components/common";
import { usePagination, useSearchSort, useModal } from "../hooks";
import { Employee, LeaveRecord, SalaryRecord } from "../types";
import {
  employees as initialEmployees,
  leaveRecords,
  salaryRecords,
  getEmployeeLeaves,
  getEmployeeSalaries,
  getTotalMonthlySalary,
} from "../data/employees";
import { employeeRoles } from "../data/settings";
import { formatCurrency, formatDate, formatPhone } from "../utils/helpers";

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"details" | "salary" | "leaves">(
    "details"
  );

  const addModal = useModal<Employee>();
  const viewModal = useModal<Employee>();
  const deleteDialog = useModal<Employee>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Employee>>();

  // Filter
  const filteredEmployees = useMemo(() => {
    let result = employees;
    if (filterRole !== "all") {
      result = result.filter((e) => e.role === filterRole);
    }
    if (filterStatus !== "all") {
      result = result.filter((e) => e.status === filterStatus);
    }
    return result;
  }, [employees, filterRole, filterStatus]);

  // Search and sort
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
  } = useSearchSort({
    data: filteredEmployees,
    searchFields: ["name", "phone", "role"],
  });

  // Pagination
  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: 10 });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const totalMonthlySalary = getTotalMonthlySalary();

  const columns = [
    {
      key: "name",
      label: "Employee",
      sortable: true,
      render: (item: Employee) => (
        <div className="d-flex align-items-center">
          <div
            className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: 36, height: 36 }}
          >
            <span className="fw-bold text-primary">{item.name.charAt(0)}</span>
          </div>
          <div>
            <div className="fw-medium">{item.name}</div>
            <small className="text-muted">S/O {item.fatherName}</small>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (item: Employee) => {
        const role = employeeRoles.find((r) => r.id === item.role);
        return (
          <span className="badge bg-secondary">{role?.name || item.role}</span>
        );
      },
    },
    {
      key: "phone",
      label: "Contact",
      render: (item: Employee) => formatPhone(item.phone),
    },
    {
      key: "salary",
      label: "Salary",
      sortable: true,
      render: (item: Employee) => formatCurrency(item.salary),
    },
    {
      key: "joinDate",
      label: "Join Date",
      sortable: true,
      render: (item: Employee) => formatDate(item.joinDate),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Employee) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Employee) => (
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleView(item);
            }}
            title="View"
          >
            <Eye size={14} />
          </button>
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

  const handleView = (employee: Employee) => {
    setActiveTab("details");
    viewModal.openModal(employee);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    reset(employee);
    addModal.openModal(employee);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    reset({});
    addModal.openModal();
  };

  const onSubmit = (data: Partial<Employee>) => {
    if (selectedEmployee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === selectedEmployee.id ? ({ ...e, ...data } as Employee) : e
        )
      );
    } else {
      const newEmployee: Employee = {
        ...data,
        id: `E${String(employees.length + 1).padStart(3, "0")}`,
        status: "active",
      } as Employee;
      setEmployees((prev) => [...prev, newEmployee]);
    }
    addModal.closeModal();
    reset({});
  };

  const handleDelete = () => {
    if (deleteDialog.data) {
      setEmployees((prev) =>
        prev.filter((e) => e.id !== deleteDialog.data!.id)
      );
    }
  };

  const roleOptions = employeeRoles.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const employeeSalaries = viewModal.data
    ? getEmployeeSalaries(viewModal.data.id)
    : [];
  const employeeLeaves = viewModal.data
    ? getEmployeeLeaves(viewModal.data.id)
    : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Employees Management</h4>
          <p className="text-muted mb-0">
            Manage staff, salaries, and leave records
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} className="me-2" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <UserCog size={24} className="text-primary mb-2" />
              <div className="text-muted small">Total Employees</div>
              <div className="fw-bold fs-4">{employees.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Clock size={24} className="text-success mb-2" />
              <div className="text-muted small">Active</div>
              <div className="fw-bold fs-4 text-success">
                {employees.filter((e) => e.status === "active").length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <DollarSign size={24} className="text-info mb-2" />
              <div className="text-muted small">Monthly Payroll</div>
              <div className="fw-bold fs-4 text-info">
                {formatCurrency(totalMonthlySalary)}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <Calendar size={24} className="text-warning mb-2" />
              <div className="text-muted small">Pending Leaves</div>
              <div className="fw-bold fs-4 text-warning">
                {leaveRecords.filter((l) => l.status === "pending").length}
              </div>
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
                placeholder="Search employees..."
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {employeeRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-5 text-end">
              <ExportButtons data={filteredData} filename="employees" />
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
            onRowClick={(item) => handleView(item)}
            emptyMessage="No employees found"
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
        title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <FormInput
                label="Full Name"
                name="name"
                register={register}
                error={errors.name}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Father's Name"
                name="fatherName"
                register={register}
                error={errors.fatherName}
                required
                placeholder="Enter father's name"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="CNIC"
                name="cnic"
                register={register}
                error={errors.cnic}
                required
                placeholder="35201-1234567-1"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Phone"
                name="phone"
                register={register}
                error={errors.phone}
                required
                placeholder="0300-1234567"
              />
            </div>
            <div className="col-md-12">
              <FormInput
                label="Address"
                name="address"
                register={register}
                error={errors.address}
                required
                placeholder="Enter full address"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Role"
                name="role"
                register={register}
                error={errors.role}
                required
                type="select"
                options={roleOptions}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Monthly Salary"
                name="salary"
                register={register}
                error={errors.salary}
                required
                type="number"
                placeholder="30000"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Join Date"
                name="joinDate"
                register={register}
                error={errors.joinDate}
                required
                type="date"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Bank Account (Optional)"
                name="bankAccount"
                register={register}
                placeholder="Bank-AccountNumber"
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
              {selectedEmployee ? "Update" : "Add"} Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal with Tabs */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        title="Employee Details"
        size="lg"
      >
        {viewModal.data && (
          <div>
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "details" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "salary" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("salary")}
                >
                  Salary History
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "leaves" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("leaves")}
                >
                  Leave Records
                </button>
              </li>
            </ul>

            {activeTab === "details" && (
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                    style={{ width: 80, height: 80 }}
                  >
                    <span className="fs-2 fw-bold text-primary">
                      {viewModal.data.name.charAt(0)}
                    </span>
                  </div>
                  <h5 className="mb-1">{viewModal.data.name}</h5>
                  <span className="badge bg-secondary">
                    {
                      employeeRoles.find((r) => r.id === viewModal.data!.role)
                        ?.name
                    }
                  </span>
                  <div className="mt-2">
                    <StatusBadge status={viewModal.data.status} />
                  </div>
                </div>
                <div className="col-md-8">
                  <table className="table table-sm table-borderless">
                    <tbody>
                      <tr>
                        <td className="text-muted">Father's Name:</td>
                        <td>{viewModal.data.fatherName}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">CNIC:</td>
                        <td>{viewModal.data.cnic}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Phone:</td>
                        <td>{formatPhone(viewModal.data.phone)}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Address:</td>
                        <td>{viewModal.data.address}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Salary:</td>
                        <td className="fw-bold text-success">
                          {formatCurrency(viewModal.data.salary)}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted">Join Date:</td>
                        <td>{formatDate(viewModal.data.joinDate)}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Bank Account:</td>
                        <td>{viewModal.data.bankAccount || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "salary" && (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Base Salary</th>
                      <th>Deductions</th>
                      <th>Bonus</th>
                      <th>Net Salary</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeSalaries.map((s) => (
                      <tr key={s.id}>
                        <td>{s.month}</td>
                        <td>{formatCurrency(s.baseSalary)}</td>
                        <td className="text-danger">
                          {s.deductions > 0
                            ? `-${formatCurrency(s.deductions)}`
                            : "-"}
                        </td>
                        <td className="text-success">
                          {s.bonus > 0 ? `+${formatCurrency(s.bonus)}` : "-"}
                        </td>
                        <td className="fw-bold">
                          {formatCurrency(s.netSalary)}
                        </td>
                        <td>
                          <StatusBadge status={s.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "leaves" && (
              <div className="table-responsive">
                {employeeLeaves.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    No leave records found
                  </div>
                ) : (
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeLeaves.map((l) => (
                        <tr key={l.id}>
                          <td>{formatDate(l.startDate)}</td>
                          <td>{formatDate(l.endDate)}</td>
                          <td className="text-capitalize">{l.type}</td>
                          <td>{l.reason}</td>
                          <td>
                            <StatusBadge status={l.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.closeModal}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteDialog.data?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
