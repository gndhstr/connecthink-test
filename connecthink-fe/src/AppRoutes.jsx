import React, { useState, useEffect } from "react";
import { 
    Routes, 
    Route, 
    useNavigate, 
    useLocation,
    Navigate,
  } from "react-router-dom";
import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/register";
import Class from "./pages/class/class";
import Dashboard from "./pages/dashboard/dashboard";
import Student from "./pages/student/student";
import Teacher from "./pages/teeacher/teacher";
import FloatingNav from "./components/navbar/navbar";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('auth_token');
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = ['/login', '/register'];
    const token = localStorage.getItem('auth_token');
    const authStatus = !!token;

    setIsAuthenticated(authStatus);

    if (!authStatus && !publicPaths.includes(location.pathname)) {
      navigate('/login', { replace: true });
    } else if (authStatus && publicPaths.includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <>
      <div className="pb-16">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : 
            <Login setIsAuthenticated={setIsAuthenticated} />
          } />
          
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" replace /> : 
            <Register />
          } />
          
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/class" element={isAuthenticated ? <Class /> : <Navigate to="/login" replace />} />
          <Route path="/student" element={isAuthenticated ? <Student /> : <Navigate to="/login" replace />} />
          <Route path="/teacher" element={isAuthenticated ? <Teacher /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>

      {isAuthenticated && <FloatingNav />}
    </>
  );
};

export default AppRoutes;