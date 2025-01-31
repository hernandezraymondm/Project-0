import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUserStats() {
  const totalUsers = await prisma.user.count();
  const verifiedUsers = await prisma.user.count({
    where: { isEmailVerified: true },
  });
  return { totalUsers, verifiedUsers };
}

export async function UserStats() {
  const { totalUsers, verifiedUsers } = await getUserStats();

  return (
    <Card className="card h-full flex flex-col">
      <CardHeader>
        <CardTitle className="card-title">User Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 flex-grow">
        <div className="card-content">
          <p className="text-primary w-[80%] text-sm">Total Users</p>
          <p className="text-2xl font-bold text-primary">
            {totalUsers}
          </p>
        </div>
        <div className="card-content">
          <p className="text-primary text-sm">Verified Users</p>
          <p className="text-2xl font-bold text-primary">
            {verifiedUsers}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
