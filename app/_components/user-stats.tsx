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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4">
        <div className="flex items-start justify-between gap-2 text-sm">
          <p>Total Users</p>
          <p>{totalUsers}</p>
        </div>
        <div className="flex items-start justify-between gap-2 text-sm">
          <p>Verified Users</p>
          <p>{verifiedUsers}</p>
        </div>
      </CardContent>
    </Card>
  );
}
