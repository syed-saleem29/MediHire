"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  role?: "applicant" | "hr"; // if set, restrict to that role only
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (role && user.role !== role) {
      router.replace(user.role === "hr" ? "/enterprise/dashboard" : "/jobs");
    }
  }, [user, loading, role]);

  if (loading || !user || (role && user.role !== role)) {
    return (
      <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>;
}
