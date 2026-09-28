import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Administration — ADD Parkour Oran",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Server-side Authentication & Authorization Gate (Rule 4 & 31 & 32)
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 2. Render dedicated Admin Shell
  return (
    <AdminLayoutClient
      adminUser={{
        id: user.id,
        phone: user.phone,
        role: user.role,
      }}
    >
      {children}
    </AdminLayoutClient>
  );
}
