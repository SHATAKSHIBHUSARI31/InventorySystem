import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import Layout from "./components/Layout";
import Labs from "./pages/Labs"; // ✅ Renamed import
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";

import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);

  let myLoginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (myLoginUser) {
      setUser(myLoginUser._id);
      setLoader(false);
    } else {
      setUser("");
      setLoader(false);
    }
  }, [myLoginUser]);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = { user, signin, signout };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase-details" element={<PurchaseDetails />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/manage-labs" element={<Labs />} /> {/* ✅ Updated */}
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
