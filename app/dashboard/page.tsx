import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "jsonwebtoken";
import { UserStats } from "./user-stats";
import { Setup2FA } from "@/components/setup-2fa";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <UserStats />
        </div>
        <div>
          <Setup2FA />
        </div>
      </div>
    </div>
  );
}
