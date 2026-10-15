"use client";

import React from "react";
import { PortalProvider } from "@/components/portal/PortalContext";
import { PortalNavbar } from "@/components/portal/PortalNavbar";
import { AddChildModal } from "@/components/portal/AddChildModal";
import { Footer } from "@/components/layout/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalProvider>
      <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-[#F5F5F2]">
        <PortalNavbar />
        <main className="flex-1 w-full">{children}</main>
        <AddChildModal />
        <Footer />
      </div>
    </PortalProvider>
  );
}
