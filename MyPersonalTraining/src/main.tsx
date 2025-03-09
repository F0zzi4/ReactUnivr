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
import Me from "./components/costumer/me/Me";
import Goals from "./components/costumer/goals/Goals";
import TrainingPlan from "./components/costumer/trainingplan/TrainingPlan";
import PlanManagement from "./components/personaltrainer/plan-management/PlanManagement";
import Customers from "./components/personaltrainer/customers/Customers";
import Exercises from "./components/personaltrainer/exercises/Exercises";

// Wrapper to manage conditional Sidebar
const Layout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // If path is "/", do not show the sidebar
  const showSidebar = location.pathname !== "/";

  return user ? ( // Check if user is logged
    <div className="flex h-screen maincontent-backgroundcolor">
      {/* Fixed sidebar */}
      {showSidebar && <SideBar open={open} setOpen={setOpen} />}
      <SessionManager />
      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          showSidebar ? (open ? "ml-64" : "ml-20") : "ml-0"
        } flex-1 overflow-auto`}
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

          {/* Customer Routes */}
          <Route path="/customer/me" element={<Me />} />
          <Route path="/customer/goals" element={<Goals />} />
          <Route path="/customer/trainingPlan" element={<TrainingPlan />} />

          {/* PersonalTrainer Routes */}
          <Route
            path="/personalTrainer/planManagement"
            element={<PlanManagement />}
          />
          <Route path="/personalTrainer/customers" element={<Customers />} />
          <Route path="/personalTrainer/exercises" element={<Exercises />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);