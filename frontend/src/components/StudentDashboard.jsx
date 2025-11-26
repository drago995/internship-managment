import { Link, Routes, Route, Navigate } from "react-router-dom";
import { Users, LogOut, Home, Briefcase, Mail, Clipboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrowseInternships from "./BrowseInternships";
import StudentProfile from "./StudentProfile";
import InternshipDetails from "./IntenshipDetails";

export default function StudentDashboard() {
  const { logout } = useAuth(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-6">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Student Portal</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            <LogOut className="h-5 w-5" />
            Odjavi se
          </button>
        </div>
      </nav>

      {/* TABS */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex gap-4 px-6 py-3">
          <TabLink label="Početna" icon={Home} to="/student/dashboard" />
          <TabLink label="Pretraži prakse" icon={Briefcase} to="/student/dashboard/browse" />
          <TabLink label="Moje prijave" icon={Clipboard} to="/student/dashboard/applications" />
          <TabLink label="Profil" icon={Users} to="/student/dashboard/profile" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="browse" element={<BrowseInternships />} />
          <Route path="browse/:id" element={<InternshipDetails />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function TabLink({ label, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function HomePage() {
  return (
    <div className="text-center py-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Dobrodošli na Student Portal
      </h2>
      <p className="text-gray-600">
        Ovde možete pregledati dostupne prakse i pratiti svoje prijave.
      </p>
    </div>
  );
}

function ApplicationsPage() {
  return (
    <div className="text-center py-16 text-gray-600">
      <p>Ova sekcija će prikazivati vaše prijave.</p>
    </div>
  );
}
