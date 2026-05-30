import { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Providers from "./Providers";
import "remixicon/fonts/remixicon.css";
import "./globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body style={{ margin: 0, minHeight: "100vh", fontFamily: "var(--font-inter), sans-serif" }}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
