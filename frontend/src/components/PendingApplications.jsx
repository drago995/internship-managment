import { useEffect, useState } from "react";
import { Check, X, User, Calendar, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function PendingApplications() {
    const { token } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch(`${API_URL}/applications/pending`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setApplications(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        // we put the token inside of dependency array in case of log out / log in

        fetchApplications();
    }, [token]);

    const decide = async (id, action) => {
        // optimistic update
        const prevList = [...applications];
        setApplications((prev) => prev.filter((a) => a.id !== id));

        try {
            await fetch(`${API_URL}/applications/${id}/${action}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error(err);
            alert("Greška prilikom obrade");
            setApplications(prevList);
        }
    };

    if (loading)
        return <p className="text-gray-500 text-center py-12">Učitavanje...</p>;
    if (applications.length === 0)
        return <p className="text-gray-500 text-center py-12">Nema prijava za obradu.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="bg-white border rounded-lg divide-y">
                {applications.map((app) => (
                    <Row
                        key={app.id}
                        application={app}
                        onApprove={() => decide(app.id, "approve")}
                        onReject={() => decide(app.id, "reject")}
                    />
                ))}
            </div>
        </div>
    );
}

function Row({ application, onApprove, onReject }) {
    return (
        <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
            {/* LEFT */}
            <div>
                <div className="font-medium text-gray-900">{application.studentName}</div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {application.internshipTitle}
                    </span>

                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {application.internshipDurationWeeks
                            ? `${application.internshipDurationWeeks} ned.`
                            : "N/A"}
                    </span>

                    <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {application.studentEmail || "N/A"}
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
