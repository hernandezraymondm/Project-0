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
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">
        User Statistics
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-gray-300">Total Users</p>
          <p className="text-3xl font-bold text-white">{totalUsers}</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-gray-300">Verified Users</p>
          <p className="text-3xl font-bold text-white">{verifiedUsers}</p>
        </div>
      </div>
    </div>
  );
}
