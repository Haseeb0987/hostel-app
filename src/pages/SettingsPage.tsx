import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Settings,
  Building,
  Globe,
  Receipt,
  User,
  Bell,
  Shield,
  Save,
} from "lucide-react";
import { FormInput } from "../components/common";
import { SystemSettings, User as UserType } from "../types";
import {
  systemSettings as initialSettings,
  users,
  employeeRoles,
  paymentMethods,
} from "../data/settings";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "fees" | "users" | "notifications"
  >("general");
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [usersList] = useState<UserType[]>(users);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SystemSettings>({
    defaultValues: settings,
  });

  const onSubmit = (data: SystemSettings) => {
    setIsSaving(true);
    setTimeout(() => {
      setSettings(data);
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "fees", label: "Fee Settings", icon: Receipt },
    { id: "users", label: "Users", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Settings</h4>
          <p className="text-muted mb-0">Manage system configuration</p>
        </div>
      </div>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  >
                    <tab.icon size={18} className="me-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9">
          {activeTab === "general" && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0">
                  <Building size={20} className="me-2" />
                  General Settings
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        label="Hostel Name (English)"
                        name="hostelName"
                        register={register}
                        error={errors.hostelName}
                        required
                        placeholder="Al-Noor Boys Hostel"
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Hostel Name (Urdu)"
                        name="hostelNameUrdu"
                        register={register}
                        error={errors.hostelNameUrdu}
                        placeholder="النور بوائز ہاسٹل"
                      />
                    </div>
                    <div className="col-md-12">
                      <FormInput
                        label="Address"
                        name="address"
                        register={register}
                        error={errors.address}
                        required
                        placeholder="Full address"
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
                        error={errors.email}
                        type="email"
                        placeholder="info@hostel.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Currency"
                        name="currency"
                        register={register}
                        type="select"
                        options={[
                          { value: "PKR", label: "PKR - Pakistani Rupee" },
                        ]}
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Date Format"
                        name="dateFormat"
                        register={register}
                        type="select"
                        options={[
                          { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                          { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                          { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                        ]}
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Default Language"
                        name="language"
                        register={register}
                        type="select"
                        options={[
                          { value: "en", label: "English" },
                          { value: "ur", label: "Urdu (اردو)" },
                        ]}
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="me-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0">
                  <Receipt size={20} className="me-2" />
                  Fee Settings
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <FormInput
                        label="Fee Generation Day"
                        name="feeGenerationDay"
                        register={register}
                        type="number"
                        placeholder="1"
                      />
                      <small className="text-muted">
                        Day of month when fees are generated
                      </small>
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label="Late Fee Percentage"
                        name="lateFeePercentage"
                        register={register}
                        type="number"
                        placeholder="5"
                      />
                      <small className="text-muted">
                        Percentage charged for late payments
                      </small>
                    </div>
                    <div className="col-md-6 mt-3">
                      <FormInput
                        label="Security Deposit (Months)"
                        name="securityDepositMonths"
                        register={register}
                        type="number"
                        placeholder="2"
                      />
                      <small className="text-muted">
                        Number of months rent as security deposit
                      </small>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <h6 className="mb-3">Payment Methods</h6>
                  <div className="row">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="col-md-3">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`method-${method.id}`}
                            defaultChecked
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`method-${method.id}`}
                          >
                            {method.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSaving}
                    >
                      <Save size={18} className="me-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <User size={20} className="me-2" />
                  User Management
                </h5>
                <button className="btn btn-primary btn-sm">Add User</button>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Last Login</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{ width: 36, height: 36 }}
                            >
                              <span className="fw-bold text-primary">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="fw-medium">{user.name}</div>
                              <small className="text-muted">{user.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{user.username}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              user.role === "admin"
                                ? "danger"
                                : user.role === "manager"
                                ? "primary"
                                : "secondary"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              user.isActive ? "success" : "secondary"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary me-1">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0">
                  <Bell size={20} className="me-2" />
                  Notification Settings
                </h5>
              </div>
              <div className="card-body">
                <h6 className="mb-3">SMS Configuration</h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">SMS Provider</label>
                    <select className="form-select">
                      <option>Twilio</option>
                      <option>Nexmo</option>
                      <option>Local Provider</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">API Key</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <h6 className="mb-3">WhatsApp Configuration</h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">WhatsApp Business API</label>
                    <select className="form-select">
                      <option>Meta Business API</option>
                      <option>Third Party Service</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone Number ID"
                    />
                  </div>
                </div>

                <h6 className="mb-3">Automatic Reminders</h6>
                <div className="form-check form-switch mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="autoReminder"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="autoReminder">
                    Send automatic fee reminders
                  </label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="autoConfirm"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="autoConfirm">
                    Send payment confirmations
                  </label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="overdueAlert"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="overdueAlert">
                    Send overdue alerts
                  </label>
                </div>

                <hr className="my-4" />
                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary">
                    <Save size={18} className="me-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
