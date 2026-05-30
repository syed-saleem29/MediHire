"use client";

import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Container, Grid,
  TextField, Typography, Alert, CircularProgress,
  Avatar, Chip, Divider, Select, MenuItem, FormControl,
} from "@mui/material";
import { Edit, Save, VerifiedUser, Person, LocalHospital } from "@mui/icons-material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const SPECIALIZATIONS = [
  "General Medicine", "Cardiology", "Neurology", "Oncology", "Orthopedics",
  "Pediatrics", "Gynecology", "Radiology", "Anesthesiology", "Psychiatry",
  "Dermatology", "Emergency Medicine", "ICU / Critical Care",
  "Nursing", "Pharmacy", "Laboratory", "Physiotherapy", "Dentistry", "Other",
];

const HOSPITAL_TYPES = [
  { value: "government", label: "Government Hospital" },
  { value: "private",    label: "Private Hospital" },
  { value: "clinic",     label: "Clinic / Polyclinic" },
  { value: "telemedicine", label: "Telemedicine / Remote" },
];

export default function ProfilePage() {
  const { user: authUser, login, token } = useAuth();
  const isHR = authUser?.role === "hr";

  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users/profile")
      .then(({ data }) => {
        setProfile(data.user);
        setForm(data.user);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const set = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const { data } = await api.patch("/users/profile", form);
      setProfile(data.user);
      setForm(data.user);
      if (token) login(token, { id: data.user._id, name: data.user.name, email: data.user.email, role: data.user.role });
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="md">

          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.5px" }}>
              My Profile
            </Typography>
            {!loading && (
              editing ? (
                <Box display="flex" gap={1.5}>
                  <Button variant="outlined" onClick={() => { setEditing(false); setForm(profile); }}
                    sx={{ borderRadius: "10px", fontWeight: 600 }}>
                    Cancel
                  </Button>
                  <Button variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
                    onClick={handleSave} disabled={saving}
                    sx={{ borderRadius: "10px", fontWeight: 700 }}>
                    Save Changes
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditing(true)}
                  sx={{ borderRadius: "10px", fontWeight: 600 }}>
                  Edit Profile
                </Button>
              )
            )}
          </Box>

          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: "10px" }}>Profile updated successfully!</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>{error}</Alert>}

          {loading ? (
            <Box display="flex" justifyContent="center" py={10}><CircularProgress color="primary" /></Box>
          ) : (
            <Grid container spacing={3}>

              {/* Avatar + summary card */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent sx={{ p: 3, textAlign: "center" }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main", fontSize: 32, fontWeight: 800, mx: "auto", mb: 2 }}>
                      {profile?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700}>{profile?.name}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1.5}>{profile?.email}</Typography>

                    <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap" mb={2}>
                      <Chip
                        icon={isHR ? <LocalHospital fontSize="small" /> : <Person fontSize="small" />}
                        label={isHR ? "HR / Hospital" : "Job Seeker"}
                        size="small"
                        sx={{ bgcolor: "#E6FAF0", color: "#00A143", fontWeight: 600 }}
                      />
                      {profile?.licenseVerified && (
                        <Chip icon={<VerifiedUser fontSize="small" />} label="License Verified" size="small"
                          sx={{ bgcolor: "#EFF6FF", color: "#2563EB", fontWeight: 600 }} />
                      )}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box textAlign="left" display="flex" flexDirection="column" gap={1}>
                      {profile?.city && (
                        <Typography variant="body2" color="text.secondary">📍 {profile.city}</Typography>
                      )}
                      {profile?.phone && (
                        <Typography variant="body2" color="text.secondary">📞 {profile.phone}</Typography>
                      )}
                      {!isHR && profile?.specialization && (
                        <Typography variant="body2" color="text.secondary">🩺 {profile.specialization}</Typography>
                      )}
                      {!isHR && profile?.experienceYears > 0 && (
                        <Typography variant="body2" color="text.secondary">💼 {profile.experienceYears} yrs experience</Typography>
                      )}
                      {isHR && profile?.hospitalName && (
                        <Typography variant="body2" color="text.secondary">🏥 {profile.hospitalName}</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Edit form */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} mb={3}>Personal Information</Typography>

                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Full Name</Typography>
                        <TextField value={form.name || ""} onChange={(e) => set("name", e.target.value)}
                          fullWidth disabled={!editing} sx={{ mt: 0.8 }} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone</Typography>
                        <TextField value={form.phone || ""} onChange={(e) => set("phone", e.target.value)}
                          placeholder="+91 00000 00000" fullWidth disabled={!editing} sx={{ mt: 0.8 }} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</Typography>
                        <TextField value={form.email || ""} fullWidth disabled sx={{ mt: 0.8 }} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>City</Typography>
                        <TextField value={form.city || ""} onChange={(e) => set("city", e.target.value)}
                          placeholder="e.g. Mumbai, Delhi" fullWidth disabled={!editing} sx={{ mt: 0.8 }} />
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Role-specific fields */}
                    <Typography variant="h6" fontWeight={700} mb={3}>
                      {isHR ? "Hospital Information" : "Medical Profile"}
                    </Typography>

                    <Grid container spacing={2.5}>
                      {isHR ? (
                        <>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Hospital / Clinic Name</Typography>
                            <TextField value={form.hospitalName || ""} onChange={(e) => set("hospitalName", e.target.value)}
                              placeholder="e.g. Apollo Hospital" fullWidth disabled={!editing} sx={{ mt: 0.8 }} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Institution Type</Typography>
                            <FormControl fullWidth sx={{ mt: 0.8 }}>
                              <Select value={form.hospitalType || ""} onChange={(e) => set("hospitalType", e.target.value)}
                                disabled={!editing} displayEmpty sx={{ borderRadius: "10px" }}>
                                <MenuItem value="" disabled><Typography color="text.secondary">Select type</Typography></MenuItem>
                                {HOSPITAL_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                              </Select>
                            </FormControl>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Specialization</Typography>
                            <FormControl fullWidth sx={{ mt: 0.8 }}>
                              <Select value={form.specialization || ""} onChange={(e) => set("specialization", e.target.value)}
                                disabled={!editing} displayEmpty sx={{ borderRadius: "10px" }}>
                                <MenuItem value="" disabled><Typography color="text.secondary">Select specialization</Typography></MenuItem>
                                {SPECIALIZATIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Experience (years)</Typography>
                            <TextField type="number" value={form.experienceYears || 0}
                              onChange={(e) => set("experienceYears", Number(e.target.value))}
                              inputProps={{ min: 0 }} fullWidth disabled={!editing} sx={{ mt: 0.8 }} />
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>License / Registration No.</Typography>
                            <TextField value={form.licenseNumber || ""} onChange={(e) => set("licenseNumber", e.target.value)}
                              placeholder="e.g. MCI-123456" fullWidth disabled={!editing} sx={{ mt: 0.8 }} />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          )}
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
