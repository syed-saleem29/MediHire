import { ReactNode } from "react";

// Auth pages have no Navbar or Footer — clean centered layout
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
