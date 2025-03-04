import React from "react";
import { Outlet } from "react-router-dom";
import Admin_Navbar from "./Admin_Navbar";

const Admin_root = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Navbar */}
      <Admin_Navbar />

      {/* Main Content */}
      <main className="pt-12 flex-grow container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin_root;
