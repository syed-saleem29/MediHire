"use client";

import { useState } from "react";
import {
  Box, Button, Divider, IconButton, InputAdornment,
  TextField, Typography, Alert, CircularProgress,
  Select, MenuItem, FormControl, InputLabel, Chip,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle, LocalHospital } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const SERVER = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const HOSPITAL_TYPES = [
  { value: "government", label: "Government Hospital" },
  { value: "private", label: "Private Hospital" },
  { value: "clinic", label: "Clinic / Polyclinic" },
  { value: "telemedicine", label: "Telemedicine / Remote" },
];

const PERKS = [
  "Access to a verified talent pool of medical professionals",
  "Post unlimited jobs with medical-specific fields",
  "Filter candidates by specialization, license & experience",
  "Manage all applicants from one dashboard",
  "Mark urgency on critical job openings",
];

export default function EnterpriseRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "",
    hospitalName: "", hospitalType: "", phone: "", city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hospitalType) { setError("Please select a hospital type."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, role: "hr" });
      login(data.token, data.user);
      router.push("/enterprise/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: "0 0 46%",
          flexDirection: "column",
          background: "linear-gradient(160deg, #0EA5E9 0%, #0369A1 55%, #1e3a5f 100%)",
          position: "relative",
          overflow: "hidden",
          px: 6,
          py: 5,
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)" }} />
        <Box sx={{ position: "absolute", bottom: -100, left: -60, width: 380, height: 380, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />

        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Box sx={{ width: 40, height: 40, borderRadius: "10px", bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "white", fontWeight: 800, fontSize: 18 }}>M</Typography>
          </Box>
          <Typography sx={{ color: "white", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>
            MediHire <Box component="span" sx={{ fontSize: 13, fontWeight: 500, opacity: 0.7, ml: 1 }}>for Hospitals</Box>
          </Typography>
        </Box>

        <Box mt={4}>
          <Chip label="🏥  Trusted by 500+ Healthcare Institutions" size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 500, mb: 2 }} />
          <Typography variant="h3"
            sx={{ color: "white", fontWeight: 800, lineHeight: 1.2, fontSize: { md: "1.9rem", lg: "2.2rem" } }}>
            Hire qualified <br />
            <Box component="span" sx={{ color: "#7dd3fc" }}>medical staff faster</Box>
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 1.5, lineHeight: 1.7, fontSize: 15, maxWidth: 340 }}>
            Access a verified pool of doctors, nurses, and medical professionals ready to join your team.
          </Typography>
        </Box>

        {/* Feature list */}
        <Box mt={5} display="flex" flexDirection="column" gap={2.5} flex={1}>
          {PERKS.map((perk) => (
            <Box key={perk} display="flex" alignItems="flex-start" gap={2}>
              <CheckCircle sx={{ color: "#7dd3fc", fontSize: 20, mt: 0.1, flexShrink: 0 }} />
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.5 }}>
                {perk}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Bottom strip */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.15)", pt: 3, mt: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <LocalHospital sx={{ color: "rgba(255,255,255,0.5)", fontSize: 20 }} />
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Free to get started — no credit card required
          </Typography>
        </Box>
      </Box>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          flex: 1,
          px: { xs: 3, sm: 6, lg: 7 },
          py: 5,
          bgcolor: "#FAFAFA",
          overflowY: "auto",
        }}
      >
        {/* Mobile logo */}
        <Box display={{ xs: "flex", md: "none" }} mb={4} alignItems="center" gap={1}>
          <Typography variant="h5" fontWeight={800} color="primary">MediHire</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>for Hospitals</Typography>
        </Box>

        <Box maxWidth={460} width="100%" mx="auto">
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
            Create hospital account
          </Typography>
          <Typography color="text.secondary" mb={3} fontSize={15}>
            Start hiring medical professionals today
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row: name + email */}
            <Box display="flex" gap={2}>
              <Box flex={1}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Name</Typography>
                <TextField name="name" placeholder="Full name" value={form.name} onChange={handleChange} fullWidth required sx={{ mt: 0.8, mb: 2 }} />
              </Box>
              <Box flex={1}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone</Typography>
                <TextField name="phone" placeholder="+92 300 0000000" value={form.phone} onChange={handleChange} fullWidth sx={{ mt: 0.8, mb: 2 }} />
              </Box>
            </Box>

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Work Email</Typography>
            <TextField name="email" type="email" placeholder="hr@hospital.com" value={form.email} onChange={handleChange} fullWidth required sx={{ mt: 0.8, mb: 2 }} />

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</Typography>
            <TextField
              name="password" type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
              fullWidth required sx={{ mt: 0.8, mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Row: hospital name + type */}
            <Box display="flex" gap={2}>
              <Box flex={1}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Hospital / Clinic Name</Typography>
                <TextField name="hospitalName" placeholder="e.g. Aga Khan Hospital" value={form.hospitalName} onChange={handleChange} fullWidth required sx={{ mt: 0.8, mb: 2 }} />
              </Box>
              <Box flex={1}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>City</Typography>
                <TextField name="city" placeholder="e.g. Karachi" value={form.city} onChange={handleChange} fullWidth sx={{ mt: 0.8, mb: 2 }} />
              </Box>
            </Box>

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Institution Type</Typography>
            <FormControl fullWidth sx={{ mt: 0.8, mb: 3 }}>
              <Select
                name="hospitalType"
                value={form.hospitalType}
                onChange={handleChange}
                displayEmpty
                sx={{ borderRadius: "10px", bgcolor: "#F8FAFC", "& fieldset": { borderColor: "#E2E8F0", borderWidth: "1.5px" } }}
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Select institution type</Typography>
                </MenuItem>
                {HOSPITAL_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit" variant="contained" fullWidth size="large"
              disabled={loading}
              sx={{ py: 1.6, fontSize: 16, fontWeight: 700, borderRadius: "12px", mb: 2 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create Hospital Account"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} px={1}>OR CONTINUE WITH</Typography>
          </Divider>

          <Button
            variant="outlined" fullWidth size="large"
            onClick={() => { window.location.href = `${SERVER}/api/auth/google`; }}
            sx={{ py: 1.5, borderRadius: "12px", borderColor: "#E2E8F0", color: "text.primary", fontWeight: 600, fontSize: 15, "&:hover": { borderColor: "#0EA5E9", bgcolor: "#f0f9ff" } }}
            startIcon={<Box component="img" src="/google.svg" alt="Google" sx={{ width: 22, height: 22 }} />}
          >
            Continue with Google
          </Button>

          <Box mt={3} display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              Looking for a job instead?
            </Typography>
            <Link href="/register" style={{ color: "#00A143", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
              Job seeker signup →
            </Link>
          </Box>

          <Typography variant="body2" textAlign="center" color="text.secondary" mt={1}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#0EA5E9", fontWeight: 700, textDecoration: "none" }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
