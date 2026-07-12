import { requireAdminSession } from "@/lib/auth-guard";
import DashboardShell from "@/components/admin/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  return <DashboardShell username={session.username}>{children}</DashboardShell>;
}
