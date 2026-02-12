import React from "react";
import { Menu, Bell, User, LogOut, Globe, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<"en" | "ur">("en");

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ur" : "en"));
  };

  return (
    <header
      className="bg-white border-bottom shadow-sm"
      style={{
        position: "fixed",
        top: 0,
        left: isSidebarCollapsed ? "70px" : "250px",
        right: 0,
        height: "60px",
        zIndex: 999,
        transition: "left 0.3s ease",
      }}
    >
      <div className="d-flex justify-content-between align-items-center h-100 px-4">
        <button
          className="btn btn-link text-dark p-0"
          onClick={onToggleSidebar}
          title="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={toggleLanguage}
            title="Toggle Language"
          >
            <Globe size={16} />
            {language === "en" ? "English" : "اردو"}
          </button>

          <div className="dropdown">
            <button
              className="btn btn-link text-dark p-0 position-relative"
              data-bs-toggle="dropdown"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <h6 className="dropdown-header">Notifications</h6>
              </li>
              <li>
                <a className="dropdown-item small" href="#">
                  3 pending fee reminders
                </a>
              </li>
              <li>
                <a className="dropdown-item small" href="#">
                  2 maintenance requests
                </a>
              </li>
              <li>
                <a className="dropdown-item small" href="#">
                  1 new resident application
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item text-center small"
                  href="/notifications"
                >
                  View all
                </a>
              </li>
            </ul>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
              data-bs-toggle="dropdown"
            >
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <User size={18} />
              </div>
              <div className="text-start d-none d-md-block">
                <div className="small fw-semibold">Admin User</div>
                <div className="text-muted" style={{ fontSize: "11px" }}>
                  Administrator
                </div>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="/settings">
                  <User size={16} className="me-2" />
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/settings">
                  <Settings size={16} className="me-2" />
                  Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
