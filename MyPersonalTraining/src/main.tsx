import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Outlet,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "./components/material-ui/login/Login";
import SideBar from "./components/sidebar/SideBar";
import HomePage from "./components/homepage/HomePage";
import { StrictMode, useEffect, useState } from "react";
import SessionManager from "./components/session/SessionManager";

// Wrapper to manage conditional Sidebar
const Layout = () => {
  const location = useLocation(); // Ottieni il percorso corrente
  const [open, setOpen] = useState(true); // Stato per tracciare apertura/chiusura della sidebar
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Se il percorso è "/", non mostrare la Sidebar
  const showSidebar = location.pathname !== "/";

  return user ? ( // check user logged
    <div className="flex h-screen maincontent-backgroundcolor">
      {/* Sidebar fissa */}
      {showSidebar && <SideBar open={open} setOpen={setOpen} />}
      <SessionManager />
      {/* Contenuto principale */}
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login non ha la Sidebar */}
        <Route path="/" element={<Login />} />

        {/* Wrapper Layout per la Sidebar */}
        <Route element={<Layout />}>
          <Route path="/homepage" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
