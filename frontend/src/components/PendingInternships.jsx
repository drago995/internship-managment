import { useEffect, useState } from "react";
import { Check, X, Building2, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function PendingInternships() {
  const { token } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch(`${API_URL}/internships/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setInternships(data.data); // ApiResponse.data
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [token]);

  const decide = async (id, action) => {
    // optimistic update
    setInternships((prev) => prev.filter((i) => i.id !== id));

    try {
      await fetch(`${API_URL}/internships/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
      alert("Greška prilikom obrade");
    }
  };

  if (loading)
    return <p className="text-gray-500 text-center py-12">Učitavanje...</p>;
  if (internships.length === 0)
    return <p className="text-gray-500 text-center py-12">Nema praksi za obradu.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Prakse na čekanju</h2>

      <div className="bg-white border rounded-lg divide-y">
        {internships.map((internship) => (
          <Row
            key={internship.id}
            internship={internship}
            onApprove={() => decide(internship.id, "approve")}
            onReject={() => decide(internship.id, "reject")}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ internship, onApprove, onReject }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
      {/* LEFT */}
      <div>
        <Link
          to={`/faculty/internships/${internship.id}`}
          className="font-medium text-gray-900 hover:underline"
        >
          {internship.title}
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {internship.companyName}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {internship.durationWeeks} ned.
          </span>

          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {internship.availablePositions}
          </span>

          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
            {internship.category}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="p-2 rounded-md text-green-600 hover:bg-green-50"
          title="Odobri"
        >
          <Check className="h-5 w-5" />
        </button>

        <button
          onClick={onReject}
          className="p-2 rounded-md text-red-600 hover:bg-red-50"
          title="Odbij"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
