import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MapPin, Calendar, DollarSign } from "lucide-react";

const API_URL = "http://localhost:8080";

export default function InternshipDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await fetch(`${API_URL}/internships/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();

        setInternship(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id, token]);

  const handleApply = async () => {
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          internshipId: id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to apply");
      }

      const data = await response.json();
      console.log("Applicet successfully:", data);

    } catch (err) {
      console.error(err)
    }

  }

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!internship) return <div className="text-center py-12">Internship not found</div>;

  // Helper function to safely convert comma-separated strings to arrays
  const toArray = (str) => (str ? str.split(",").map((s) => s.trim()) : []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2"
      >
        ← Back
      </button>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{internship.title}</h1>
            <div className="flex items-center gap-2 text-gray-600 text-lg">
              {internship.company?.companyName || "Company"}
            </div>
          </div>

          {internship.isPaid && (
            <span className="px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Paid
            </span>
          )}
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5" /> <span>{internship.location || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5" />{" "}
            <span>{internship.durationWeeks ? `${internship.durationWeeks} weeks` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <DollarSign className="w-5 h-5" /> <span>{internship.salary || "Unpaid"}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{internship.description}</p>
        </div>

        {/* Requirements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            {toArray(internship.requirements).map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Responsibilities */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Responsibilities</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            {toArray(internship.responsibilities).map((res, idx) => (
              <li key={idx}>{res}</li>
            ))}
          </ul>
        </div>

        {/* Deadline + Apply Button */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <span className="text-gray-500 text-sm">Deadline: {internship.deadline || "N/A"}</span>
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
