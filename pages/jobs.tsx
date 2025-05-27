"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../SupabaseClient'
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
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
  Summary: string
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

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Freelance Job Board</h1>
          <p className="text-gray-600">Find your next opportunity from {jobs.length} available positions</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or summary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
              {/* Job List */}
                <div className="space-y-2">
                  {filteredJobs.map((job) => (
                    <div key={job.UNIQUE_ID}>
                      <Card className="p-0 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md hover:border-secondary/30 transition-all duration-200">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                          {/* Main Job Info */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-base font-semibold text-gray-900">{job.Title}</h3>
                                </div>
                                <p className="text-sm text-gray-700 font-medium">{job.Company}</p>
                                {job.URL && (
                                  <a
                                    href={job.URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-2 px-6 py-3 text-lg font-bold bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                                  >
                                    View Job
                                  </a>
                                )}
                              </div>
                            </div>
                            {/* Job Details Box */}
                            <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 mt-2">
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.Location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{job.rate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Posted: {job.date ? new Date(job.date).toLocaleDateString() : ""}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">Type:</span>
                                  <span>freelance</span>
                                </div>
                              </div>
                              {/* Description */}
                              <p className="text-gray-700 text-[11px] leading-tight mt-2">{job.Summary}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>

        {filteredJobs.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </Card>
        )}
      </div>
    </div>
  )
}