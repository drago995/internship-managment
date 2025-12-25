import { useEffect, useState } from "react";
import { Building2, ClipboardList, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function FacultyCompanies() {
    const { token } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [internshipsLoading, setInternshipsLoading] = useState(false);

    // Fetch all companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await fetch(`${API_URL}/companies`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setCompanies(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, [token]);

    // Fetch internships for selected company
    const fetchInternships = async (companyId) => {
        setInternshipsLoading(true);
        try {
            const res = await fetch(`${API_URL}/companies/${companyId}/internships`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSelectedCompany({ ...companies.find(c => c.id === companyId), internships: data.data });
        } catch (err) {
            console.error(err);
        } finally {
            setInternshipsLoading(false);
        }
    };

    if (loading) return <p className="text-gray-500 text-center py-12">Učitavanje...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">

            {/* Companies List */}
            <div className="bg-white border rounded-lg divide-y">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => fetchInternships(company.id)}
                    >
                        <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-indigo-600" />
                            <span className="font-medium text-gray-900">{company.companyName}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{company.address || "N/A"}</span>
                    </div>
                ))}
            </div>

            {/* Selected Company Details */}
            {selectedCompany && (
                <div className="mt-8 bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">{selectedCompany.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedCompany.description || "Nema opisa"}</p>

                    <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Prakse
                    </h4>

                    {internshipsLoading ? (
                        <p className="text-gray-500">Učitavanje praksi...</p>
                    ) : selectedCompany.internships?.length ? (
                        <div className="divide-y border-t">
                            {selectedCompany.internships.map((internship) => (
                                <div key={internship.id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2">
                                    <span className="text-gray-900">{internship.title}</span>
                                    <span className="text-gray-500 text-sm">{internship.status}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Ova kompanija nema praksi.</p>
                    )}
                </div>
            )}
        </div>
    );
}
