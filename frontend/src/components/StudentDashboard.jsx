import { useState, useEffect } from 'react';
import { Users, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080';

export default function StudentDashboard() {
  const [internships, setInternships] = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();

  useEffect(() => {
    fetchInternships();
    fetchAppliedInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/internships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        setInternships(result.data);
      } else {
        setInternships([]);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        // Extract internship.id from each application
        const internshipIds = result.data.map((app) => app.internship?.id);
        setApplied(internshipIds.filter(id => id !== undefined));
      } else {
        setApplied([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplied([]);
    }
  };

  const handleApply = async (internshipId) => {
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ internshipId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setApplied([...applied, internshipId]);
        alert(result.message || 'Uspešno ste se prijavili!');
      } else {
        alert(result.message || 'Greška pri prijavi.');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Greška pri prijavi. Pokušajte ponovo.');
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
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Student Dashboard</span>
            </div>
            <button onClick={logout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5" />
              Odjavi se
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dostupne prakse</h2>

        <div className="grid gap-4">
          {internships.map((internship) => (
            <div key={internship.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{internship.title}</h3>
                  <p className="text-gray-600 mb-3">{internship.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    {internship.requirements && (
                      <p>
                        <strong>Zahtevi:</strong> {internship.requirements}
                      </p>
                    )}
                    {internship.durationWeeks && (
                      <p>
                        <strong>Trajanje:</strong> {internship.durationWeeks} nedelja
                      </p>
                    )}
                    {internship.location && (
                      <p>
                        <strong>Lokacija:</strong> {internship.location}
                      </p>
                    )}
                    {internship.isPaid && internship.salary && (
                      <p>
                        <strong>Plata:</strong> {internship.salary} RSD
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleApply(internship.id)}
                  disabled={applied.includes(internship.id)}
                  className={`ml-4 px-6 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${
                    applied.includes(internship.id)
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  {applied.includes(internship.id) ? 'Prijavljeno' : 'Prijavi se'}
                </button>
              </div>
            </div>
          ))}
          {internships.length === 0 && (
            <p className="text-center text-gray-500 py-8">Trenutno nema dostupnih praksi.</p>
          )}
        </div>
      </div>
    </div>
  );
}