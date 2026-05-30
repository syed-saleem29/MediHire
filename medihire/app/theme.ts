import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00A143",
      light: "#E6FAF0",
      dark: "#007A32",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0EA5E9",
      light: "#E0F2FE",
      dark: "#0369A1",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F8FAFC",
      paper: "#ffffff",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    divider: "#E2E8F0",
    error: { main: "#EF4444" },
    warning: { main: "#F59E0B" },
    success: { main: "#00A143" },
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: `var(--font-inter), "Inter", "Plus Jakarta Sans", sans-serif`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: { fontFamily: `var(--font-jakarta), sans-serif`, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15 },
    h2: { fontFamily: `var(--font-jakarta), sans-serif`, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.2 },
    h3: { fontFamily: `var(--font-jakarta), sans-serif`, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.25 },
    h4: { fontFamily: `var(--font-jakarta), sans-serif`, fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.3 },
    h5: { fontFamily: `var(--font-jakarta), sans-serif`, fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontFamily: `var(--font-jakarta), sans-serif`, fontWeight: 600, letterSpacing: "-0.005em" },

    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.6 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.01em" },
    caption: { fontSize: "0.75rem", color: "#94A3B8" },
    overline: { fontWeight: 600, letterSpacing: "0.1em", fontSize: "0.7rem" },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 22px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #00A143 0%, #007A32 100%)",
          "&:hover": { background: "linear-gradient(135deg, #00b84d 0%, #008a38 100%)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#F8FAFC",
            "& fieldset": { borderColor: "#E2E8F0", borderWidth: "1.5px" },
            "&:hover fieldset": { borderColor: "#00A143" },
            "&.Mui-focused fieldset": { borderColor: "#00A143", borderWidth: "2px" },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#00A143" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "none" },
      },
    },
  },
});

export default theme;
