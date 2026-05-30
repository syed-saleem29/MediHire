"use client";

import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Grid, Typography, Divider,
} from "@mui/material";
import { Add, Work, People, CheckCircle, TrendingUp } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface Job {
  _id: string;
  title: string;
  city: string;
  jobType: string;
  applicationCount: number;
  isUrgent: boolean;
  isActive: boolean;
  createdAt: string;
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
        <Box sx={{ width: 50, height: 50, borderRadius: "12px", bgcolor: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function HRDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs/my")
      .then(({ data }) => setJobs(data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalApplications = jobs.reduce((sum, j) => sum + j.applicationCount, 0);
  const activeJobs = jobs.filter((j) => j.isActive).length;

  return (
    <ProtectedRoute role="hr">
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="lg">

          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
                Welcome back, {user?.name?.split(" ")[0]} 👋
              </Typography>
              <Typography color="text.secondary">Here&apos;s an overview of your hiring activity</Typography>
            </Box>
            <Button component={Link} href="/enterprise/post-job" variant="contained" startIcon={<Add />}
              sx={{ borderRadius: "10px", fontWeight: 700, px: 3, py: 1.3 }}>
              Post a Job
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} mb={4}>
            {[
              { icon: <Work sx={{ color: "white" }} />, label: "Jobs Posted", value: jobs.length, color: "#00A143" },
              { icon: <TrendingUp sx={{ color: "white" }} />, label: "Active Jobs", value: activeJobs, color: "#0EA5E9" },
              { icon: <People sx={{ color: "white" }} />, label: "Total Applicants", value: totalApplications, color: "#8B5CF6" },
              { icon: <CheckCircle sx={{ color: "white" }} />, label: "Hired", value: "—", color: "#F59E0B" },
            ].map((s) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.label}>
                <StatCard {...s} />
              </Grid>
            ))}
          </Grid>

          {/* Jobs list */}
          <Card>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2.5}>
              <Typography variant="h6" fontWeight={700}>Your Job Listings</Typography>
              <Button component={Link} href="/enterprise/post-job" variant="outlined" size="small" sx={{ borderRadius: "8px" }}>
                + New Job
              </Button>
            </Box>
            <Divider />

            {loading ? (
              <Box display="flex" justifyContent="center" py={6}><CircularProgress color="primary" /></Box>
            ) : jobs.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Typography fontSize={48} mb={2}>📋</Typography>
                <Typography variant="h6" fontWeight={700} gutterBottom>No jobs posted yet</Typography>
                <Typography color="text.secondary" mb={3}>Post your first job to start receiving applications</Typography>
                <Button component={Link} href="/enterprise/post-job" variant="contained" sx={{ borderRadius: "10px" }}>
                  Post Your First Job
                </Button>
              </Box>
            ) : (
              jobs.map((job, i) => (
                <Box key={job._id}>
                  {i > 0 && <Divider />}
                  <Box
                    display="flex" alignItems="center" justifyContent="space-between"
                    px={3} py={2.5} flexWrap="wrap" gap={2}
                    sx={{ "&:hover": { bgcolor: "#F8FAFC" }, cursor: "pointer", transition: "background 0.15s" }}
                    onClick={() => router.push(`/enterprise/applicants?jobId=${job._id}`)}
                  >
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography fontWeight={700}>{job.title}</Typography>
                        {job.isUrgent && <Chip label="Urgent" size="small" color="error" sx={{ height: 20, fontSize: 11 }} />}
                        {!job.isActive && <Chip label="Closed" size="small" sx={{ height: 20, fontSize: 11 }} />}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {job.city} · {job.jobType} · Posted {new Date(job.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box textAlign="center">
                        <Typography fontWeight={800} color="primary.main">{job.applicationCount}</Typography>
                        <Typography variant="caption" color="text.secondary">Applicants</Typography>
                      </Box>
                      <Button variant="outlined" size="small" sx={{ borderRadius: "8px", fontWeight: 600 }}>View</Button>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Card>

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
