"use client";

import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, CircularProgress,
  Container, TextField, Typography, Alert,
} from "@mui/material";
import { ArrowBack, CheckCircle } from "@mui/icons-material";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

interface Job {
  _id: string;
  title: string;
  hospitalName: string;
  city: string;
  specialization: string;
}

export default function ApplyPage() {
  const { jobId } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/jobs/${jobId}`)
      .then(({ data }) => setJob(data.job))
      .catch(() => router.replace("/jobs"))
      .finally(() => setFetching(false));
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post(`/applications/${jobId}`, { coverLetter });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Box display="flex" justifyContent="center" py={12}><CircularProgress /></Box>;
  }

  if (success) {
    return (
      <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center" maxWidth={420} px={3}>
          <CheckCircle sx={{ fontSize: 72, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
            Application Sent!
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Your application for <strong>{job?.title}</strong> at <strong>{job?.hospitalName}</strong> has been submitted. We&apos;ll notify you when there&apos;s an update.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button component={Link} href="/account/applications" variant="contained" sx={{ borderRadius: "10px", fontWeight: 700 }}>
              Track Applications
            </Button>
            <Button component={Link} href="/jobs" variant="outlined" sx={{ borderRadius: "10px", fontWeight: 600 }}>
              Browse More Jobs
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <ProtectedRoute role="applicant">
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="sm">

          <Button component={Link} href={`/jobs/${jobId}`} startIcon={<ArrowBack />}
            sx={{ color: "text.secondary", mb: 3, textTransform: "none", fontWeight: 500 }}>
            Back to Job
          </Button>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
                Apply for this role
              </Typography>

              <Box sx={{ bgcolor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", p: 2, mb: 3 }}>
                <Typography fontWeight={700}>{job?.title}</Typography>
                <Typography variant="body2" color="text.secondary">{job?.hospitalName} · {job?.city}</Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Cover Letter (Optional)
                </Typography>
                <TextField
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={`Tell ${job?.hospitalName} why you're the right fit for this role. Mention your relevant experience, specialization, and what makes you stand out...`}
                  multiline rows={8} fullWidth
                  sx={{ mt: 0.8, mb: 3 }}
                />

                <Alert severity="info" sx={{ mb: 3, borderRadius: "10px" }}>
                  Your profile details (resume, specialization, experience) will automatically be shared with your application.
                </Alert>

                <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                  sx={{ borderRadius: "10px", py: 1.6, fontWeight: 700, fontSize: 16 }}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
