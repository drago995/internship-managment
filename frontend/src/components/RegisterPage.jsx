import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Users } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    role: 'STUDENT',

    // Common fields
    email: '',
    password: '',
    confirmPassword: '',

    // Student-specific
    firstName: '',
    lastName: '',
    indexNumber: '',
    faculty: '',
    phoneNumber: '',
    studyYear: '',
    bio: '',

    // Company-specific
    companyName: '',
    pib: '',
    address: '',
    contactPerson: '',
    companyPhone: '',
    description: '',
    website: '',
    companySize: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Email i lozinka su obavezni');
      return;
    }

    setLoading(true);

    let registerData = {};
    if (formData.role === 'STUDENT') {
      registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        indexNumber: formData.indexNumber,
        faculty: formData.faculty,
        phoneNumber: formData.phoneNumber,
        studyYear: formData.studyYear,
        bio: formData.bio,
      };
    } else {
      registerData = {
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        pib: formData.pib,
        address: formData.address,
        contactPerson: formData.contactPerson,
        phoneNumber: formData.companyPhone,
        description: formData.description,
        website: formData.website,
        companySize: formData.companySize,
      };
    }

    const result = await register(registerData, formData.role); // <- pass role to API call
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Users className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Registracija</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Uspešna registracija! Preusmeravanje na login...
          </div>
        )}

        <div className="space-y-4">
          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tip naloga</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="STUDENT">Student</option>
              <option value="COMPANY">Kompanija</option>
            </select>
          </div>

          {/* Student form */}
          {formData.role === 'STUDENT' && (
            <>
              <Input name="firstName" label="Ime" value={formData.firstName} onChange={handleChange} />
              <Input name="lastName" label="Prezime" value={formData.lastName} onChange={handleChange} />
              <Input name="indexNumber" label="Broj indeksa" value={formData.indexNumber} onChange={handleChange} />
              <Input name="faculty" label="Fakultet" value={formData.faculty} onChange={handleChange} />
              <Input name="phoneNumber" label="Telefon" value={formData.phoneNumber} onChange={handleChange} />
              <Input name="studyYear" label="Godina studija" value={formData.studyYear} onChange={handleChange} />
              <Input name="bio" label="Kratka biografija" value={formData.bio} onChange={handleChange} />
            </>
          )}

          {/* Company form */}
          {formData.role === 'COMPANY' && (
            <>
              <Input name="companyName" label="Naziv kompanije" value={formData.companyName} onChange={handleChange} />
              <Input name="pib" label="PIB" value={formData.pib} onChange={handleChange} />
              <Input name="address" label="Adresa" value={formData.address} onChange={handleChange} />
              <Input name="contactPerson" label="Kontakt osoba" value={formData.contactPerson} onChange={handleChange} />
              <Input name="companyPhone" label="Telefon" value={formData.companyPhone} onChange={handleChange} />
              <Input name="description" label="Opis" value={formData.description} onChange={handleChange} />
              <Input name="website" label="Website" value={formData.website} onChange={handleChange} />
              <Input name="companySize" label="Veličina kompanije" value={formData.companySize} onChange={handleChange} />
            </>
          )}

          {/* Common fields */}
          <Input name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
          <Input name="password" label="Lozinka" type="password" value={formData.password} onChange={handleChange} />
          <Input
            name="confirmPassword"
            label="Potvrdi lozinku"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registracija...' : 'Registruj se'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Već imate nalog?{' '}
            <button onClick={() => navigate('/login')} className="text-indigo-600 hover:underline font-medium">
              Prijavite se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Small helper input component */
function Input({ name, label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
