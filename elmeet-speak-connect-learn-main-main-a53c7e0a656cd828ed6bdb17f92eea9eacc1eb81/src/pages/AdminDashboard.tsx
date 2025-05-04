import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{ name: "Admin", picture: "/path/to/picture.jpg", email: "admin@example.com" }} onSignOut={() => console.log("Signed out")} />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>Admin Dashboard content goes here.</p>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
