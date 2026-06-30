import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await checkAuth();
  if (!authed) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
