"use client";

import {
  AppBar, Toolbar, Typography, Button, Box,
  Avatar, Menu, MenuItem, Divider,
} from "@mui/material";
import { BusinessCenter } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    setAnchor(null);
    router.push("/");
  };

  return (
    <AppBar position="static" elevation={0}
      sx={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E8F0", color: "text.primary" }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4, md: 10 }, display: "flex", justifyContent: "space-between", minHeight: "64px !important" }}>

        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1} component={Link} href="/" sx={{ textDecoration: "none" }}>
          <Box sx={{ width: 32, height: 32, borderRadius: "8px", background: "linear-gradient(135deg, #00A143, #007A32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "white", fontWeight: 800, fontSize: 16 }}>M</Typography>
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: "text.primary", letterSpacing: "-0.5px" }}>
            MediHire
          </Typography>
        </Box>

        {/* Right section */}
        <Box display="flex" alignItems="center" gap={1.5}>
          {user ? (
            // ── Logged in ──
            <>
              {user.role === "applicant" && (
                <Button component={Link} href="/jobs" variant="text"
                  sx={{ color: "text.secondary", fontWeight: 500, textTransform: "none" }}>
                  Find Jobs
                </Button>
              )}
              {user.role === "hr" && (
                <Button component={Link} href="/enterprise/post-job" variant="text"
                  sx={{ color: "text.secondary", fontWeight: 500, textTransform: "none" }}>
                  Post a Job
                </Button>
              )}

              <Avatar
                onClick={(e) => setAnchor(e.currentTarget)}
                sx={{ width: 36, height: 36, bgcolor: "primary.main", cursor: "pointer", fontSize: 14, fontWeight: 700 }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>

              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{ sx: { borderRadius: "12px", minWidth: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", mt: 1 } }}
              >
                <Box px={2} py={1.5}>
                  <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                </Box>
                <Divider />
                {user.role === "hr" ? (
                  [
                    <MenuItem key="dash" onClick={() => { setAnchor(null); router.push("/enterprise/dashboard"); }}>Dashboard</MenuItem>,
                    <MenuItem key="jobs" onClick={() => { setAnchor(null); router.push("/enterprise/post-job"); }}>Post a Job</MenuItem>,
                    <MenuItem key="apps" onClick={() => { setAnchor(null); router.push("/enterprise/applicants"); }}>Applicants</MenuItem>,
                  ]
                ) : (
                  [
                    <MenuItem key="jobs" onClick={() => { setAnchor(null); router.push("/jobs"); }}>Find Jobs</MenuItem>,
                    <MenuItem key="profile" onClick={() => { setAnchor(null); router.push("/account/profile"); }}>My Profile</MenuItem>,
                    <MenuItem key="myapps" onClick={() => { setAnchor(null); router.push("/account/applications"); }}>My Applications</MenuItem>,
                  ]
                )}
                <MenuItem onClick={() => { setAnchor(null); router.push("/account/settings"); }}>Settings</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: "error.main", fontWeight: 600 }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            // ── Logged out ──
            <>
              <Button component={Link} href="/jobs" variant="text"
                sx={{ color: "text.secondary", fontWeight: 500, textTransform: "none", display: { xs: "none", sm: "flex" } }}>
                Find Jobs
              </Button>

              <Button
                component={Link} href="/enterprise/register"
                variant="text"
                startIcon={<BusinessCenter fontSize="small" />}
                sx={{ color: "text.secondary", fontWeight: 500, textTransform: "none", display: { xs: "none", sm: "flex" } }}
              >
                For Hospitals
              </Button>

              <Button component={Link} href="/login" variant="outlined"
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, borderColor: "#E2E8F0", color: "text.primary", "&:hover": { borderColor: "primary.main" } }}>
                Sign In
              </Button>

              <Button component={Link} href="/enterprise/register" variant="contained"
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, display: { xs: "none", sm: "flex" } }}>
                Post a Job
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
