"use client";
import { ReactNode } from "react";
import MainLayout from "@/components/MainLayout";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
