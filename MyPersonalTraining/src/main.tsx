import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom"; // Import corretto
import Login from "./components/materialUI/login/Login";
import "./index.css";
import SideBar from "./components/sidebar/SideBar";
import HomePage from "./components/homepage/HomePage";
import { StrictMode } from "react";

const drawerWidth = 240;

// Wrapper per gestire la Sidebar condizionale
const Layout = () => {
  const location = useLocation(); // Ottieni la route corrente

  // Se la route è "/", non renderizzare la Sidebar
  const showSidebar = location.pathname !== "/";

  return (
    <>
      {showSidebar && <SideBar />} {/* Mostra la Sidebar se non siamo sulla pagina di login */}
      <main style={{ marginLeft: drawerWidth, padding: "16px" }}>
        <Outlet /> {/* Rende il contenuto principale */}
      </main>
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <BrowserRouter>
    <Routes>
      {/* SignIn è la pagina di login e non avrà la Sidebar */}
      <Route path="/" element={<Login disableCustomTheme={false} />} />

      {/* Wrapper Layout per la Sidebar */}
      <Route element={<Layout />}>
        {/* HomePage sarà un child route, quindi viene renderizzato dentro il Layout */}
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<Login disableCustomTheme={false}/>} />
        {/* Aggiungi altre rotte qui se necessario */}
      </Route>
    </Routes>
  </BrowserRouter>
  </StrictMode>
);