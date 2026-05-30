"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        background:
          "radial-gradient(circle at 10% 20%, rgba(0,161,67,0.1) 0%, rgba(255,255,255,1) 90%)",
      }}
    >
      <Navbar />
      <Box component="main" flexGrow={1}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
