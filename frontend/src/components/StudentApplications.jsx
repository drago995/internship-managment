import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function StudentApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_URL}/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch applications");

      const data = await response.json();
      setApplications(data.data || []);
      console.log(data[0] + "AAAAAA")

     console.log("App data:", data.data);
      console.log("Raw server response:", data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moje Prijave</h1>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Niste se prijavili ni za jednu praksu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {app.internshipTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <span>{app.internshipCompanyName}</span>
                  </div>
                </div>
                {app.internshipPaid && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Paid
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4">{app.internshipDescription}</p>

              <div className="space-y-2 mb-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <span>Location:</span> {app.internshipLocation}
                </div>
                <div className="flex items-center gap-2">
                  <span>Duration:</span> {app.internshipDuration}
                </div>
                <div className="flex items-center gap-2">
                  <span>Salary:</span> {app.internshipSalary}
                </div>
                <div className="flex items-center gap-2">
                  <span>Status:</span>{" "}
                  <span
                    className={`${
                      app.status === "APPROVED"
                        ? "text-green-600"
                        : app.status === "REJECTED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    } font-semibold`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
