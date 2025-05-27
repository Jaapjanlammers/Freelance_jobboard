"use client"

import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { DollarSign, MapPin, Search, Calendar } from "lucide-react"

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
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase.from("Allgigs_All_vacancies_NEW").select("*")
      if (error) {
        console.error(error)
      } else {
        setJobs(data || [])
      }
      setLoading(false)
    }
    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.Summary?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      locationFilter === "all" ||
      (locationFilter === "remote" && job.Location === "Remote") ||
      (locationFilter === "onsite" && job.Location !== "Remote")

    return matchesSearch && matchesLocation
  })

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
      {/* Header */}
      <div className="job-header">
        <h1>Freelance Job Board</h1>
        <p>
          Discover your next opportunity from <span style={{ fontWeight: 600, color: "#4f46e5" }}>{jobs.length}</span> curated positions
        </p>
      </div>

   {/* Filters */}
      <div className="job-filters">
        <input
          placeholder="Search jobs, companies, or descriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
