import { useState, useEffect } from "react";
import { Users, LogOut, Home, Briefcase, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrowseInternships from "./BrowseInternships";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
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
      case "browse":
        return <BrowseInternships />;
      case "applications":
        return (
          <div className="text-center py-16 text-gray-600">
            <p>Ova sekcija će prikazivati vaše prijave.</p>
          </div>
        );
      default:
        return null;
    }
  };

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
          <TabButton
            label="Početna"
            icon={Home}
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
          />
          <TabButton
            label="Pretraži prakse"
            icon={Briefcase}
            active={activeTab === "browse"}
            onClick={() => setActiveTab("browse")}
          />
          <TabButton
            label="Moje prijave"
            icon={Mail}
            active={activeTab === "applications"}
            onClick={() => setActiveTab("applications")}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">{renderContent()}</div>
    </div>
  );
}

function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
        active
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
