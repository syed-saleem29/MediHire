"use client";

import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Grid, Typography, Divider, Alert,
} from "@mui/material";
import {
  LocationOn, Work, AccessTime, LocalHospital,
  ArrowBack, VerifiedUser, People,
} from "@mui/icons-material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface Job {
  _id: string;
  title: string;
  description: string;
  hospitalName: string;
  hospitalType: string;
  specialization: string;
  department?: string;
  shiftType?: string;
  jobType: string;
  city: string;
  isUrgent: boolean;
  licenseRequired: boolean;
  experienceRequired: number;
  salary?: { min?: number; max?: number; currency: string };
  applicationCount: number;
  createdAt: string;
  deadline?: string;
  postedBy: { name: string; hospitalName: string; city: string; phone?: string };
}

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data.job))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Box display="flex" justifyContent="center" py={12}><CircularProgress color="primary" /></Box>;
  }

  if (notFound || !job) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography fontSize={56}>😕</Typography>
        <Typography variant="h5" fontWeight={700} mt={2}>Job not found</Typography>
        <Button component={Link} href="/jobs" variant="contained" sx={{ mt: 3, borderRadius: "10px" }}>Browse Jobs</Button>
      </Container>
    );
  }

  const salaryText = job.salary?.min
    ? `INR ${(job.salary.min / 1000).toFixed(0)}K${job.salary.max ? `–${(job.salary.max / 1000).toFixed(0)}K` : "+"}`
    : null;

  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 86400000);

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">

        <Button component={Link} href="/jobs" startIcon={<ArrowBack />}
          sx={{ color: "text.secondary", mb: 3, textTransform: "none", fontWeight: 500 }}>
          Back to Jobs
        </Button>

        <Grid container spacing={3}>
          {/* Main content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Box display="flex" gap={1} flexWrap="wrap" mb={1.5}>
                      {job.isUrgent && (
                        <Chip label="🔴 Urgent Hire" size="small" sx={{ bgcolor: "#FEF2F2", color: "#DC2626", fontWeight: 700 }} />
                      )}
                      <Chip label={job.specialization} size="small" sx={{ bgcolor: "#E6FAF0", color: "#00A143", fontWeight: 600 }} />
                      {job.licenseRequired && (
                        <Chip icon={<VerifiedUser sx={{ fontSize: "14px !important" }} />} label="License Required" size="small" sx={{ bgcolor: "#EFF6FF", color: "#2563EB", fontWeight: 600 }} />
                      )}
                    </Box>
                    <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px", mb: 0.5 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={500}>
                      {job.hospitalName}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 60, height: 60, borderRadius: "14px", bgcolor: "#E6FAF0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <LocalHospital sx={{ color: "primary.main", fontSize: 32 }} />
                  </Box>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={3} py={2.5} sx={{ borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                  {[
                    { icon: <LocationOn fontSize="small" />, text: job.city },
                    { icon: <Work fontSize="small" />, text: job.jobType },
                    job.shiftType && { icon: <AccessTime fontSize="small" />, text: `${job.shiftType} shift` },
                    job.department && { icon: <LocalHospital fontSize="small" />, text: job.department },
                  ].filter(Boolean).map((item: any, i) => (
                    <Box key={i} display="flex" alignItems="center" gap={0.8} sx={{ color: "text.secondary", textTransform: "capitalize" }}>
                      {item.icon}
                      <Typography variant="body2">{item.text}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box mt={3}>
                  <Typography variant="h6" fontWeight={700} mb={2}>Job Description</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
                    {job.description}
                  </Typography>
                </Box>

                {job.experienceRequired > 0 && (
                  <Alert severity="info" sx={{ mt: 3, borderRadius: "10px" }}>
                    Minimum <strong>{job.experienceRequired} year{job.experienceRequired > 1 ? "s" : ""}</strong> of experience required in this role.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Apply card */}
            <Card sx={{ mb: 3, border: "2px solid", borderColor: "primary.main" }}>
              <CardContent sx={{ p: 3 }}>
                {salaryText && (
                  <Typography variant="h5" fontWeight={800} color="primary.main" mb={0.5}>
                    {salaryText}
                    <Typography component="span" variant="body2" color="text.secondary" fontWeight={400} ml={0.5}>/ month</Typography>
                  </Typography>
                )}

                <Box display="flex" alignItems="center" gap={1} mb={3} mt={salaryText ? 0 : 1}>
                  <People fontSize="small" sx={{ color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {job.applicationCount} applicant{job.applicationCount !== 1 ? "s" : ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" ml="auto">
                    {daysAgo === 0 ? "Posted today" : `${daysAgo}d ago`}
                  </Typography>
                </Box>

                {!user ? (
                  <Button component={Link} href="/login" variant="contained" fullWidth size="large"
                    sx={{ borderRadius: "10px", fontWeight: 700, py: 1.5 }}>
                    Sign in to Apply
                  </Button>
                ) : user.role === "hr" ? (
                  <Alert severity="info" sx={{ borderRadius: "10px" }}>HRs cannot apply to jobs.</Alert>
                ) : (
                  <Button component={Link} href={`/apply/${job._id}`} variant="contained" fullWidth size="large"
                    sx={{ borderRadius: "10px", fontWeight: 700, py: 1.5 }}>
                    Apply Now
                  </Button>
                )}

                {job.deadline && (
                  <Typography variant="caption" color="error.main" display="block" textAlign="center" mt={1.5} fontWeight={600}>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Hospital info */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>About the Institution</Typography>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box sx={{ width: 44, height: 44, borderRadius: "10px", bgcolor: "#E6FAF0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <LocalHospital sx={{ color: "primary.main" }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700} fontSize={15}>{job.hospitalName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>{job.hospitalType} · {job.city}</Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Posted by <strong>{job.postedBy?.name}</strong>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
