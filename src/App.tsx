import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MainLayout } from "./components/layout";
import {
  LoginPage,
  DashboardPage,
  ResidentsPage,
  RoomsPage,
  EmployeesPage,
  FeesPage,
  ExpensesPage,
  MessPage,
  ReportsPage,
  NotificationsPage,
  SettingsPage,
} from "./pages";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="fees" element={<FeesPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="mess" element={<MessPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
