import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  UserPlus,
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
import { Resident } from "../types";
import {
  residents as initialResidents,
  getResidentById,
} from "../data/residents";
import { rooms, getRoomById } from "../data/rooms";
import {
  formatCurrency,
  formatDate,
  formatPhone,
  formatCNIC,
} from "../utils/helpers";

export const ResidentsPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null
  );

  const addModal = useModal<Resident>();
  const viewModal = useModal<Resident>();
  const deleteDialog = useModal<Resident>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Resident>>();

  // Filter by status
  const filteredByStatus = useMemo(() => {
    if (filterStatus === "all") return residents;
    return residents.filter((r) => r.status === filterStatus);
  }, [residents, filterStatus]);

  // Search and sort
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
  } = useSearchSort({
    data: filteredByStatus,
    searchFields: ["name", "fatherName", "phone", "cnic", "city", "occupation"],
  });

  // Pagination
  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: 10 });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const columns = [
    {
      key: "name",
      label: "Resident",
      sortable: true,
      render: (item: Resident) => (
        <div>
          <div className="fw-medium">{item.name}</div>
          <small className="text-muted">S/O {item.fatherName}</small>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (item: Resident) => (
        <div className="small">
          <div>{formatPhone(item.phone)}</div>
          {item.email && <div className="text-muted">{item.email}</div>}
        </div>
      ),
    },
    {
      key: "roomId",
      label: "Room",
      sortable: true,
      render: (item: Resident) => {
        const room = getRoomById(item.roomId);
        return (
          <div className="small">
            <div>Room {room?.roomNumber || "-"}</div>
            <div className="text-muted">Bed {item.bedNumber}</div>
          </div>
        );
      },
    },
    {
      key: "occupation",
      label: "Occupation",
      sortable: true,
      render: (item: Resident) => (
        <div className="small">
          <div>{item.occupation}</div>
          {item.workplace && <div className="text-muted">{item.workplace}</div>}
        </div>
      ),
    },
    {
      key: "monthlyRent",
      label: "Monthly Rent",
      sortable: true,
      render: (item: Resident) => formatCurrency(item.monthlyRent),
    },
    {
      key: "joinDate",
      label: "Join Date",
      sortable: true,
      render: (item: Resident) => formatDate(item.joinDate),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Resident) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Resident) => (
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

  const handleEdit = (resident: Resident) => {
    setSelectedResident(resident);
    reset(resident);
    addModal.openModal(resident);
  };

  const handleAdd = () => {
    setSelectedResident(null);
    reset({});
    addModal.openModal();
  };

  const onSubmit = (data: Partial<Resident>) => {
    if (selectedResident) {
      // Update
      setResidents((prev) =>
        prev.map((r) =>
          r.id === selectedResident.id ? ({ ...r, ...data } as Resident) : r
        )
      );
    } else {
      // Add new
      const newResident: Resident = {
        ...data,
        id: `R${String(residents.length + 1).padStart(3, "0")}`,
        status: "active",
        securityDeposit: Number(data.monthlyRent) * 2,
      } as Resident;
      setResidents((prev) => [...prev, newResident]);
    }
    addModal.closeModal();
    reset({});
  };

  const handleDelete = () => {
    if (deleteDialog.data) {
      setResidents((prev) =>
        prev.filter((r) => r.id !== deleteDialog.data!.id)
      );
    }
  };

  const roomOptions = rooms
    .filter((r) => r.status === "available" || r.occupiedBeds < r.capacity)
    .map((r) => ({
      value: r.id,
      label: `Room ${r.roomNumber} - ${r.type} (${
        r.capacity - r.occupiedBeds
      } beds available)`,
    }));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Residents Management</h4>
          <p className="text-muted mb-0">
            Manage hostel residents and their information
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <UserPlus size={18} className="me-2" />
          Add Resident
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Total Residents</div>
              <div className="fw-bold fs-4">{residents.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Active</div>
              <div className="fw-bold fs-4 text-success">
                {residents.filter((r) => r.status === "active").length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Inactive</div>
              <div className="fw-bold fs-4 text-warning">
                {residents.filter((r) => r.status === "inactive").length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Checked Out</div>
              <div className="fw-bold fs-4 text-secondary">
                {residents.filter((r) => r.status === "checkout").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search residents..."
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="checkout">Checked Out</option>
              </select>
            </div>
            <div className="col-md-5 text-end">
              <ExportButtons data={filteredData} filename="residents" />
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
            emptyMessage="No residents found"
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
        title={selectedResident ? "Edit Resident" : "Add New Resident"}
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
            <div className="col-md-6">
              <FormInput
                label="Email"
                name="email"
                register={register}
                type="email"
                placeholder="email@example.com"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Emergency Contact"
                name="emergencyContact"
                register={register}
                error={errors.emergencyContact}
                required
                placeholder="0321-1234567"
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
                label="City"
                name="city"
                register={register}
                error={errors.city}
                required
                placeholder="City name"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Occupation"
                name="occupation"
                register={register}
                error={errors.occupation}
                required
                placeholder="Job title"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Workplace"
                name="workplace"
                register={register}
                placeholder="Company/Organization"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Room"
                name="roomId"
                register={register}
                error={errors.roomId}
                required
                type="select"
                options={roomOptions}
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Bed Number"
                name="bedNumber"
                register={register}
                error={errors.bedNumber}
                required
                type="number"
                placeholder="1"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Monthly Rent"
                name="monthlyRent"
                register={register}
                error={errors.monthlyRent}
                required
                type="number"
                placeholder="15000"
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
              {selectedResident ? "Update" : "Add"} Resident
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        title="Resident Details"
        size="lg"
      >
        {viewModal.data && (
          <div>
            <div className="row mb-4">
              <div className="col-md-3 text-center">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 80, height: 80 }}
                >
                  <span className="fs-2 fw-bold text-primary">
                    {viewModal.data.name.charAt(0)}
                  </span>
                </div>
                <h5 className="mb-1">{viewModal.data.name}</h5>
                <p className="text-muted mb-2">
                  S/O {viewModal.data.fatherName}
                </p>
                <StatusBadge status={viewModal.data.status} />
              </div>
              <div className="col-md-9">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <Phone size={16} className="me-2" />
                      {formatPhone(viewModal.data.phone)}
                    </div>
                    {viewModal.data.email && (
                      <div className="d-flex align-items-center text-muted mb-2">
                        <Mail size={16} className="me-2" />
                        {viewModal.data.email}
                      </div>
                    )}
                    <div className="d-flex align-items-center text-muted mb-2">
                      <MapPin size={16} className="me-2" />
                      {viewModal.data.address}, {viewModal.data.city}
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <Briefcase size={16} className="me-2" />
                      {viewModal.data.occupation}
                      {viewModal.data.workplace &&
                        ` at ${viewModal.data.workplace}`}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">CNIC:</td>
                          <td>{formatCNIC(viewModal.data.cnic)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Room:</td>
                          <td>
                            Room{" "}
                            {getRoomById(viewModal.data.roomId)?.roomNumber},
                            Bed {viewModal.data.bedNumber}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Monthly Rent:</td>
                          <td>{formatCurrency(viewModal.data.monthlyRent)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Security Deposit:</td>
                          <td>
                            {formatCurrency(viewModal.data.securityDeposit)}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Join Date:</td>
                          <td>{formatDate(viewModal.data.joinDate)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Emergency Contact:</td>
                          <td>
                            {formatPhone(viewModal.data.emergencyContact)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {viewModal.data.notes && (
              <div className="alert alert-light">
                <strong>Notes:</strong> {viewModal.data.notes}
              </div>
            )}
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={viewModal.closeModal}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  viewModal.closeModal();
                  handleEdit(viewModal.data!);
                }}
              >
                Edit Resident
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.closeModal}
        onConfirm={handleDelete}
        title="Delete Resident"
        message={`Are you sure you want to delete ${deleteDialog.data?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};
