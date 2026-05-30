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

// ─── Floating job card shown in the illustration ───────────────────────────
function FloatingCard({
  top, left, right, name, role, hospital, delay = "0s",
}: {
  top?: string; left?: string; right?: string;
  name: string; role: string; hospital: string; delay?: string;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top, left, right,
        bgcolor: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: "14px",
        px: 2.5,
        py: 1.8,
        minWidth: 220,
        animation: `floatCard 4s ease-in-out infinite`,
        animationDelay: delay,
        "@keyframes floatCard": {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 38, height: 38, borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "white",
          }}
        >
          {name.charAt(0)}
        </Box>
        <Box>
          <Typography sx={{ color: "white", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>
            {name}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
            {role}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>
            {hospital}
          </Typography>
        </Box>
        <CheckCircle sx={{ color: "#4ade80", fontSize: 18, ml: "auto" }} />
      </Box>
    </Box>
  );
}

// ─── Medical illustration SVG ──────────────────────────────────────────────
function MedicalIllustration() {
  return (
    <Box sx={{ position: "relative", width: "100%", flex: 1, minHeight: 340 }}>
      {/* Central stethoscope SVG */}
      <Box
        sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.15,
        }}
      >
        <svg width="260" height="260" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="36" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
          <path d="M32 28 C32 28, 30 40, 34 46 C38 52, 46 54, 50 60 C54 66, 54 74, 50 78"
            stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="80" r="5" stroke="white" strokeWidth="2.5" fill="none" />
          <circle cx="32" cy="28" r="3" fill="white" />
          <circle cx="38" cy="24" r="2" fill="white" />
          <line x1="68" y1="36" x2="68" y2="52" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="60" y1="44" x2="76" y2="44" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </Box>

      {/* Floating doctor / HR cards */}
      <FloatingCard
        top="8%" left="2%"
        name="Dr. Priya Sharma"
        role="Cardiologist"
        hospital="Apollo Hospital, Delhi"
        delay="0s"
      />
      <FloatingCard
        top="38%" right="2%"
        name="Anjali Nair"
        role="ICU Nurse"
        hospital="AIIMS, Mumbai"
        delay="1.3s"
      />
      <FloatingCard
        top="68%" left="6%"
        name="Rahul Verma"
        role="Lab Technician"
        hospital="Fortis, Bangalore"
        delay="2.6s"
      />
    </Box>
  );
}

// ─── Main Login Page ────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
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
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);
      router.push(data.user.role === "hr" ? "/enterprise/dashboard" : "/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
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
          flex: "0 0 52%",
          flexDirection: "column",
          background: "linear-gradient(160deg, #00C151 0%, #007A32 55%, #004d20 100%)",
          position: "relative",
          overflow: "hidden",
          px: 6,
          py: 5,
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 320, height: 320,
          borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)" }} />
        <Box sx={{ position: "absolute", bottom: -120, left: -60, width: 400, height: 400,
          borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Box sx={{ position: "absolute", top: "40%", right: -40, width: 200, height: 200,
          borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />

        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.5} mb={2}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: "10px",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 800, fontSize: 18 }}>M</Typography>
          </Box>
          <Typography sx={{ color: "white", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>
            MediHire
          </Typography>
        </Box>

        {/* Tagline */}
        <Box mt={4}>
          <Chip
            label="🏥  India's Medical Job Platform"
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 500, mb: 2 }}
          />
          <Typography
            variant="h3"
            sx={{ color: "white", fontWeight: 800, lineHeight: 1.2, fontSize: { md: "2rem", lg: "2.5rem" } }}
          >
            Find your place in <br />
            <Box component="span" sx={{ color: "#a7f3d0" }}>healthcare</Box>
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 1.5, maxWidth: 360, lineHeight: 1.7, fontSize: 15 }}>
            Connecting skilled medical professionals with top hospitals, clinics, and healthcare institutions.
          </Typography>
        </Box>

        {/* Floating cards illustration */}
        <MedicalIllustration />

        {/* Stats strip at bottom */}
        <Box
          display="flex" gap={3}
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            pt: 3, mt: "auto",
          }}
        >
          {[
            { value: "500+", label: "Hospitals" },
            { value: "12K+", label: "Jobs Posted" },
            { value: "8.4K+", label: "Hired" },
          ].map((s) => (
            <Box key={s.label}>
              <Typography sx={{ color: "white", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>
                {s.value}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 12, mt: 0.3 }}>
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          flex: 1,
          px: { xs: 3, sm: 6, lg: 8 },
          py: 6,
          bgcolor: "#FAFAFA",
          overflowY: "auto",
        }}
      >
        {/* Mobile logo */}
        <Box display={{ xs: "block", md: "none" }} mb={4} textAlign="center">
          <Typography variant="h5" fontWeight={800} color="primary">MediHire</Typography>
        </Box>

        <Box maxWidth={420} width="100%" mx="auto">
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.5px" }}>
            Welcome back 👋
          </Typography>
          <Typography color="text.secondary" mb={4} fontSize={15}>
            Sign in to continue to your MediHire account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Email Address
            </Typography>
            <TextField
              name="email"
              type="email"
              placeholder="doctor@hospital.com"
              value={form.email}
              onChange={handleChange}
              fullWidth required
              sx={{ mt: 0.8, mb: 2.5 }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Password
              </Typography>
              <Typography variant="caption" color="primary.main" sx={{ cursor: "pointer", fontWeight: 600 }}>
                Forgot password?
              </Typography>
            </Box>
            <TextField
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              fullWidth required
              sx={{ mt: 0.8, mb: 3 }}
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ py: 1.6, fontSize: 16, fontWeight: 700, borderRadius: "12px", mb: 2 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Divider sx={{ my: 2.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} px={1}>
              OR CONTINUE WITH
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => { window.location.href = `${SERVER}/api/auth/google`; }}
            sx={{
              py: 1.5, borderRadius: "12px", borderColor: "#E2E8F0",
              color: "text.primary", fontWeight: 600, fontSize: 15,
              "&:hover": { borderColor: "#00A143", bgcolor: "#f0fdf4" },
            }}
            startIcon={
              <Box component="img" src="/google.svg" alt="Google" sx={{ width: 22, height: 22 }} />
            }
          >
            Continue with Google
          </Button>

          <Typography variant="body2" textAlign="center" color="text.secondary" mt={4}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "#00A143", fontWeight: 700, textDecoration: "none" }}>
              Create account →
            </Link>
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}
