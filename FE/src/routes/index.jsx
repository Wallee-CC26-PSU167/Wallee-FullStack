import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import ForgotPassword from "../pages/forgotPassword";
import ResetPassword from "../pages/resetPassword";
import Dashboard from "../pages/dashboard";
import Transaksi from "../pages/transaksi";
import Analitik from "../pages/analitik";
import Setting from "../pages/setting";
import AddTransaction from "../pages/addTransaction";
import ChangePassword from "../pages/changePassword";

import Layout from "../components/layout/layout";
import ProtectedRoute from "./protectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transaksi" element={<Transaksi />} />
        <Route path="add-transaction" element={<AddTransaction />} />
        <Route path="analitik" element={<Analitik />} />
        <Route path="settings" element={<Setting />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}