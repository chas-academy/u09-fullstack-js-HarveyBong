import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import axios from "axios";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { UserContextProvider, UserContext } from "../context/userContext";
import Dashboard from "./pages/Dashboard";
import Publish from "./pages/Publish";
import ProtectedRoute from "./components/ProtectedRoute";
import ItemDetails from "./components/ItemDetails";

import UserManagement from "./components/Admin/UserManagement";
import ItemManagement from "./components/Admin/ItemManagement";
import { useContext } from "react";
import AdminPage from "./components/Admin/AdminPage";
import Footer from "./components/Footer";

axios.defaults.baseURL = `${import.meta.env.VITE_RENDER_URL}`;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

function RequireAdmin({ children }: { children: JSX.Element }) {
  const userContext = useContext(UserContext);

  if (!userContext?.user || userContext.user.role !== "Admin") {
    return <Navigate to="/" />;
  }
  return children;
}
function App() {
  return (
    <>
      <UserContextProvider>
        <Navbar />
        <div className="pt-20 "></div>
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publish"
            element={
              <ProtectedRoute>
                <Publish />
              </ProtectedRoute>
            }
          />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route
            path="/admin/adminpage"
            element={
              <RequireAdmin>
                <AdminPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAdmin>
                <UserManagement />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/items"
            element={
              <RequireAdmin>
                <ItemManagement />
              </RequireAdmin>
            }
          />
        </Routes>

        <Footer />
      </UserContextProvider>
    </>
  );
}

export default App;
