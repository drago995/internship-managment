import { useState, useEffect, use } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080";

export default function BrowseInternships() {
  const [internships, setInternships] = useState([]);
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);
  // asinhrona funkcija za vracanje praksi, rezervisana rec async nam dozvoljava da koristimo await unutar funkcije
  const fetchInternships = async () => {
    try {
      // funkcija fetch vraca promise, upotrebom awaita cekamo da se promise razrezi i dobijamo Response objekat
      // drugi parametar je objekat sa opcijama za podesavanje http zahteva
      const response = await fetch(`${API_URL}/internships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // cekamo da fja json procita telo odgovora i parsira ga u JS objekat
      const result = await response.json();
      // ako je zahtev uspesan, azuriramo stanje prakse
      if (result.success && result.ok) {
        setInternships(result.data);
      } else {
        setInternships([]);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  return <div className="max-w-7xl mx-auto p-6"></div>;
}
