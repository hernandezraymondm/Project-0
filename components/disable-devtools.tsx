// lib/components/DisableDevToolsClient.tsx

"use client";

import useDisableDevTools from "@/hooks/use-disable-devtools";

export default function DisableDevToolsProvider() {
  useDisableDevTools();
  return null; // This component doesn't render anything
}
