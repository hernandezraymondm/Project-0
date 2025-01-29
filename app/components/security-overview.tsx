import { PrismaClient } from "@prisma/client";
import { formatDateTime } from "@/lib/utils";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

async function getUserInfo() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;
  if (!token) {
    throw new Error("No token found");
  }
  const decoded = verify(token, process.env.JWT_SECRET!) as {
    userId: string;
  };
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  const log = await prisma.log.findFirst({
    where: {
      userId: decoded.userId,
      action: "Logged in",
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return { user, log };
}

export async function SecurityOverview() {
  const { user, log } = await getUserInfo();

  const securityData = [
    { label: "Email Verified", value: user?.isEmailVerified ? "Yes" : "No" },
    { label: "2FA Enabled", value: user?.twoFactorEnabled ? "Yes" : "No" },
    {
      label: "Last Login",
      value: log?.timestamp
        ? formatDateTime(log.timestamp.toDateString())
        : "N/A",
    },
  ];

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 font-jura">
        Security Overview
      </h2>

      <div className="space-y-4">
        {securityData.map((item, index) => (
          <div key={index} className="flex justify-between items-start gap-2">
            <p className="text-gray-300 text-nowrap">{item.label}</p>
            <p className="text-white font-semibold text-right">
              {item.value || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
