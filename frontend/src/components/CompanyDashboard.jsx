import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, LogOut, PlusCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    startDate: '',
    endDate: '',
    availablePositions: '',
  });
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async () => {
    console.log('Token:', token);
    console.log('Form data:', formData);
    
    if (!formData.title || !formData.description || !formData.startDate || 
        !formData.endDate || !formData.availablePositions) {
      setError('Sva obavezna polja moraju biti popunjena');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await fetch(`${API_URL}/internships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements || null,
          startDate: formData.startDate,
          endDate: formData.endDate,
          availablePositions: parseInt(formData.availablePositions),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Internship created:', result);
      
      setShowForm(false);
      setFormData({ 
        title: '', 
        description: '', 
        requirements: '', 
        startDate: '', 
        endDate: '', 
        availablePositions: '' 
      });
      setSuccess('Oglas za praksu je uspešno objavljen!');
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error creating internship:', error);
      setError('Greška pri kreiranju oglasa: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Kompanija Dashboard</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5" />
              Odjavi se
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Objavi praksu</h2>
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setError('');
                setSuccess('');
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <PlusCircle className="h-5 w-5" />
              Novi oglas
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {success}
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Kreiraj novi oglas za praksu</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naslov <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="npr. Frontend Developer Internship"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opis <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="4"
                  placeholder="Opišite praksu, šta će praktikant raditi..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum početka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datum završetka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Broj dostupnih pozicija <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.availablePositions}
                  onChange={(e) => setFormData({ ...formData, availablePositions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="npr. 5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zahtevi
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="3"
                  placeholder="Potrebne veštine i kvalifikacije..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Objavljivanje...' : 'Objavi'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                    setFormData({ 
                      title: '', 
                      description: '', 
                      requirements: '', 
                      startDate: '', 
                      endDate: '', 
                      availablePositions: '' 
                    });
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Otkaži
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Spremni da objavite praksu?
            </h3>
            <p className="text-gray-600 mb-6">
              Kliknite na dugme "Novi oglas" da kreirate oglas za praksu
            </p>
          </div>
        )}
      </div>
    </div>
  );
}