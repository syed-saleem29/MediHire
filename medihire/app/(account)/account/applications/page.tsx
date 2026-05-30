"use client";

import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Chip, CircularProgress,
  Container, Button, Typography, Divider,
} from "@mui/material";
import { LocationOn, Work } from "@mui/icons-material";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

interface Application {
  _id: string;
  status: "applied" | "reviewed" | "interview" | "hired" | "rejected";
  createdAt: string;
  job: {
    _id: string;
    title: string;
    hospitalName: string;
    city: string;
    jobType: string;
    isUrgent: boolean;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  applied:   { label: "Applied",    color: "#2563EB", bg: "#EFF6FF" },
  reviewed:  { label: "Reviewed",   color: "#D97706", bg: "#FFFBEB" },
  interview: { label: "Interview",  color: "#7C3AED", bg: "#F5F3FF" },
  hired:     { label: "Hired 🎉",   color: "#059669", bg: "#ECFDF5" },
  rejected:  { label: "Not Selected", color: "#DC2626", bg: "#FEF2F2" },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/my")
      .then(({ data }) => setApplications(data.applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute role="applicant">
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="md">

          <Box mb={4}>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
              My Applications
            </Typography>
            <Typography color="text.secondary">
              Track the status of all your job applications
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={10}><CircularProgress color="primary" /></Box>
          ) : applications.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Typography fontSize={56} mb={2}>📋</Typography>
              <Typography variant="h6" fontWeight={700} gutterBottom>No applications yet</Typography>
              <Typography color="text.secondary" mb={3}>Start applying to medical jobs to track them here</Typography>
              <Button component={Link} href="/jobs" variant="contained" sx={{ borderRadius: "10px", fontWeight: 700 }}>
                Browse Jobs
              </Button>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {applications.map((app) => {
                const status = STATUS_CONFIG[app.status];
                const daysAgo = Math.floor((Date.now() - new Date(app.createdAt).getTime()) / 86400000);

                return (
                  <Card key={app._id}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography fontWeight={700} fontSize={16}>{app.job.title}</Typography>
                            {app.job.isUrgent && <Chip label="Urgent" size="small" color="error" sx={{ height: 20, fontSize: 11 }} />}
                          </Box>
                          <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1.5}>
                            {app.job.hospitalName}
                          </Typography>
                          <Box display="flex" gap={2} flexWrap="wrap">
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                              <Typography variant="caption" color="text.secondary">{app.job.city}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Work sx={{ fontSize: 14, color: "text.secondary" }} />
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>{app.job.jobType}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Applied {daysAgo === 0 ? "today" : `${daysAgo}d ago`}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1.5}>
                          <Chip
                            label={status.label}
                            size="small"
                            sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, height: 26, px: 0.5 }}
                          />
                          <Button component={Link} href={`/jobs/${app.job._id}`} variant="outlined" size="small"
                            sx={{ borderRadius: "8px", fontWeight: 600 }}>
                            View Job
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
