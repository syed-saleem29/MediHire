"use client";

import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Typography, Avatar, Select, MenuItem, Divider, FormControl,
} from "@mui/material";
import { ArrowBack, VerifiedUser, LocationOn } from "@mui/icons-material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

interface Applicant {
  _id: string;
  status: "applied" | "reviewed" | "interview" | "hired" | "rejected";
  createdAt: string;
  coverLetter?: string;
  applicant: {
    _id: string;
    name: string;
    email: string;
    specialization?: string;
    experienceYears?: number;
    licenseVerified?: boolean;
    city?: string;
    phone?: string;
    resumeUrl?: string;
  };
}

const STATUSES = ["applied", "reviewed", "interview", "hired", "rejected"];
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  applied:   { label: "Applied",       color: "#2563EB", bg: "#EFF6FF" },
  reviewed:  { label: "Reviewed",      color: "#D97706", bg: "#FFFBEB" },
  interview: { label: "Interview",     color: "#7C3AED", bg: "#F5F3FF" },
  hired:     { label: "Hired",         color: "#059669", bg: "#ECFDF5" },
  rejected:  { label: "Not Selected",  color: "#DC2626", bg: "#FEF2F2" },
};

export default function ApplicantsPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) { setLoading(false); return; }
    api.get(`/applications/job/${jobId}`)
      .then(({ data }) => setApplicants(data.applications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId: string, status: string) => {
    setUpdating(appId);
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplicants((prev) => prev.map((a) => a._id === appId ? { ...a, status: status as any } : a));
    } catch {}
    finally { setUpdating(null); }
  };

  if (!jobId) {
    return (
      <ProtectedRoute role="hr">
        <Box textAlign="center" py={10}>
          <Typography variant="h6" fontWeight={700}>No job selected</Typography>
          <Button component={Link} href="/enterprise/dashboard" variant="contained" sx={{ mt: 2, borderRadius: "10px" }}>
            Go to Dashboard
          </Button>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="hr">
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="lg">

          <Button component={Link} href="/enterprise/dashboard" startIcon={<ArrowBack />}
            sx={{ color: "text.secondary", mb: 3, textTransform: "none", fontWeight: 500 }}>
            Back to Dashboard
          </Button>

          <Box mb={4}>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
              Applicants
            </Typography>
            <Typography color="text.secondary">
              {applicants.length} applicant{applicants.length !== 1 ? "s" : ""} for this position
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={10}><CircularProgress color="primary" /></Box>
          ) : applicants.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Typography fontSize={56} mb={2}>👥</Typography>
              <Typography variant="h6" fontWeight={700} gutterBottom>No applicants yet</Typography>
              <Typography color="text.secondary">Applications will appear here once candidates apply</Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2.5}>
              {applicants.map((app) => {
                const person = app.applicant;
                const status = STATUS_CONFIG[app.status];
                const daysAgo = Math.floor((Date.now() - new Date(app.createdAt).getTime()) / 86400000);

                return (
                  <Card key={app._id}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="flex-start" gap={2.5} flexWrap="wrap">

                        {/* Avatar */}
                        <Avatar sx={{ width: 52, height: 52, bgcolor: "primary.main", fontWeight: 700, fontSize: 20 }}>
                          {person.name?.charAt(0).toUpperCase()}
                        </Avatar>

                        {/* Info */}
                        <Box flex={1} minWidth={200}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.3}>
                            <Typography fontWeight={700} fontSize={16}>{person.name}</Typography>
                            {person.licenseVerified && (
                              <VerifiedUser sx={{ fontSize: 16, color: "#2563EB" }} />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>{person.email}</Typography>
                          <Box display="flex" gap={2} flexWrap="wrap">
                            {person.specialization && (
                              <Chip label={person.specialization} size="small" sx={{ bgcolor: "#E6FAF0", color: "#00A143", fontWeight: 600, height: 22 }} />
                            )}
                            {person.experienceYears != null && person.experienceYears > 0 && (
                              <Typography variant="caption" color="text.secondary">{person.experienceYears} yrs exp</Typography>
                            )}
                            {person.city && (
                              <Box display="flex" alignItems="center" gap={0.4}>
                                <LocationOn sx={{ fontSize: 13, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">{person.city}</Typography>
                              </Box>
                            )}
                          </Box>

                          {app.coverLetter && (
                            <Box mt={2} sx={{ bgcolor: "#F8FAFC", borderRadius: "8px", p: 1.5, border: "1px solid #E2E8F0" }}>
                              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>COVER LETTER</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {app.coverLetter}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Status + Actions */}
                        <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2} minWidth={180}>
                          <Typography variant="caption" color="text.secondary">
                            Applied {daysAgo === 0 ? "today" : `${daysAgo}d ago`}
                          </Typography>

                          <FormControl size="small" fullWidth>
                            <Select
                              value={app.status}
                              disabled={updating === app._id}
                              onChange={(e) => updateStatus(app._id, e.target.value)}
                              renderValue={(val) => (
                                <Chip
                                  label={STATUS_CONFIG[val]?.label}
                                  size="small"
                                  sx={{ bgcolor: STATUS_CONFIG[val]?.bg, color: STATUS_CONFIG[val]?.color, fontWeight: 700, height: 24 }}
                                />
                              )}
                              sx={{ borderRadius: "10px", ".MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" } }}
                            >
                              {STATUSES.map((s) => (
                                <MenuItem key={s} value={s}>
                                  <Chip label={STATUS_CONFIG[s].label} size="small"
                                    sx={{ bgcolor: STATUS_CONFIG[s].bg, color: STATUS_CONFIG[s].color, fontWeight: 600 }} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {person.resumeUrl && (
                            <Button href={person.resumeUrl} target="_blank" variant="outlined" size="small"
                              sx={{ borderRadius: "8px", fontWeight: 600, width: "100%" }}>
                              View Resume
                            </Button>
                          )}
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
