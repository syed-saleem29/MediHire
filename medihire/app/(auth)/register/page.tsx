"use client";

import { useState } from "react";
import {
  Box, Button, Divider, IconButton, InputAdornment,
  TextField, Typography, Alert, CircularProgress, Chip,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const SERVER = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const FEATURES = [
  { icon: "🩺", title: "Specialization Filters", desc: "Find jobs by medical specialty" },
  { icon: "🏥", title: "Verified Institutions", desc: "Only trusted hospitals & clinics" },
  { icon: "📊", title: "Application Tracker", desc: "Track every application status" },
  { icon: "⚡", title: "Fast Hiring", desc: "Streamlined process for healthcare" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", specialization: "", hospitalName: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, role: "applicant" });
      login(data.token, data.user);
      router.push("/jobs");
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
          background: "linear-gradient(160deg, #00C151 0%, #007A32 55%, #004d20 100%)",
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
          <Typography sx={{ color: "white", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>MediHire</Typography>
        </Box>

        <Box mt={4}>
          <Chip label="🚀  Join 8,400+ Medical Professionals" size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 500, mb: 2 }} />
          <Typography variant="h3" sx={{ color: "white", fontWeight: 800, lineHeight: 1.2, fontSize: { md: "1.9rem", lg: "2.3rem" } }}>
            Your next career move <br />
            <Box component="span" sx={{ color: "#a7f3d0" }}>starts here</Box>
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 1.5, lineHeight: 1.7, fontSize: 15, maxWidth: 340 }}>
            Build your medical career profile and connect with the right opportunity — in days, not months.
          </Typography>
        </Box>

        {/* Feature list */}
        <Box mt={5} display="flex" flexDirection="column" gap={2.5} flex={1}>
          {FEATURES.map((f) => (
            <Box key={f.title} display="flex" alignItems="flex-start" gap={2}>
              <Box sx={{
                width: 42, height: 42, borderRadius: "10px", flexShrink: 0,
                bgcolor: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>
                {f.icon}
              </Box>
              <Box>
                <Typography sx={{ color: "white", fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{f.title}</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{f.desc}</Typography>
              </Box>
              <CheckCircle sx={{ color: "#4ade80", fontSize: 18, ml: "auto", mt: 0.3 }} />
            </Box>
          ))}
        </Box>

        {/* Bottom strip */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.15)", pt: 3, mt: 4 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Trusted by medical professionals across Pakistan
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
        <Box display={{ xs: "block", md: "none" }} mb={4} textAlign="center">
          <Typography variant="h5" fontWeight={800} color="primary">MediHire</Typography>
        </Box>

        <Box maxWidth={440} width="100%" mx="auto">
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
            Create account ✨
          </Typography>
          <Typography color="text.secondary" mb={3} fontSize={15}>
            Join MediHire as a job seeker — it&apos;s free
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Full Name</Typography>
            <TextField name="name" placeholder="Dr. Amina Khalid" value={form.name} onChange={handleChange} fullWidth required sx={{ mt: 0.8, mb: 2 }} />

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Email Address</Typography>
            <TextField name="email" type="email" placeholder="you@hospital.com" value={form.email} onChange={handleChange} fullWidth required sx={{ mt: 0.8, mb: 2 }} />

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</Typography>
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
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

            {role === "applicant" ? (
              <>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Specialization</Typography>
                <TextField name="specialization" placeholder="e.g. Cardiologist, ICU Nurse, Lab Tech" value={form.specialization} onChange={handleChange} fullWidth sx={{ mt: 0.8, mb: 3 }} />
              </>
            ) : (
              <>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Hospital / Clinic Name</Typography>
                <TextField name="hospitalName" placeholder="e.g. Aga Khan Hospital" value={form.hospitalName} onChange={handleChange} fullWidth required sx={{ mt: 0.8, mb: 3 }} />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth size="large"
              disabled={loading}
              sx={{ py: 1.6, fontSize: 16, fontWeight: 700, borderRadius: "12px", mb: 2 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} px={1}>OR CONTINUE WITH</Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth size="large"
            onClick={() => { window.location.href = `${SERVER}/api/auth/google`; }}
            sx={{ py: 1.5, borderRadius: "12px", borderColor: "#E2E8F0", color: "text.primary", fontWeight: 600, fontSize: 15, "&:hover": { borderColor: "#00A143", bgcolor: "#f0fdf4" } }}
            startIcon={<Box component="img" src="/google.svg" alt="Google" sx={{ width: 22, height: 22 }} />}
          >
            Continue with Google
          </Button>

          <Box mt={3} display="flex" justifyContent="center" gap={1} flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">Hiring for a hospital?</Typography>
            <Link href="/enterprise/register" style={{ color: "#0EA5E9", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
              Hospital signup →
            </Link>
          </Box>

          <Typography variant="body2" textAlign="center" color="text.secondary" mt={1}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#00A143", fontWeight: 700, textDecoration: "none" }}>
              Sign in →
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
