import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="d-flex">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarCollapsed ? "70px" : "250px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main
          style={{
            marginTop: "60px",
            minHeight: "calc(100vh - 60px)",
            backgroundColor: "#f8f9fa",
            padding: "20px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
