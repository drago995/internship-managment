import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  Filter,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function BrowseInternships() {
  const [internships, setInternships] = useState([]);

  const { token } = useAuth();

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedLocation, setSelectedLocation] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");

  const [weeksDuration, setWeeksDuration] = useState("");

  const [isPaid, setIsPaid] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  // add state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // fetch internships when page changes or filters change
  useEffect(() => {
    fetchInternships();
  }, [currentPage]);

  const fetchInternships = async () => {
    setLoading(true); // start loading
    try {
      // Build query parameters with filters + pagination
      const queryParams = new URLSearchParams({
        page: currentPage, // backend expects 1-indexed pages
        limit: pageSize,
        search: searchTerm || "",
        location: selectedLocation || "",
        company: selectedCompany || "",
        weeksDuration: weeksDuration || "",
        isPaid: isPaid || "",
      });

      const response = await fetch(
        `${API_URL}/internships?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();

      if (result.success) {
        // result.data.content je Page objekat poslat od springa
        setInternships(result.data.content); //
        setTotalCount(result.data.totalElements); // ukupan broj praksi koje odgovaraju filteru
      } else {
        setInternships([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      setInternships([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // f-ja za filtriranje
  // u javaskriptu prazan string se konvertuje u FALSE !
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedCompany("");
    setWeeksDuration("");
    setIsPaid("");
    setCurrentPage(1); // vrati se na prvu stranu
    fetchInternships(); // refresh results
  };

  const handleApply = (internshipId) => {
    alert(`Applied to internship ${internshipId}`);
    // logika za prijavu
  };

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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pretraži prakse
        </h1>
      </div>

      {/* Search Bar with Search Button */}
      <div className="mb-6">
        <div className="relative flex">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pozicija ili ključna reč"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => { setCurrentPage(1); fetchInternships(); }}
            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="e.g., Belgrade"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                placeholder="e.g., ABC Ltd"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Duration (months)
              </label>
              <input
                type="number"
                value={weeksDuration}
                onChange={(e) => setWeeksDuration(e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Paid Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compensation
              </label>
              <select
                value={isPaid}
                onChange={(e) => setIsPaid(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Paid</option>
                <option value="false">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Prikazano {internships.length} od {totalCount} praksi
      </div>

      {/* Internship Cards */}
      {internships.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nije pronadjena nijedna praksa koja odgovara vašim kriterijumima.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map((internship) => (
            <div
              key={internship.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {internship.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{internship.company.companyName}</span>
                  </div>
                </div>
                {internship.paid && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    Paid
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4">{internship.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{internship.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>{internship.salary}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Deadline: {internship.deadline}
                </span>
                <button
                  onClick={() => handleApply(internship.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Pret
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          disabled={currentPage * pageSize >= totalCount}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
