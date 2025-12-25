import { useState, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/*
const dummyInternships = [
    { id: 1, title: "Frontend Internship", description: "Learn React & Tailwind", applicants: 5 },
    { id: 2, title: "Backend Internship", description: "Work with Spring Boot", applicants: 3 },
    { id: 3, title: "Fullstack Internship", description: "React + Spring Boot", applicants: 8 },
]; */
const API_URL = "http://localhost:8080";

export default function CompanyInternships() {
    const [loading, setLoading] = useState(true);
    const [internships, setInternships] = useState([]);
    const [selected, setSelected] = useState(null); // for modal windows
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchInternships();


    }, []);

    const fetchInternships = async () => {
        try {
            const response = await fetch(`${API_URL}/internships/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            setInternships(result.data);

        } catch (err) {
            console.log("error fetchin internships");

        } finally {
            setLoading(false);
        }


    }

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
            <h2 className="text-2xl font-bold mb-4">Moje prakse</h2>

            <div className="grid gap-4">
                {internships.map((internship) => (
                    <div key={internship.id} className="flex justify-between items-center p-4 bg-white shadow rounded">
                        <div>
                            <h3 className="text-lg font-semibold">{internship.title}</h3>
                            <p className="text-gray-500">Applicants: {internship.applicantsCount}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                onClick={() => setSelected(internship)}
                            >
                                <Eye className="h-4 w-4" />
                                Details
                            </button>
                            <button
                                className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                onClick={() => alert(`Delete internship ${internship.title}`)}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal showing the selected internship */}
            {selected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-2">{selected.title}</h3>
                        <p className="mb-4">{selected.description}</p>
                        <p className="mb-4 text-gray-500">Applicants: {selected.applicantsCount}</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setSelected(null)}
                            >
                                Close
                            </button>
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => navigate(`${selected.id}/applications`)}
                            >
                                View Applications
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
