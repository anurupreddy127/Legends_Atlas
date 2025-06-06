// src/components/Navbar.jsx
import React from "react";
import logo from "../assets/logo.png"; // Adjust if path is different

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-slategrey/80 backdrop-blur-md shadow z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-edu-bold">Legends Atlas</h1>
        </div>
        <div className="space-x-4 font-playfair">
          <a href="#hero" className="hover:underline">
            Home
          </a>
          <a href="#stories" className="hover:underline">
            Stories
          </a>
          <a href="#author" className="hover:underline">
            Author
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
