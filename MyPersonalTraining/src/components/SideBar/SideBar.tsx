import React from "react";
import { Link } from "react-router-dom";
import { MdMenuOpen, MdOutlineDashboard, MdLogout } from "react-icons/md";
import { FaUserCircle, FaUsers } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { GoGoal } from "react-icons/go";
import { MdOutlineInbox, MdSend } from "react-icons/md";
import { signOut } from "firebase/auth";
import { Auth } from "../firebase/authentication/firebase-appconfig";
import "./SideBar.css";

// Sidebar component props: control visibility with `open`, and toggle it using `setOpen`
interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Menu items available to all users
  const menuItemsCommon = [
    {
      icon: <MdOutlineInbox size={30} />,
      label: "Inbox",
      path: "/inbox",
    },
    {
      icon: <MdSend size={30} />,
      label: "Outbox",
      path: "/outbox",
    },
  ];

  // Logs user out: clears session and reloads the page
  const handleLogout = async () => {
    await signOut(Auth);
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  // Conditional menu items based on user role
  const menuItemsCostum =
    user?.UserType === "Personal Trainer"
      ? [
          {
            icon: <AiOutlineFileText size={30} />,
            label: "Plan Management",
            path: "/personal-trainer/plan-management",
          },
          {
            icon: <FaUsers size={30} />,
            label: "Customers",
            path: "/personal-trainer/customers",
          },
          {
            icon: <MdOutlineDashboard size={30} />,
            label: "Exercises",
            path: "/personal-trainer/exercises",
          },
        ]
      : [
          {
            icon: <FaUsers size={30} />,
            label: "Me",
            path: "/customer/me",
          },
          {
            icon: <AiOutlineFileText size={30} />,
            label: "Training Plan",
            path: "/customer/training-plan",
          },
          {
            icon: <GoGoal size={30} />,
            label: "Goals",
            path: "/customer/goals",
          },
        ];

  return (
    <div className="flex">
      {/* Sidebar container with dynamic width based on `open` */}
      <nav
        className={`fixed top-0 left-0 h-screen sidebar-background sidebar-borders text-white shadow-xl transition-all duration-300 ${
          open ? "w-64" : "w-20"
        } flex flex-col overflow-hidden`}
      >
        {/* Sidebar header: user info and toggle button */}
        <div
          className={`flex items-center border-b border-white header-background ${
            open ? "justify-between px-3 py-4" : "justify-center"
          }`}
        >
          {/* User icon */}
          <div
            className={`transition-all duration-300 ${
              !open ? "w-0 opacity-0" : "flex items-center"
            }`}
          >
            <FaUserCircle size={40} className="w-8 h-8" />
          </div>

          {/* User name and type (if sidebar is open) */}
          <div
            className={`transition-all duration-300 ${
              !open
                ? "w-0 opacity-0 items-center justify-center"
                : "flex flex-col items-start"
            }`}
          >
            <p className="text-xl font-semibold">
              {user ? `${user.Name} ${user.Surname}` : "User"}
            </p>
            <span className="text-xs">{user?.UserType}</span>
          </div>

          {/* Sidebar toggle button */}
          <div
            className="flex items-center justify-center cursor-pointer hover:text-gray-300 hover:scale-110 transition-all z-50"
            onClick={() => setOpen(!open)}
          >
            <MdMenuOpen size={35} />
          </div>
        </div>

        {/* Common menu items */}
        <div className="flex-1 overflow-auto">
          <ul className="p-3">
            {menuItemsCommon.map((item, index) => (
              <li key={index} className="p-0">
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-green-800 hover:scale-105 transition-all group text-white no-underline ${
                    !open ? "justify-center" : "p-3"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {item.icon}
                  </div>
                  {/* Show label only if sidebar is open */}
                  <p
                    className={`transition-all duration-300 font-bold ${
                      !open ? "hidden" : "block text-lg"
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-white my-2"></div>

          {/* Conditional menu items based on user type */}
          <ul className="p-3">
            {menuItemsCostum.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-green-800 hover:scale-105 transition-all group text-white no-underline ${
                    !open ? "justify-center" : "p-3"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <p
                    className={`transition-all duration-300 font-bold ${
                      !open ? "hidden" : "block text-lg"
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-white my-2"></div>
        </div>

        {/* Logout button with hover effect */}
        <div className="p-3 mt-4">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 p-3 w-full rounded-md cursor-pointer transition-all text-white text-left ${
              !open ? "justify-center" : "p-3"
            }`}
            style={{
              backgroundColor: "rgb(207, 74, 74)",
              transition: "background-color 0.3s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgb(161, 34, 34)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgb(207, 74, 74)")
            }
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <MdLogout size={30} />
            </div>
            <p
              className={`transition-all duration-300 ${
                !open ? "hidden" : "block text-lg"
              }`}
            >
              <b>Logout</b>
            </p>
          </button>
        </div>
      </nav>
    </div>
  );
}