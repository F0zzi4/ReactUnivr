import React from "react";
import { Link } from "react-router-dom";
import { MdMenuOpen, MdOutlineDashboard } from "react-icons/md";
import { FaUserCircle, FaUsers } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { GoGoal } from "react-icons/go";
import { MdOutlineInbox, MdSend } from "react-icons/md";
import "./SideBar.css";

// Sidebar Properties
interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const dataUser = sessionStorage.getItem("user");
  const user = dataUser ? JSON.parse(dataUser) : null;

  const menuItems = [
    {
      icon: <MdOutlineInbox size={24} />,
      label: "Inbox",
      path: "/inbox",
    },
    {
      icon: <MdSend size={24} />,
      label: "Outbox",
      path: "/outbox",
    },
  ];

  // Definizione dinamica di menuItems in base al tipo di utente
  const menuItemsCostum =
    user?.UserType === "Personal Trainer"
      ? [
          {
            icon: <AiOutlineFileText size={24} />,
            label: "Plan Management",
            path: "/planManagement",
          },
          {
            icon: <FaUsers size={24} />,
            label: "Customers",
            path: "/customers",
          },
          {
            icon: <MdOutlineDashboard size={24} />,
            label: "Exercises",
            path: "/exercises",
          },
        ]
      : [
          { icon: <FaUsers size={24} />, label: "Me", path: "/me" },
          {
            icon: <AiOutlineFileText size={24} />,
            label: "Training Plan",
            path: "/trainingPlan",
          },
          {
            icon: <GoGoal size={24} />,
            label: "Goals",
            path: "/goals",
          },
        ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-screen sidebar-background text-white shadow-lg transition-all duration-300 ${
          open ? "w-60" : "w-16"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white">
          {/* Icona del profilo utente */}
          <div
            className={`transition-all duration-300 ${
              !open ? "w-0 opacity-0 overflow-hidden" : "w-auto"
            }`}
            style={{ display: "flex", alignItems: "center" }} // Assicura che l'icona e il testo siano allineati
          >
            <FaUserCircle size={30} className="w-8 h-8 flex-shrink-0" />
          </div>

          {/* Dettagli utente */}
          <div
            className={`transition-all duration-300 ${
              !open ? "w-0 opacity-0 overflow-hidden" : "w-auto"
            }`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }} // Allinea verticalmente
          >
            <p>{user ? `${user.Name} ${user.Surname}` : "User"}</p>
            <span className="text-xs">{user ? user.UserType : "Guest"}</span>
          </div>

          {/* Pulsante per aprire/chiudere il menu */}
          <MdMenuOpen
            size={30}
            className="cursor-pointer hover:text-gray-300"
            onClick={() => setOpen(!open)} // Toggle sidebar state
          />
        </div>

        {/* Menu items */}
        <div className="flex-1">
          {/* Static sidebar items */}
          {/* Menu items */}
          <ul className="p-3">
            {menuItems.map((item, index) => (
              <li key={index} className="p-0">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-blue-800 transition-all group text-white no-underline ${
                    !open ? "justify-center" : "p-3"
                  }`}
                >
                  {/* Mantieni una dimensione fissa per l'icona */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {item.icon}
                  </div>
                  {/* Nascondi il testo senza ridimensionare l'icona */}
                  <p
                    className={`transition-all duration-300 ${
                      !open ? "hidden" : "block"
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Linea divisoria tra i due gruppi di menu */}
          <div className="border-t border-white"></div>

          {/* Costum sidebar items based on UserType */}
          {/* Menu items */}
          <ul className="p-3">
            {menuItemsCostum.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-blue-800 transition-all group text-white no-underline ${
                    !open ? "justify-center" : "p-3"
                  }`}
                >
                  {/* Mantieni una dimensione fissa per l'icona */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {item.icon}
                  </div>
                  {/* Nascondi il testo senza ridimensionare l'icona */}
                  <p
                    className={`transition-all duration-300 ${
                      !open ? "hidden" : "block"
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-white p-3 flex items-center gap-3">
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
