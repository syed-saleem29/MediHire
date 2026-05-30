"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SmartphoneIcon from "@mui/icons-material/Smartphone";

import Link from "next/link";

const jobsData = [
  {
    href: "#",
    imgSrc: "/browse.svg",
    alt: "Browse Jobs",
    label: "Browse Jobs",
  },
  {
    href: "#",
    imgSrc: "/recruiter.svg",
    alt: "Faculty Jobs",
    label: "Recruiter Connect",
  },
  {
    href: "#",
    imgSrc: "/resume.svg",
    alt: "Recruiter Connect",
    label: "Professional Resume",
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ width: "100%" }}>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Connecting Hospitals with Skilled Medical Professionals
          </Typography>

          <Typography variant="h6" color="text.secondary" mb={4}>
            MediHire helps hospitals hire qualified staff quickly and
            efficiently.
          </Typography>

          {/* Search Field */}
          <Box
            // border={0}
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <TextField
              // variant="standard"
              placeholder="Search jobs"
              fullWidth
              sx={{
                maxWidth: 500,
                bgcolor: "background.paper",
                borderRadius: "11px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: "10px",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/jobs"
            >
              Find Jobs
            </Button>

            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/enterprise/dashboard"
            >
              Post a Job
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ================= FEATURES SECTION ================= */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Grid container spacing={4}>
          {[
            {
              title: "Verified Hospitals",
              desc: "Only trusted and verified healthcare institutions.",
            },
            {
              title: "Skilled Professionals",
              desc: "Find experienced doctors, nurses, and medical staff.",
            },
            {
              title: "Fast Hiring",
              desc: "Streamlined hiring process designed for hospitals.",
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">{feature.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Jobs Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          bgcolor: "primary.light",
        }}
      >
        <Container maxWidth="md">
          {/* ================= TITLE ================= */}
          <Typography variant="h3" gutterBottom>
            Jobs
          </Typography>

          <Typography variant="h6" color="text.secondary" mb={4}>
            Find your Dream Healthcare Jobs
          </Typography>

          {/* ================= SEARCH ================= */}
          <Box display="flex" justifyContent="center" mb={5}>
            <TextField
              placeholder="Search jobs"
              fullWidth
              sx={{
                maxWidth: 500,
                bgcolor: "background.paper",
                borderRadius: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 5,
                  "& fieldset": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* ================= EXPLORE BY ================= */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              display: "inline-block",
              borderBottom: 3,
              borderColor: "primary.main",
              mb: 4,
            }}
          >
            Explore By
          </Typography>

          {/* ================= CATEGORY CIRCLES ================= */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mb: 6,
            }}
          >
            {jobsData.map((job, index) => (
              <Box
                key={index}
                component={Link}
                href={job.href}
                sx={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: 120, sm: 150 },
                  height: { xs: 120, sm: 150 },
                  border: "2px solid",
                  borderColor: "primary.main",
                  borderRadius: "50%",
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={job.imgSrc}
                  alt={job.alt}
                  sx={{
                    width: 40,
                    height: 40,
                    mb: 1.5,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.primary"
                  fontWeight={500}
                  sx={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    width: "100%",
                    maxWidth: "100%",
                    textAlign: "center",
                    fontWeight: "600",
                    lineHeight: 1.2,
                    fontSize: { xs: "11px", sm: "12px" },
                    px: 0.5,
                    // For multi-line ellipsis (2 lines max)
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    // Fallback for non-webkit browsers
                    maxHeight: "2.4em",
                  }}
                >
                  {job.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* ================= BOTTOM INFO STRIP ================= */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              borderTop: 1,
              borderColor: "divider",
              pt: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Explore healthcare jobs anytime!
            </Typography>

            <Box
              component={Link}
              href="#"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              <SmartphoneIcon color="action" />
              <Typography variant="body2" fontWeight={600}>
                Get App
              </Typography>
            </Box>

            <Button
              variant="outlined"
              sx={{
                borderRadius: 5,
                textTransform: "none",
              }}
            >
              + Post a Job
            </Button>
          </Box>
        </Container>
      </Box>

      
    </Box>
  );
}
