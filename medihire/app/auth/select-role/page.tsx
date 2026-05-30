"use client";

import { useState } from "react";
import {
  Box, Button, Card, CardContent, Typography,
  TextField, Alert,
} from "@mui/material";
import { LocalHospital, Person } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function SelectRolePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [role, setRole] = useState<"applicant" | "hr" | null>(null);
  const [extra, setExtra] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const handleConfirm = async () => {
    if (!role) return;
    setLoading(true);
    try {
      localStorage.setItem("token", token!);
      const body: any = { role };
      if (role === "hr") body.hospitalName = extra;
      if (role === "applicant") body.specialization = extra;

      const { data } = await api.patch("/auth/select-role", body);
      login(token!, data.user);
      router.replace(role === "hr" ? "/enterprise/dashboard" : "/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "radial-gradient(circle at 10% 20%, rgba(0,161,67,0.08) 0%, #fff 90%)", px: 2 }}
    >
      <Card sx={{ width: "100%", maxWidth: 460, borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center">
            Welcome to MediHire
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={1} mb={4}>
            One last step — how are you using MediHire?
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box display="flex" gap={2} mb={3}>
            <Card
              onClick={() => setRole("applicant")}
              variant="outlined"
              sx={{
                flex: 1, p: 3, textAlign: "center", cursor: "pointer", borderRadius: 2,
                borderColor: role === "applicant" ? "primary.main" : "divider",
                borderWidth: role === "applicant" ? 2 : 1,
                bgcolor: role === "applicant" ? "primary.50" : "transparent",
                transition: "all 0.2s",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Person sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography fontWeight={600}>Job Seeker</Typography>
              <Typography variant="caption" color="text.secondary">
                Find medical jobs
              </Typography>
            </Card>

            <Card
              onClick={() => setRole("hr")}
              variant="outlined"
              sx={{
                flex: 1, p: 3, textAlign: "center", cursor: "pointer", borderRadius: 2,
                borderColor: role === "hr" ? "primary.main" : "divider",
                borderWidth: role === "hr" ? 2 : 1,
                bgcolor: role === "hr" ? "primary.50" : "transparent",
                transition: "all 0.2s",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <LocalHospital sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography fontWeight={600}>HR / Hospital</Typography>
              <Typography variant="caption" color="text.secondary">
                Post jobs & hire
              </Typography>
            </Card>
          </Box>

          {role && (
            <TextField
              label={role === "hr" ? "Hospital / Clinic Name" : "Specialization (e.g. Nurse, Cardiologist)"}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            />
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={!role || loading}
            onClick={handleConfirm}
            sx={{ borderRadius: 2 }}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
