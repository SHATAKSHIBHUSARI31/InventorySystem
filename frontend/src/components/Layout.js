import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="h-16 w-full sticky top-0 z-50 bg-white shadow-md">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:block`}
        >
          <SideMenu />
        </div>

        {/* Mobile overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Outlet area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
