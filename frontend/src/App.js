import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import Layout from "./components/Layout";
import Labs from "./pages/Labs";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";

import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id && storedUser.role) {
  setUser(storedUser);
} else {
  setUser(null); // ensure invalid or corrupted data is cleared
  localStorage.removeItem("user");
}

    setLoader(false);
  }, []);

  const signin = (newUser, callback) => {
    setUser(newUser); // Save full user object
    localStorage.setItem("user", JSON.stringify(newUser));
    callback(); // Redirect to dashboard
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = { user, role: user?.role, signin, signout };

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />

          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase-details" element={<PurchaseDetails />} />
            <Route path="sales" element={<Sales />} />
            <Route
              path="manage-labs"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <Labs />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
