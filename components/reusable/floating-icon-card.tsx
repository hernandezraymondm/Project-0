import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface FloatingIconCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral" | "overflow";
  iconColor?: string;
  iconBgColor?: string;
}

export default function FloatingIconCard({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  iconColor = "text-white",
  iconBgColor = "bg-purple-600",
}: FloatingIconCardProps) {
  const textColor = {
    increase: "text-emerald-400",
    decrease: "text-red-400",
    neutral: "text-amber-400",
    overflow: "text-purple-400",
  }[changeType];

  const changePrefix =
    changeType === "increase" ? "↑" : changeType === "decrease" ? "↓" : "";

  return (
    <Card className="relative w-full border-none bg-card pt-8 shadow-md">
      <div
        className={`absolute -top-6 left-1/2 -translate-x-1/2 ${iconBgColor} card-icon flex h-14 w-14 items-center justify-center rounded-full border-4 border-background`}
      >
        <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={3} />
      </div>
      <CardContent className="flex items-end justify-between">
        <div>
          <h3 className="font-bold text-muted-foreground">{title}</h3>
          <span
            className={`${textColor} text-nowrap text-sm`}
          >{`${changePrefix} ${change}`}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
