"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/login?error=no_token");
      return;
    }

    localStorage.setItem("token", token);

    api.get("/auth/me")
      .then(({ data }) => {
        login(token, data.user);
        router.replace(data.user.role === "hr" ? "/enterprise/dashboard" : "/jobs");
      })
      .catch(() => {
        router.replace("/login?error=auth_failed");
      });
  }, []);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
      <CircularProgress color="primary" />
      <Typography color="text.secondary">Signing you in...</Typography>
    </Box>
  );
}
