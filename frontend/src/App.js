import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import  LoginPage  from "./components/LoginPage";
import  RegisterPage  from "./components/RegisterPage";
import  CompanyDashboard  from "./components/CompanyDashboard";
import  StudentDashboard  from "./components/StudentDashboard";
import  FacultyDashboard  from "./components/FacultyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes - Company */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute allowedRoles={['COMPANY']}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - Student */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - Faculty */}
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute allowedRoles={['FACULTY']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;