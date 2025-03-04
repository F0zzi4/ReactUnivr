import React, { useState } from "react";
import logo from "../../assets/logo/logo32x32.png";
import { MdMenuOpen, MdOutlineDashboard } from "react-icons/md";
import { IoHomeOutline, IoLogoBuffer } from "react-icons/io5";
import { FaProductHunt, FaUserCircle } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";

const menuItems = [
  { icon: <IoHomeOutline size={24} />, label: "Home" },
  { icon: <FaProductHunt size={24} />, label: "Products" },
  { icon: <MdOutlineDashboard size={24} />, label: "Dashboard" },
  { icon: <CiSettings size={24} />, label: "Settings" },
  { icon: <IoLogoBuffer size={24} />, label: "Log" },
  { icon: <TbReportSearch size={24} />, label: "Report" },
];

// Definisci il tipo delle props per Sidebar
interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const dataUser = sessionStorage.getItem("user");
  const user = dataUser ? JSON.parse(dataUser) : null;

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-screen bg-blue-600 text-white shadow-lg transition-all duration-300 ${
          open ? "w-60" : "w-16"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${
              open ? "w-10" : "w-0 opacity-0"
            }`}
          />
          <MdMenuOpen
            size={30}
            className="cursor-pointer hover:text-gray-300"
            onClick={() => setOpen(!open)} // Toggle sidebar state
          />
        </div>

        {/* Body */}
        <ul className="flex-1 p-3">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-blue-800 transition-all group"
            >
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <p
                className={`transition-all duration-300 ${
                  !open ? "w-0 opacity-0 overflow-hidden" : "w-auto"
                }`}
              >
                {item.label}
              </p>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="p-3 flex items-center gap-3 border-t border-white">
          <FaUserCircle size={30} className="w-8 h-8 flex-shrink-0" />
          <div
            className={`transition-all duration-300 ${
              !open ? "w-0 opacity-0 overflow-hidden" : "w-auto"
            }`}
          >
            <p>{user ? `${user.Name} ${user.Surname}` : "User"}</p>
            <span className="text-xs">{user ? user.UserType : "Guest"}</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
