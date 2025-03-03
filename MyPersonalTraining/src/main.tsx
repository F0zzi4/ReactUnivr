import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";
import Login from "./components/material-ui/login/Login";
import SideBar3 from "./components/sidebar/SideBar3";
import HomePage from "./components/homepage/HomePage";
import { StrictMode, useState } from "react";
import "./index.css";

// Wrapper to manage Conditional Sidebar
const Layout = () => {
  const location = useLocation(); // Get current route
  const [open, setOpen] = useState(true); // State to track sidebar open/close

  // If route is "/", do not show Sidebar
  const showSidebar = location.pathname !== "/";

  return (
    <div className="flex h-screen">
      {/* Sidebar fissa */}
      {showSidebar && <SideBar3 open={open} setOpen={setOpen} />}

      {/* Contenuto principale */}
      <main
        className={`transition-all duration-300 ${
          showSidebar ? (open ? "ml-60" : "ml-16") : "ml-0"
        } p-4 flex-1 overflow-auto`}
      >
        <Outlet />
      </main>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login does not have Sidebar */}
        <Route path="/" element={<Login />} />

        {/* Wrapper Layout for Sidebar */}
        <Route element={<Layout />}>
          <Route path="/homepage" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
