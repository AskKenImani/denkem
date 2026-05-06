import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register.jsx';
import Dashboard from '../features/dashboard/Dashboard.jsx';
import BecomeTutor from '../features/auth/pages/BecomeTutor.jsx';
import ProtectedRoute from '../components/shared/ProtectedRoute.jsx';
import LandingPage from '../pages/LandingPage.jsx';


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="become-tutor" element={<BecomeTutor />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;