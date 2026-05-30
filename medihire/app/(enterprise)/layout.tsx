"use client";
import { ReactNode } from "react";
import MainLayout from "@/components/MainLayout";

export default function EnterpriseLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
