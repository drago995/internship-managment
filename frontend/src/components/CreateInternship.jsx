import { useState } from "react";
import { Calendar, MapPin, DollarSign, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";
const API_URL = "http://localhost:8080";

export default function CreateInternship() {
    const { token } = useAuth();


    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        availablePositions: "",
        requirements: "",
        responsibilities: "",
        location: "",
        isPaid: false,
        salary: "",
        durationWeeks: "",
        skills: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/internships`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        if (response.ok) {
            alert("Internship created successfully!");
        } else {
            alert("Failed to create internship.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Internship</h1>

                <div onSubmit={handleSubmit} className="space-y-8">

                    {/* BASIC INFO */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    name="title"
                                    placeholder="Internship Title"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Short description..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        value={form.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* DETAILS */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-600" /> Details
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Positions</label>
                                    <input
                                        name="availablePositions"
                                        placeholder="Number"
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        value={form.availablePositions}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Weeks)</label>
                                    <input
                                        name="durationWeeks"
                                        placeholder="Number"
                                        type="number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        value={form.durationWeeks}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    name="location"
                                    placeholder="City or Remote"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    value={form.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="isPaid"
                                    name="isPaid"
                                    checked={form.isPaid}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="isPaid" className="text-sm font-medium text-gray-700 cursor-pointer">Paid Internship</label>
                            </div>

                            {form.isPaid && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" /> Salary
                                    </label>
                                    <input
                                        name="salary"
                                        type="number"
                                        placeholder="Amount"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        value={form.salary}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* REQUIREMENTS & RESPONSIBILITIES */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements & Responsibilities</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                                <textarea
                                    name="requirements"
                                    placeholder="Comma separated (e.g., JavaScript, React, Problem-solving)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-20"
                                    value={form.requirements}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                                <textarea
                                    name="responsibilities"
                                    placeholder="Comma separated (e.g., Build UI, Fix bugs, Write tests)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-20"
                                    value={form.responsibilities}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-200" />

                    {/* SKILLS */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>

                        <div>
                            <input
                                name="skills"
                                placeholder="Comma separated (e.g., React, Node.js, MongoDB)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                value={form.skills}
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    {/* BUTTON */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-8"
                    >
                        Create Internship
                    </button>
                </div>
            </div>
        </div>
    );
}