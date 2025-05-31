import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children, onLogout, username }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-800">
      <Header username={username} onLogout={onLogout} />
      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
