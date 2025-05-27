"use client"

import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import LoginForm from "../components/ui/login";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { DollarSign, MapPin, Search, Calendar } from "lucide-react"
import Fuse from "fuse.js";

interface Job {
  UNIQUE_ID: string
  Title: string
  Company: string
  Location: string
  rate: string
  date: string
  Summary: string // Fixed: was "stringx"
  URL: string
}

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPills, setSearchPills] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [user, setUser] = useState<any>(null);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    // Check auth state on mount
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchJobs() {
      const { data, error } = await supabase.from("Allgigs_All_vacancies_NEW").select("*");
      if (error) {
        console.error(error);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    }
    fetchJobs();
  }, [user]);

if (!user) {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

const filteredJobs = jobs.filter((job) => {
  if (searchPills.length === 0) return true;
  return searchPills.some(pill =>
    job.Title?.toLowerCase().includes(pill) ||
    job.Company?.toLowerCase().includes(pill) ||
    job.Location?.toLowerCase().includes(pill)
  );
}).filter((job) => {
  return (
    locationFilter === "all" ||
    (locationFilter === "remote" && job.Location === "Remote") ||
    (locationFilter === "onsite" && job.Location !== "Remote")
  );
});

if (loading)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-xl font-semibold text-gray-700">Loading amazing jobs...</div>
        <div className="text-gray-500 mt-2">Please wait while we fetch the latest opportunities</div>
      </div>
    </div>
  )

return (
  <div className="job-board-container">
    {/* Logout Button */}
    <button
      onClick={handleLogout}
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        background: "#e53e3e",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 16px",
        fontWeight: "bold",
        cursor: "pointer",
        zIndex: 1000,
      }}
>
  Logout
</button>

    {/* Header */}
    <div className="job-header">
      <h1>Freelance Job Board</h1>
      <p>
        Discover your next opportunity from <span style={{ fontWeight: 600, color: "#4f46e5" }}>{filteredJobs.length}</span> curated positions
      </p>
    </div>
{searchPills.length > 0 && (
  <div style={{ marginBottom: 12 }}>
    {searchPills.map((pill) => (
      <span
        key={pill}
        style={{
          display: "inline-block",
          background: "#4f46e5",
          color: "#fff",
          borderRadius: "999px",
          padding: "6px 16px",
          marginRight: "8px",
          fontWeight: "bold",
          fontSize: "0.95rem",
          marginBottom: "4px",
        }}
      >
        {pill}
        <span
          style={{
            marginLeft: 8,
            cursor: "pointer",
            fontWeight: "normal",
            color: "#fff",
          }}
          onClick={() => setSearchPills(searchPills.filter(p => p !== pill))}
          title="Remove"
        >
          ×
        </span>
      </span>
    ))}
  </div>
)}
   {/* Filters */}
  <div className="job-filters">
        <input
          placeholder="Search jobs, companies, or descriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              const term = searchTerm.trim().toLowerCase();
              if (term && !searchPills.includes(term)) {
                setSearchPills([...searchPills, term]);
              }
              setSearchTerm("");
              e.preventDefault();
            }
          }}
          style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "1rem" }}
        />
        <select
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "1rem" }}
        >
          <option value="all">🌍 All Locations</option>
          <option value="remote">🏠 Remote</option>
          <option value="onsite">🏢 On-site</option>
        </select>
      </div>

          {/* Job List */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <div className="job-card" key={job.UNIQUE_ID}>
            <div className="job-main">
              <div className="job-title">{job.Title}</div>
              <div className="job-company">{job.Company}</div>
              <div className="job-details">
                <span>{job.Location}</span>
                <span>{job.rate}</span>
                <span>{job.date ? new Date(job.date).toLocaleDateString() : "N/A"}</span>
                <span>Freelance</span>
              </div>
              <div className="job-summary">{job.Summary}</div>
            </div>
            <div>
              {job.URL && (
                <a
                  href={job.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-job-btn"
                >
                  View Job
                </a>
              )}
              <div className="job-id">ID: {job.UNIQUE_ID.slice(-6)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}