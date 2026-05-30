"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Grid, InputAdornment, MenuItem,
  Select, TextField, Typography, Divider, FormControl,
} from "@mui/material";
import { Search, LocationOn, Work, AccessTime, LocalHospital } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

interface Job {
  _id: string;
  title: string;
  hospitalName: string;
  hospitalType: string;
  specialization: string;
  department?: string;
  shiftType?: string;
  jobType: string;
  city: string;
  isUrgent: boolean;
  experienceRequired: number;
  salary?: { min?: number; max?: number; currency: string };
  applicationCount: number;
  createdAt: string;
  postedBy: { name: string; hospitalName: string };
}

const SPECIALIZATIONS = [
  "All", "General Medicine", "Cardiology", "Neurology", "Oncology", "Orthopedics",
  "Pediatrics", "Gynecology", "Radiology", "Nursing", "Pharmacy", "Laboratory",
  "Physiotherapy", "Dentistry", "Emergency Medicine", "ICU / Critical Care", "Other",
];
const JOB_TYPES = ["All", "full-time", "part-time", "contract", "internship"];

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const salaryText = job.salary?.min
    ? `INR ${(job.salary.min / 1000).toFixed(0)}K${job.salary.max ? `–${(job.salary.max / 1000).toFixed(0)}K` : "+"}`
    : null;

  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86400000);

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer", transition: "all 0.2s",
        "&:hover": { boxShadow: "0 8px 30px rgba(0,161,67,0.12)", transform: "translateY(-2px)", borderColor: "primary.main" },
        border: "1.5px solid #E2E8F0",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box flex={1} pr={1}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={0.5}>
              {job.isUrgent && (
                <Chip label="🔴 Urgent" size="small" sx={{ bgcolor: "#FEF2F2", color: "#DC2626", fontWeight: 700, height: 22, fontSize: 11 }} />
              )}
              <Chip label={job.specialization} size="small" sx={{ bgcolor: "#E6FAF0", color: "#00A143", fontWeight: 600, height: 22, fontSize: 11 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3, fontSize: "1rem" }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500} mt={0.3}>
              {job.hospitalName}
            </Typography>
          </Box>
          <Box
            sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: "#E6FAF0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <LocalHospital sx={{ color: "primary.main", fontSize: 24 }} />
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2} mt={2} mb={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <LocationOn sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">{job.city}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Work sx={{ fontSize: 15, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>{job.jobType}</Typography>
          </Box>
          {job.shiftType && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <AccessTime sx={{ fontSize: 15, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>{job.shiftType} shift</Typography>
            </Box>
          )}
          {job.experienceRequired > 0 && (
            <Typography variant="caption" color="text.secondary">{job.experienceRequired}+ yrs exp</Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            {salaryText ? (
              <Typography variant="body2" fontWeight={700} color="primary.main">{salaryText} / mo</Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">Salary not disclosed</Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="caption" color="text.secondary">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </Typography>
            <Button variant="contained" size="small" sx={{ borderRadius: "8px", fontWeight: 600, px: 2 }}>
              Apply
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [city, setCity] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { limit: 20 };
      if (search) params.search = search;
      if (specialization !== "All") params.specialization = specialization;
      if (jobType !== "All") params.jobType = jobType;
      if (city) params.city = city;
      if (isUrgent) params.isUrgent = "true";
      const { data } = await api.get("/jobs", { params });
      setJobs(data.jobs);
      setTotal(data.total);
    } catch {}
    finally { setLoading(false); }
  }, [search, specialization, jobType, city, isUrgent]);

  useEffect(() => {
    const delay = setTimeout(fetchJobs, 350);
    return () => clearTimeout(delay);
  }, [fetchJobs]);

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      {/* Search header */}
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #E2E8F0", py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
            Find Medical Jobs
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {total > 0 ? `${total} jobs found` : "Search across hospitals, clinics & more"}
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              placeholder="Job title, specialization, hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: "1 1 260px", bgcolor: "white" }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment> }}
            />
            <TextField
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              sx={{ flex: "0 0 160px", bgcolor: "white" }}
              InputProps={{ startAdornment: <InputAdornment position="start"><LocationOn color="action" fontSize="small" /></InputAdornment> }}
            />
            <FormControl sx={{ flex: "0 0 200px" }}>
              <Select value={specialization} onChange={(e) => setSpecialization(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "white" }}>
                {SPECIALIZATIONS.map((s) => <MenuItem key={s} value={s}>{s === "All" ? "All Specializations" : s}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: "0 0 160px" }}>
              <Select value={jobType} onChange={(e) => setJobType(e.target.value)}
                sx={{ borderRadius: "10px", bgcolor: "white" }}>
                {JOB_TYPES.map((t) => <MenuItem key={t} value={t}>{t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>)}
              </Select>
            </FormControl>
            <Button
              variant={isUrgent ? "contained" : "outlined"} color="error"
              onClick={() => setIsUrgent(!isUrgent)}
              sx={{ borderRadius: "10px", fontWeight: 600, whiteSpace: "nowrap" }}
            >
              🔴 Urgent Only
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Results */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}><CircularProgress color="primary" /></Box>
        ) : jobs.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography fontSize={56} mb={2}>🔍</Typography>
            <Typography variant="h6" fontWeight={700} gutterBottom>No jobs found</Typography>
            <Typography color="text.secondary">Try adjusting your filters or search terms</Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {jobs.map((job) => (
              <Grid size={{ xs: 12, md: 6 }} key={job._id}>
                <JobCard job={job} onClick={() => router.push(`/jobs/${job._id}`)} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
