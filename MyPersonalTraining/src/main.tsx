import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from './components/materialUI/login/SignIn'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/signin" element={<SignIn disableCustomTheme={false} />} />
    </Routes>
  </BrowserRouter>
);