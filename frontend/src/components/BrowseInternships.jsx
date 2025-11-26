import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters 
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get("company") || "");
  const [weeksDuration, setWeeksDuration] = useState(searchParams.get("weeksDuration") || "");
  const [isPaid, setIsPaid] = useState(searchParams.get("isPaid") || "");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);

  // Active filters for actual fetch
  const [activeFilters, setActiveFilters] = useState({
    search: searchTerm,
    location: selectedLocation,
    company: selectedCompany,
    weeksDuration,
    isPaid,
    page: currentPage,
  });

  const [internships, setInternships] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  // fetch only when active filters change / or on page change (so i can remember where user left of in search)
  useEffect(() => {
    fetchInternships(activeFilters);
    // Update URL whenever activeFilters change
    const params = new URLSearchParams({
      search: activeFilters.search,
      location: activeFilters.location,
      company: activeFilters.company,
      weeksDuration: activeFilters.weeksDuration,
      isPaid: activeFilters.isPaid,
      page: activeFilters.page,
    });
    setSearchParams(params);
  }, [activeFilters]);

  const fetchInternships = async (filters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: pageSize,
        search: filters.search || "",
        location: filters.location || "",
        company: filters.company || "",
        weeksDuration: filters.weeksDuration || "",
        isPaid: filters.isPaid || "",
      });

      const response = await fetch(`${API_URL}/internships?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.success) {
        setInternships(result.data.content);
        setTotalCount(result.data.totalElements);
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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedCompany("");
    setWeeksDuration("");
    setIsPaid("");
    setCurrentPage(1);
  };

  // active filters change only when search button is clicked
  const handleSearchClick = () => {
    setCurrentPage(1); 
    setActiveFilters({
      search: searchTerm,
      location: selectedLocation,
      company: selectedCompany,
      weeksDuration,
      isPaid,
      page: 1,
    });
  };

  const goToDetails = (id) => {
    navigate(`${id}`);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pretraži prakse</h1>
      </div>

      {/* Search Bar */}
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
            onClick={handleSearchClick}
            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <X className="w-4 h-4" /> Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="e.g., Belgrade"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                placeholder="e.g., ABC Ltd"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Duration (months)</label>
              <input
                type="number"
                value={weeksDuration}
                onChange={(e) => setWeeksDuration(e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compensation</label>
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

      {/* Results */}
      <div className="mb-4 text-gray-600">
        Prikazano {internships.length} od {totalCount} praksi
      </div>

      {internships.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nije pronadjena nijedna praksa koja odgovara vašim kriterijumima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map((internship) => (
            <div key={internship.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{internship.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>{internship.company.companyName}</span>
                  </div>
                </div>
                {internship.paid && <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Paid</span>}
              </div>

              <p className="text-gray-600 mb-4">{internship.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" /> <span>{internship.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4" /> <span>{internship.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <DollarSign className="w-4 h-4" /> <span>{internship.salary}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Deadline: {internship.deadline}</span>
                <button
                  onClick={() => goToDetails(internship.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Detalji
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
          onClick={() => setActiveFilters({ ...activeFilters, page: currentPage - 1 })}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Pret
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          disabled={currentPage * pageSize >= totalCount}
          onClick={() => setActiveFilters({ ...activeFilters, page: currentPage + 1 })}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Sled
        </button>
      </div>
    </div>
  );
}
