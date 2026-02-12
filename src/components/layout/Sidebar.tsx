import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  UserCog,
  Receipt,
  Wallet,
  UtensilsCrossed,
  BarChart3,
  Bell,
  Settings,
  Building2,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
}

const menuItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/residents", icon: Users, label: "Residents" },
  { path: "/rooms", icon: DoorOpen, label: "Rooms" },
  { path: "/employees", icon: UserCog, label: "Employees" },
  { path: "/fees", icon: Receipt, label: "Fee Management" },
  { path: "/expenses", icon: Wallet, label: "Expenses" },
  { path: "/mess", icon: UtensilsCrossed, label: "Mess" },
  { path: "/reports", icon: BarChart3, label: "Reports" },
  { path: "/notifications", icon: Bell, label: "Notifications" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <aside
      className={`sidebar bg-dark text-white ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? "70px" : "250px",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "width 0.3s ease",
        zIndex: 1000,
        overflowX: "hidden",
      }}
    >
      <div className="d-flex align-items-center justify-content-center py-3 border-bottom border-secondary">
        <Building2 size={28} className="text-primary" />
        {!isCollapsed && (
          <span className="ms-2 fw-bold text-white fs-5">Hostel MS</span>
        )}
      </div>

      <nav className="nav flex-column py-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center px-3 py-2 mx-2 rounded ${
                isActive ? "bg-primary text-white" : "text-white-50"
              }`
            }
            style={{ transition: "all 0.2s" }}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!isCollapsed && <span className="ms-3">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
