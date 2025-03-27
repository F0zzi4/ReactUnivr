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
import { StrictMode, useState, useEffect } from "react";
import SessionManager from "./components/session/SessionManager";
import Me from "./components/customer/me/Me";
import Goals from "./components/customer/goals/Goals";
import CustomerTrainingPlan from "./components/customer/training-plan/TrainingPlan";
import PlanManagement from "./components/personaltrainer/plan-management/PlanManagement";
import Customers from "./components/personaltrainer/customers/Customers";
import Exercises from "./components/personaltrainer/exercises/Exercises";
import Inbox from "./components/inbox/Inbox";
import Outbox from "./components/outbox/Outbox";
import Customer from "./components/personaltrainer/customer/Customer";
import Exercise from "./components/personaltrainer/exercise/Exercise";
import TrainingPlan from "./components/personaltrainer/plan-management/TrainingPlan";
import "./main.css";
import ResetPassword from "./components/resetpassword/ResetPassword";

// Wrapper to manage conditional Sidebar
const Layout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // If path is "/", do not show the sidebar
  const showSidebar = location.pathname !== "/";

  return (
    // If user is logged in, show the main content with Sidebar
    user ? (
      <div className="flex h-screen maincontent-backgroundcolor">
        {/* Fixed sidebar */}
        {showSidebar && <SideBar open={open} setOpen={setOpen} />}
        <SessionManager />
        {/* Main content */}
        <main
          className={`main-content transition-all duration-300 ${
            showSidebar ? (open ? "ml-64" : "ml-20") : "ml-0"
          }`}
        >
          {/* Immagini di background fisse */}
          <img
            src="../gym1.png"
            alt="Gym Center"
            className="background-image fixed image-left object-cover"
            style={{ left: showSidebar ? (open ? "1rem" : "3rem") : "0" }}
          />
          <img
            src="../gym3.png"
            alt="Gym Right"
            className="background-image fixed image-right object-cover -z-10"
          />

          {/* Contenuto scrollabile */}
          <div className="relative z-0 h-full overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    ) : (
      <Navigate to="/" /> // If user is not logged, navigate to login page
    )
  );
};

// LoginWithRedirect for redirecting when user is already logged in
const LoginWithRedirect = () => {
  const location = useLocation();
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    if (user && location.pathname === "/") {
      window.location.replace("/inbox");
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
        {/* Route for reset password without authentication */}
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* Wrapper layout for sidebar */}
        <Route element={<Layout />}>
          {/* Customer Routes */}
          <Route path="/customer/me" element={<Me />} />
          <Route path="/customer/goals" element={<Goals />} />
          <Route
            path="/customer/training-plan"
            element={<CustomerTrainingPlan />}
          />
          <Route path="/inbox" element={<Inbox />} />
          {/* PersonalTrainer Routes */}
          <Route
            path="/personalTrainer/plan-management"
            element={<PlanManagement />}
          />
          <Route path="/personalTrainer/customers" element={<Customers />} />
          <Route path="/personalTrainer/exercises" element={<Exercises />} />
          <Route
            path="/personalTrainer/customers/customer"
            element={<Customer />}
          />
          <Route
            path="/personalTrainer/exercises/exercise"
            element={<Exercise />}
          />
          <Route
            path="/personalTrainer/plan-management/training-plan"
            element={<TrainingPlan />}
          />
          <Route path="/outbox" element={<Outbox />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
