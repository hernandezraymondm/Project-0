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
      <CardContent className="flex flex-col gap-4 flex-grow">
        <div className="flex justify-between items-start gap-2 text-sm">
          <p className="text-primary w-[80%]">Total Users</p>
          <p className=" text-primary">{totalUsers}</p>
        </div>
        <div className="flex justify-between items-start gap-2 text-sm">
          <p className="text-primary">Verified Users</p>
          <p className=" text-primary">{verifiedUsers}</p>
        </div>
      </CardContent>
    </Card>
  );
}
