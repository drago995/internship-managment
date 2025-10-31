import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect ako je vec ulogovan
  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else if (user.role === 'COMPANY') {
        navigate('/company/dashboard', { replace: true });
      } else if (user.role === 'FACULTY') {
        navigate('/faculty/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    setError('');

    // ✅ Validacija
    if (!email || !password) {
      setError('Email i lozinka su obavezni');
      return;
    }

    setLoading(true);

    const result = await login({ email, password });

    if (result.success) {
      // ✅ Koristi userData iz rezultata
      const loggedUser = result.user;
      
      if (loggedUser.role === 'STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else if (loggedUser.role === 'COMPANY') {
        navigate('/company/dashboard', { replace: true });
      } else if (loggedUser.role === 'FACULTY') {
        navigate('/faculty/dashboard', { replace: true });
      }
    } else {
      setError(result.error || 'Neuspešna prijava');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Briefcase className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Internship Portal</h1>
          <p className="text-gray-600 mt-2">Prijavite se na vaš nalog</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="email@example.com"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Nemate nalog?{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="text-indigo-600 hover:underline font-medium"
            >
              Registrujte se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}