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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">User Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Total Users</p>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
        <div>
          <p className="text-gray-600">Verified Users</p>
          <p className="text-3xl font-bold">{verifiedUsers}</p>
        </div>
      </div>
    </div>
  );
}
