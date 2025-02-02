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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-grow">
        <div className="flex justify-between items-start gap-2 text-sm">
          <p>Total Users</p>
          <p>{totalUsers}</p>
        </div>
        <div className="flex justify-between items-start gap-2 text-sm">
          <p>Verified Users</p>
          <p>{verifiedUsers}</p>
        </div>
      </CardContent>
    </Card>
  );
}
