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
import { StrictMode, useState } from "react";
import SessionManager from "./components/session/SessionManager";
import Me from "./components/costumer/me/Me";
import Goals from "./components/costumer/goals/Goals";
import TrainingPlan from "./components/costumer/trainingplan/TrainingPlan";
import PlanManagement from "./components/personaltrainer/planmanagement/PlanManagement";
import Customers from "./components/personaltrainer/customers/Customers";
import Exercises from "./components/personaltrainer/exercises/Exercises";

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Login non ha la Sidebar */}
        <Route path="/" element={<Login />} />

        {/* Wrapper Layout per la Sidebar */}
        <Route element={<Layout />}>
          <Route path="/homepage" element={<HomePage />} />

          {/* Customers Routes */}
          <Route path="/customer/me" element={<Me />} />
          <Route path="/customer/goals" element={<Goals />} />
          <Route path="/customer/trainingPlan" element={<TrainingPlan />} />

          {/* PersonalTrainers Routes */}
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
