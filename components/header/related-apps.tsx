import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { LayoutGrid, SquareDashedMousePointer } from "lucide-react";
import { Button } from "../ui/button";

// Related Applications Data
const relatedApplications = [
  {
    name: "Facebook Page",
    icon: <FaFacebookF className="h-6 w-6" />,
    color: "text-blue-500",
    link: "/home/home",
  },
  {
    name: "Instagram Page",
    icon: <FaInstagram className="h-6 w-6" />,
    color: "text-pink-500",
    link: "/dashboard/home",
  },
  {
    name: "Tiktok Page",
    icon: <FaTiktok className="h-6 w-6" />,
    color: "text-black",
    link: "/dashboard/home",
  },
];

export const RelatedApps = () => {
  return (
    <Popover>
      <PopoverTrigger asChild className="h-9 w-9">
        <Button variant="ghost" className="icon">
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3 p-4">
        <div className="flex items-center gap-3">
          <SquareDashedMousePointer />
          Related Applications
        </div>
        <div className="grid grid-cols-3 gap-3">
          {relatedApplications.map((app, index) => (
            <a
              key={index}
              href={app.link}
              className="flex flex-col items-center justify-center rounded-lg border bg-accent/60 p-3 text-center transition-colors hover:bg-accent"
            >
              <div className={app.color}>{app.icon}</div>
              <span className="mt-2 text-xs">{app.name}</span>
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
