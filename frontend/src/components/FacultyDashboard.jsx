import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [internshipsRes, applicationsRes] = await Promise.all([
        fetch(`${API_URL}/internships`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const internshipsData = await internshipsRes.json();
      const applicationsData = await applicationsRes.json();

      
      setInternships(Array.isArray(internshipsData) ? internshipsData : internshipsData.data || []);
      setApplications(Array.isArray(applicationsData) ? applicationsData : applicationsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setInternships([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Fakultet - Admin Pregled</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5" />
              Odjavi se
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistika */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ukupno praksi</h3>
            <p className="text-4xl font-bold text-indigo-600">{internships.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ukupno prijava</h3>
            <p className="text-4xl font-bold text-green-600">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aktivne kompanije</h3>
            <p className="text-4xl font-bold text-purple-600">
              {new Set(internships.map((i) => i.company?.id).filter(Boolean)).size}
            </p>
          </div>
        </div>

        {/* Sve prakse */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sve prakse</h2>
          <div className="space-y-3">
            {internships.map((internship) => (
              <div key={internship.id} className="border-b pb-3">
                <h3 className="font-semibold text-gray-900">{internship.title}</h3>
                <p className="text-sm text-gray-600">{internship.company?.companyName || 'N/A'}</p>
                <p className="text-xs text-gray-500">
                  Dostupno pozicija: {internship.availablePositions || 0}
                </p>
              </div>
            ))}
            {internships.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nema praksi</p>
            )}
          </div>
        </div>

        {/* Sve prijave */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sve prijave</h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="border-b pb-3">
                <p className="font-semibold text-gray-900">
                  {app.student?.firstName && app.student?.lastName
                    ? `${app.student.firstName} ${app.student.lastName}`
                    : app.student?.email || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">{app.internship?.title || 'N/A'}</p>
                <p className="text-xs text-gray-500">Status: {app.status || 'PENDING'}</p>
              </div>
            ))}
            {applications.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nema prijava</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
