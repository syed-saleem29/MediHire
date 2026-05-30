"use client";
import { ReactNode } from "react";
import MainLayout from "@/components/MainLayout";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
