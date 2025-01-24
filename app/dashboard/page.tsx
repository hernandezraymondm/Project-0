import { UserStats } from "./user-stats";
import { UpdateProfileForm } from "@/components/update-profile-form";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UserStats />
        <UpdateProfileForm />
      </div>
    </div>
  );
}
