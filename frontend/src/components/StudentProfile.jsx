import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,

  Award,
  FileText,
  Save,
  Upload,
  Download,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function StudentProfile() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  // for keeping the url of the CV once it was uploaded for deletion/download etc
  const [cvInfo, setCvInfo] = useState(null);
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    indexNumber: "",
    phoneNumber: "",
    studyYear: "",
    bio: "",
    gpa: "",
    skills: "",
  });

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  // fetching student profile info and CV together and extracting CV
  const fetchStudentProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/students/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      console.log("API response:", result);
      if (result.success) {
        setStudent(result.data); //  set the whole student object

        // Extract CV info if it exists
        if (result.data.cvFilePath) {
          console.log("Ucitan je CV")
          setCvInfo({
            filename: result.data.cvFileName,
            url: result.data.cvFilePath,
            uploadDate: result.data.cvUploadDate
          });
        } else {
          setCvInfo(null);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };
  // copies previous state apart from specific field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/students/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(student),
      });

      const result = await response.json();

      if (result.success) {
        alert("Profil uspešno ažuriran!");
      } else {
        alert("Greška pri čuvanju profila");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Greška pri čuvanju profila");
    } finally {
      setSaving(false);
    }
  };


  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Molimo učitajte PDF fajl");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Fajl je prevelik. Maksimalna veličina je 5MB");
      return;
    }

    setUploadingCV(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);

      const response = await fetch(`${API_URL}/students/profile/cv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setCvInfo(result.data);
        // Also update student state with new CV fields
        setStudent(prev => ({
          ...prev,
          cvFilename: result.data.filename,
          cvUrl: result.data.url,
          cvUploadDate: result.data.uploadDate
        }));
        alert("CV uspešno učitan!");
      } else {
        alert("Greška pri učitavanju CV-a");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Greška pri učitavanju CV-a");
    } finally {
      setUploadingCV(false);
    }
    e.target.value = null;
  };


  const handleCVDelete = async () => {
    // if (!confirm("Da li ste sigurni da želite da obrišete CV?")) return; 

    try {
      const response = await fetch(`${API_URL}/students/profile/cv`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setCvInfo(null);
        // update student state to clear CV fields
        setStudent(prev => ({
          ...prev,
          cvFilename: null,
          cvUrl: null,
          cvUploadDate: null
        }));
        alert("CV uspešno obrisan!");
      } else {
        alert("Greška pri brisanju CV-a");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      alert("Greška pri brisanju CV-a");
    }
  };
  const handleDownloadCV = async () => {
    try {
      const response = await fetch(`${API_URL}/students/profile/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = cvInfo.filename; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CV:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moj Profil</h1>
        <p className="text-gray-600">Ažurirajte svoje informacije</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Basic Info Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Osnovne informacije
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ime
              </label>
              <input
                type="text"
                name="firstName"
                value={student.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezime
              </label>
              <input
                type="text"
                name="lastName"
                value={student.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefon
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={student.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Broj indeksa
              </label>
              <input
                type="text"
                name="indexNumber"
                value={student.indexNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Godina studija
              </label>
              <select
                name="studyYear"
                value={student.studyYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Izaberite godinu</option>
                <option value="1">Prva godina</option>
                <option value="2">Druga godina</option>
                <option value="3">Treća godina</option>
                <option value="4">Četvrta godina</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Prosek (GPA)
              </label>
              <input
                type="number"
                step="0.01"
                name="gpa"
                value={student.gpa}
                onChange={handleChange}
                placeholder="npr. 8.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">O meni</h2>
          <textarea
            name="bio"
            value={student.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Napišite nešto o sebi..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Veštine</h2>
          <textarea
            name="skills"
            value={student.skills}
            onChange={handleChange}
            rows="3"
            placeholder="JavaScript, React, Python, SQL... (odvojeno zarezima)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Unesite veštine odvojene zarezima
          </p>
        </div>

        {/* CV SECTION */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            CV (Curriculum Vitae)
          </h2>

          {cvInfo ? (
            // Show existing CV with download and delete
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">{cvInfo.filename}</p>
                  <p className="text-sm text-gray-500">
                    Učitano: {new Date(cvInfo.uploadDate).toLocaleDateString('sr-RS')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadCV} // Option 3 function
                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Preuzmi
                  </button>
                  <button
                    onClick={handleCVDelete}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Obriši
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Zameni novi CV
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCVUpload}
                    disabled={uploadingCV}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            // Upload new CV
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadingCV ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                  <p className="text-gray-600">Učitavanje CV-a...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Učitaj CV
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PDF format, maks 5MB</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Čuvanje..." : "Sačuvaj izmene"}
          </button>
        </div>
      </div>
    </div>
  );
}
