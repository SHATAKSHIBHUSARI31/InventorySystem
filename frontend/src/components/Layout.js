import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="h-16 w-full sticky top-0 z-50 bg-white shadow-md">
        <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>

      <div className="flex bg-gray-100 min-h-screen">
        {/* Side Menu: Visible on large screens, toggle on mobile */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:static lg:translate-x-0 lg:flex`}
        >
          <SideMenu />
        </div>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 mt-4 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
