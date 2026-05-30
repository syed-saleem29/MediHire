"use client";

import { useState } from "react";
import {
  Box, Button, Card, CardContent, Container, Grid,
  TextField, Typography, Alert, CircularProgress,
  Select, MenuItem, FormControl, Switch, FormControlLabel, Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";

const SPECIALIZATIONS = [
  "General Medicine", "Cardiology", "Neurology", "Oncology", "Orthopedics",
  "Pediatrics", "Gynecology", "Radiology", "Anesthesiology", "Psychiatry",
  "Dermatology", "Emergency Medicine", "ICU / Critical Care",
  "Nursing", "Pharmacy", "Laboratory", "Physiotherapy", "Dentistry", "Other",
];
const DEPARTMENTS = ["ICU", "ER / Emergency", "OPD", "OT / Surgery", "Ward", "Lab", "Radiology", "Pharmacy", "Admin", "Other"];
const HOSPITAL_TYPES = [
  { value: "government", label: "Government Hospital" },
  { value: "private", label: "Private Hospital" },
  { value: "clinic", label: "Clinic / Polyclinic" },
  { value: "telemedicine", label: "Telemedicine / Remote" },
];
const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];
const SHIFTS = [
  { value: "day", label: "Day" },
  { value: "night", label: "Night" },
  { value: "rotating", label: "Rotating" },
  { value: "flexible", label: "Flexible" },
];

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", description: "", hospitalName: "", hospitalType: "",
    specialization: "", department: "", shiftType: "", jobType: "full-time",
    experienceRequired: 0, licenseRequired: false,
    salaryMin: "", salaryMax: "", city: "", isUrgent: false, deadline: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: any) => { setForm((f) => ({ ...f, [field]: value })); setError(""); };
  const handleChange = (e: any) => set(e.target.name, e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.specialization || !form.hospitalType) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        ...form,
        experienceRequired: Number(form.experienceRequired),
        salary: { min: Number(form.salaryMin) || undefined, max: Number(form.salaryMax) || undefined, currency: "INR" },
        deadline: form.deadline || undefined,
      };
      // Strip empty strings for optional enum fields so Mongoose gets undefined, not ""
      ["shiftType", "department"].forEach((k) => { if (!payload[k]) delete payload[k]; });
      await api.post("/jobs", payload);
      router.push("/enterprise/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute role="hr">
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="md">

          {/* Header */}
          <Box mb={4}>
            <Button component={Link} href="/enterprise/dashboard" startIcon={<ArrowBack />}
              sx={{ color: "text.secondary", mb: 2, textTransform: "none", fontWeight: 500 }}>
              Back to Dashboard
            </Button>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>Post a Job</Typography>
            <Typography color="text.secondary">Fill in the details to attract the right candidates</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2.5}>Basic Information</Typography>
                <Grid container spacing={2.5}>

                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Job Title *</Typography>
                    <TextField name="title" placeholder="e.g. Senior ICU Nurse, Cardiologist" value={form.title} onChange={handleChange} fullWidth required sx={{ mt: 0.8 }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Hospital / Clinic Name *</Typography>
                    <TextField name="hospitalName" placeholder="e.g. AIIMS, Apollo Hospital" value={form.hospitalName} onChange={handleChange} fullWidth required sx={{ mt: 0.8 }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>City *</Typography>
                    <TextField name="city" placeholder="e.g. Mumbai, Delhi, Bangalore" value={form.city} onChange={handleChange} fullWidth required sx={{ mt: 0.8 }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Institution Type *</Typography>
                    <FormControl fullWidth sx={{ mt: 0.8 }}>
                      <Select value={form.hospitalType} onChange={(e) => set("hospitalType", e.target.value)} displayEmpty
                        sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}>
                        <MenuItem value="" disabled><Typography color="text.secondary">Select type</Typography></MenuItem>
                        {HOSPITAL_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Job Type</Typography>
                    <FormControl fullWidth sx={{ mt: 0.8 }}>
                      <Select value={form.jobType} onChange={(e) => set("jobType", e.target.value)}
                        sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}>
                        {JOB_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Job Description *</Typography>
                    <TextField name="description" placeholder="Describe the role, responsibilities, and requirements..." value={form.description} onChange={handleChange} fullWidth required multiline rows={5} sx={{ mt: 0.8 }} />
                  </Grid>

                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2.5}>Medical Requirements</Typography>
                <Grid container spacing={2.5}>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Specialization *</Typography>
                    <FormControl fullWidth sx={{ mt: 0.8 }}>
                      <Select value={form.specialization} onChange={(e) => set("specialization", e.target.value)} displayEmpty
                        sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}>
                        <MenuItem value="" disabled><Typography color="text.secondary">Select specialization</Typography></MenuItem>
                        {SPECIALIZATIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Department</Typography>
                    <FormControl fullWidth sx={{ mt: 0.8 }}>
                      <Select value={form.department} onChange={(e) => set("department", e.target.value)} displayEmpty
                        sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}>
                        <MenuItem value="" disabled><Typography color="text.secondary">Select department</Typography></MenuItem>
                        {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Shift Type</Typography>
                    <FormControl fullWidth sx={{ mt: 0.8 }}>
                      <Select value={form.shiftType} onChange={(e) => set("shiftType", e.target.value)} displayEmpty
                        sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}>
                        <MenuItem value="" disabled><Typography color="text.secondary">Select shift</Typography></MenuItem>
                        {SHIFTS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Experience Required (years)</Typography>
                    <TextField name="experienceRequired" type="number" value={form.experienceRequired} onChange={handleChange} fullWidth inputProps={{ min: 0 }} sx={{ mt: 0.8 }} />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box display="flex" gap={4}>
                      <FormControlLabel control={<Switch checked={form.licenseRequired} onChange={(e) => set("licenseRequired", e.target.checked)} color="primary" />} label="License / Registration Required" />
                      <FormControlLabel control={<Switch checked={form.isUrgent} onChange={(e) => set("isUrgent", e.target.checked)} color="error" />} label="Mark as Urgent Hire" />
                    </Box>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2.5}>Salary & Deadline</Typography>
                <Grid container spacing={2.5}>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Min Salary (INR)</Typography>
                    <TextField name="salaryMin" type="number" placeholder="e.g. 80000" value={form.salaryMin} onChange={handleChange} fullWidth sx={{ mt: 0.8 }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Max Salary (INR)</Typography>
                    <TextField name="salaryMax" type="number" placeholder="e.g. 150000" value={form.salaryMax} onChange={handleChange} fullWidth sx={{ mt: 0.8 }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Application Deadline</Typography>
                    <TextField name="deadline" type="date" value={form.deadline} onChange={handleChange} fullWidth sx={{ mt: 0.8 }} InputLabelProps={{ shrink: true }} />
                  </Grid>

                </Grid>
              </CardContent>
            </Card>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>{error}</Alert>}

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button component={Link} href="/enterprise/dashboard" variant="outlined"
                sx={{ borderRadius: "10px", fontWeight: 600, px: 3 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}
                sx={{ borderRadius: "10px", fontWeight: 700, px: 4, py: 1.3 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : "Publish Job"}
              </Button>
            </Box>
          </form>

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
