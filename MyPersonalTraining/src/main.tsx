import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
} from "react-router-dom";
import Login from "./components/material-ui/login/Login";
import SideBar from "./components/sidebar/SideBar";
import SideBar2 from "./components/sidebar/SideBar2";
import HomePage from "./components/homepage/HomePage";
import { StrictMode } from "react";
import "./index.css";

const drawerWidth = 240;

// Wrapper to manage Conditional Sidebar
const Layout = () => {
  const location = useLocation(); // Get current route

  // If route is "/", do not show Sidebar
  const showSidebar = location.pathname !== "/";

  return (
    <>
      {showSidebar && <SideBar2></SideBar2>}
      <main style={{ marginLeft: drawerWidth, padding: "16px" }}>
        <Outlet />
      </main>
    </>
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
