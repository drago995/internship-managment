import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function InternshipApplications() {
  const { id } = useParams();
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null); // For modal

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${API_URL}/internships/${id}/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        setApplications(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [id]);
  // method suing global window and document objects to make a dom objects which downloads CV on click
  const handleCVDownload = async () => {
    try {
      const response = await fetch(`${API_URL}/company/applications/${selectedApp.studentId}/cv/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();


      let filename = `${selectedApp.studentName}_CV.pdf`;


      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };




  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Applications</h2>
      <ul className="space-y-4">
        {applications.map(app => (
          <li
            key={app.id}
            className="flex justify-between items-center p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedApp(app)}
          >
            <span className="font-medium">{app.studentName}</span>
            <span className={`px-2 py-1 rounded text-white text-sm
              ${app.status === "PENDING" ? "bg-gray-500" : ""}
              ${app.status === "UNDER_REVIEW" ? "bg-yellow-500" : ""}
              ${app.status === "ACCEPTED" ? "bg-green-500" : ""}
              ${app.status === "REJECTED" ? "bg-red-500" : ""}
              ${app.status === "WITHDRAWN" ? "bg-gray-400" : ""}
            `}>
              {app.status.replace("_", " ")}
            </span>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-11/12 max-w-xl relative">
            <h3 className="text-xl font-bold mb-4">{selectedApp.studentName}</h3>
            <p className="mb-2"><strong>Email:</strong> {selectedApp.studentEmail}</p>

            {/* cover letter */}
            {selectedApp.coverLetter && (
              <div className="mb-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded border">
                <strong>Cover Letter:</strong>
                <p>{selectedApp.coverLetter}</p>
              </div>
            )}

            {/* CV download button */}
            <button
              onClick={handleCVDownload}
            >
              Download CV
            </button>

            {/* action buttons */}
            <div className="flex gap-2 mt-4">
              <button className="w-24 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Under Review
              </button>
              <button className="w-24 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Accept
              </button>
              <button className="w-24 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Reject
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedApp(null)}
              className="mt-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 absolute top-4 right-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
