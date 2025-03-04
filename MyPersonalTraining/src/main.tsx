import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./components/material-ui/login/Login";
import SideBar from "./components/sidebar/SideBar";
import HomePage from "./components/homepage/HomePage";
import { StrictMode, useState, useEffect } from "react";
import SessionManager from "./components/session/SessionManager";

// Wrapper to manage conditional Sidebar
const Layout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  console.log(user);
  // If path is "/", do not show the sidebar
  const showSidebar = location.pathname !== "/";

  return user ? ( // Check if user is logged
    <div className="flex h-screen maincontent-backgroundcolor">
      {/* Fixed sidebar */}
      {showSidebar && <SideBar open={open} setOpen={setOpen} />}
      <SessionManager />
      {/* Main content */}
      <main
        style={{ backgroundColor: "rgb(206, 197, 197)" }}
        className={`transition-all duration-300 ${
          showSidebar ? (open ? "ml-60" : "ml-16") : "ml-0"
        } p-4 flex-1 overflow-auto`}
      >
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to={"/"} />
  );
};

// Redirect logic inside login component
const LoginWithRedirect = () => {
  const location = useLocation();
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (user && location.pathname === "/") {
      window.location.replace("/homepage");
    }
  }, [user, location.pathname]);

  return <Login />;
};

// Create the root only once
const container = document.getElementById("root");
const root = createRoot(container!);

// Render the root
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login with redirect logic */}
        <Route path="/" element={<LoginWithRedirect />} />

        {/* Wrapper layout for sidebar */}
        <Route element={<Layout />}>
          <Route path="/homepage" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);