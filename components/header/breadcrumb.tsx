"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export function BreadCrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList className="select-none flex-nowrap">
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const formattedSegment =
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {formattedSegment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// return (
//   <Breadcrumb>
//     <BreadcrumbList className="select-none flex-nowrap">
//       <BreadcrumbItem>
//         <BreadcrumbLink href="/">Home</BreadcrumbLink>
//       </BreadcrumbItem>

//       {pathSegments.map((segment, index) => {
//         const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
//         const isLast = index === pathSegments.length - 1;

//         return (
//           <React.Fragment key={href}>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               {isLast ? (
//                 <BreadcrumbPage>{segment}</BreadcrumbPage>
//               ) : (
//                 <BreadcrumbLink href={href}>
//                   {segment.charAt(0).toUpperCase() + segment.slice(1)}
//                 </BreadcrumbLink>
//               )}
//             </BreadcrumbItem>
//           </React.Fragment>
//         );
//       })}
//     </BreadcrumbList>
//   </Breadcrumb>
// );

// import { Slash } from "lucide-react";
// import { usePathname } from "next/navigation";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import Link from "next/link";

// export function BreadCrumb() {
//   const pathname = usePathname();

//   // Custom names for segments
//   const segmentNames: Record<string, string> = {
//     inventory: "Inventory Management",
//     supplies: "Supplies Overview",
//   };

//   // Split the pathname into segments
//   const pathSegments = pathname.split("/").filter(Boolean);

//   return (
//     <Breadcrumb>
//       <BreadcrumbList>
//         {/* Always show "Home" as the first breadcrumb */}
//         <BreadcrumbItem>
//           <BreadcrumbLink href="/">Home</BreadcrumbLink>
//         </BreadcrumbItem>

//         {/* Dynamically generate breadcrumb items */}
//         {pathSegments.map((segment, index) => {
//           const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
//           const isLast = index === pathSegments.length - 1;
//           const displayName =
//             segmentNames[segment] ||
//             segment.charAt(0).toUpperCase() + segment.slice(1);

//           return (
//             <React.Fragment key={href}>
//               <BreadcrumbSeparator>
//                 <Slash />
//               </BreadcrumbSeparator>
//               <BreadcrumbItem>
//                 {isLast ? (
//                   <BreadcrumbPage>{displayName}</BreadcrumbPage>
//                 ) : (
//                   <BreadcrumbLink asChild>
//                     <Link href={href}>{displayName}</Link>
//                   </BreadcrumbLink>
//                 )}
//               </BreadcrumbItem>
//             </React.Fragment>
//           );
//         })}
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// }
