import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Eye,
  DoorOpen,
  Bed,
  Wifi,
  Wind,
  Bath,
  Users,
} from "lucide-react";
import {
  DataTable,
  SearchInput,
  Pagination,
  Modal,
  StatusBadge,
  ExportButtons,
  FormInput,
} from "../components/common";
import { usePagination, useSearchSort, useModal } from "../hooks";
import { Room } from "../types";
import { rooms as initialRooms, getOccupancyStats } from "../data/rooms";
import { residents, getResidentsByRoom } from "../data/residents";
import { formatCurrency } from "../utils/helpers";

export const RoomsPage: React.FC = () => {
  const [roomsList, setRoomsList] = useState<Room[]>(initialRooms);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFloor, setFilterFloor] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const addModal = useModal<Room>();
  const viewModal = useModal<Room>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Room>>();

  const occupancyStats = getOccupancyStats();

  // Filter
  const filteredRooms = useMemo(() => {
    let result = roomsList;
    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }
    if (filterFloor !== "all") {
      result = result.filter((r) => r.floor === parseInt(filterFloor));
    }
    return result;
  }, [roomsList, filterStatus, filterFloor]);

  // Search and sort
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
  } = useSearchSort({
    data: filteredRooms,
    searchFields: ["roomNumber", "type"],
  });

  // Pagination
  const { currentPage, totalPages, startIndex, endIndex, goToPage } =
    usePagination({ totalItems: filteredData.length, itemsPerPage: 10 });

  const paginatedData = filteredData.slice(startIndex, endIndex);

  const floors = [...new Set(roomsList.map((r) => r.floor))].sort();

  const columns = [
    {
      key: "roomNumber",
      label: "Room",
      sortable: true,
      render: (item: Room) => (
        <div className="d-flex align-items-center">
          <div
            className={`bg-${
              item.status === "available"
                ? "success"
                : item.status === "full"
                ? "danger"
                : "warning"
            } bg-opacity-10 p-2 rounded me-2`}
          >
            <DoorOpen
              size={20}
              className={`text-${
                item.status === "available"
                  ? "success"
                  : item.status === "full"
                  ? "danger"
                  : "warning"
              }`}
            />
          </div>
          <div>
            <div className="fw-medium">Room {item.roomNumber}</div>
            <small className="text-muted">Floor {item.floor}</small>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (item: Room) => (
        <span className="text-capitalize">{item.type}</span>
      ),
    },
    {
      key: "capacity",
      label: "Occupancy",
      sortable: true,
      render: (item: Room) => (
        <div>
          <div className="d-flex align-items-center mb-1">
            <Bed size={14} className="me-1 text-muted" />
            {item.occupiedBeds}/{item.capacity} beds
          </div>
          <div className="progress" style={{ height: "6px", width: "80px" }}>
            <div
              className={`progress-bar bg-${
                item.occupiedBeds === item.capacity
                  ? "danger"
                  : item.occupiedBeds > 0
                  ? "warning"
                  : "success"
              }`}
              style={{ width: `${(item.occupiedBeds / item.capacity) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "monthlyRent",
      label: "Rent",
      sortable: true,
      render: (item: Room) => (
        <div>
          <div className="fw-medium">{formatCurrency(item.monthlyRent)}</div>
          <small className="text-muted">per bed/month</small>
        </div>
      ),
    },
    {
      key: "amenities",
      label: "Amenities",
      render: (item: Room) => (
        <div className="d-flex gap-1">
          {item.hasAC && (
            <span className="badge bg-info bg-opacity-10 text-info" title="AC">
              <Wind size={12} />
            </span>
          )}
          {item.hasAttachedBath && (
            <span
              className="badge bg-primary bg-opacity-10 text-primary"
              title="Attached Bath"
            >
              <Bath size={12} />
            </span>
          )}
          <span
            className="badge bg-success bg-opacity-10 text-success"
            title="WiFi"
          >
            <Wifi size={12} />
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (item: Room) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Room) => (
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
        </div>
      ),
    },
  ];

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    reset(room);
    addModal.openModal(room);
  };

  const handleAdd = () => {
    setSelectedRoom(null);
    reset({});
    addModal.openModal();
  };

  const onSubmit = (data: Partial<Room>) => {
    if (selectedRoom) {
      setRoomsList((prev) =>
        prev.map((r) =>
          r.id === selectedRoom.id ? ({ ...r, ...data } as Room) : r
        )
      );
    } else {
      const newRoom: Room = {
        ...data,
        id: `RM${String(roomsList.length + 1).padStart(3, "0")}`,
        occupiedBeds: 0,
        status: "available",
        amenities: [],
      } as Room;
      setRoomsList((prev) => [...prev, newRoom]);
    }
    addModal.closeModal();
    reset({});
  };

  const typeOptions = [
    { value: "single", label: "Single (1 bed)" },
    { value: "double", label: "Double (2 beds)" },
    { value: "triple", label: "Triple (3 beds)" },
    { value: "quad", label: "Quad (4 beds)" },
    { value: "dormitory", label: "Dormitory (8 beds)" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Rooms Management</h4>
          <p className="text-muted mb-0">Manage rooms and bed allocation</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} className="me-2" />
          Add Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Total Rooms</div>
              <div className="fw-bold fs-4">{occupancyStats.totalRooms}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Total Beds</div>
              <div className="fw-bold fs-4">{occupancyStats.totalBeds}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Occupied Beds</div>
              <div className="fw-bold fs-4 text-success">
                {occupancyStats.occupiedBeds}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-muted small">Occupancy Rate</div>
              <div className="fw-bold fs-4 text-primary">
                {occupancyStats.occupancyRate}%
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
                placeholder="Search rooms..."
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="full">Full</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
              >
                <option value="all">All Floors</option>
                {floors.map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5 text-end">
              <ExportButtons data={filteredData} filename="rooms" />
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
            emptyMessage="No rooms found"
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
        title={selectedRoom ? "Edit Room" : "Add New Room"}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <FormInput
                label="Room Number"
                name="roomNumber"
                register={register}
                error={errors.roomNumber}
                required
                placeholder="101"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Floor"
                name="floor"
                register={register}
                error={errors.floor}
                required
                type="number"
                placeholder="1"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Room Type"
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
                label="Capacity"
                name="capacity"
                register={register}
                error={errors.capacity}
                required
                type="number"
                placeholder="2"
              />
            </div>
            <div className="col-md-6">
              <FormInput
                label="Monthly Rent (per bed)"
                name="monthlyRent"
                register={register}
                error={errors.monthlyRent}
                required
                type="number"
                placeholder="15000"
              />
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Amenities</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="hasAC"
                      {...register("hasAC")}
                    />
                    <label className="form-check-label" htmlFor="hasAC">
                      AC
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="hasAttachedBath"
                      {...register("hasAttachedBath")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="hasAttachedBath"
                    >
                      Attached Bath
                    </label>
                  </div>
                </div>
              </div>
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
              {selectedRoom ? "Update" : "Add"} Room
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.isOpen}
        onClose={viewModal.closeModal}
        title={`Room ${viewModal.data?.roomNumber} Details`}
        size="lg"
      >
        {viewModal.data && (
          <div>
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="text-muted mb-3">Room Information</h6>
                <table className="table table-sm table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{ width: "40%" }}>
                        Room Number:
                      </td>
                      <td className="fw-medium">{viewModal.data.roomNumber}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Floor:</td>
                      <td>{viewModal.data.floor}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Type:</td>
                      <td className="text-capitalize">{viewModal.data.type}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Capacity:</td>
                      <td>{viewModal.data.capacity} beds</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Monthly Rent:</td>
                      <td>{formatCurrency(viewModal.data.monthlyRent)}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Status:</td>
                      <td>
                        <StatusBadge status={viewModal.data.status} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted mb-3">Amenities</h6>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {viewModal.data.amenities.map((amenity, i) => (
                    <span key={i} className="badge bg-light text-dark">
                      {amenity}
                    </span>
                  ))}
                </div>

                <h6 className="text-muted mb-3">Occupancy</h6>
                <div className="progress mb-2" style={{ height: "20px" }}>
                  <div
                    className={`progress-bar bg-${
                      viewModal.data.occupiedBeds === viewModal.data.capacity
                        ? "danger"
                        : "success"
                    }`}
                    style={{
                      width: `${
                        (viewModal.data.occupiedBeds /
                          viewModal.data.capacity) *
                        100
                      }%`,
                    }}
                  >
                    {viewModal.data.occupiedBeds}/{viewModal.data.capacity} beds
                  </div>
                </div>
              </div>
            </div>

            <h6 className="text-muted mb-3">
              <Users size={16} className="me-2" />
              Current Residents
            </h6>
            {getResidentsByRoom(viewModal.data.id).length === 0 ? (
              <div className="alert alert-light text-center">
                No residents in this room
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Bed</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getResidentsByRoom(viewModal.data.id).map((resident) => (
                      <tr key={resident.id}>
                        <td>Bed {resident.bedNumber}</td>
                        <td>{resident.name}</td>
                        <td>{resident.phone}</td>
                        <td>{resident.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
