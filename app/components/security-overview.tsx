import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLastLogin } from "@/common/utils/last-login";

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
      value: log?.timestamp ? formatLastLogin(new Date(log.timestamp)) : "N/A",
    },
  ];

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle className="card-title">Security Overview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {securityData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start gap-2 text-sm"
          >
            <p className="text-primary text-nowrap">{item.label}</p>
            <p className="text-primary text-right">{item.value || "N/A"}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
