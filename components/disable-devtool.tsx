"use client";

import { useEffect } from "react";
import DisableDevtool from "disable-devtool";

export default function DisableDevTools() {
  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        alert("DevTools are disabled.");
        window.location.href = "/restricted"; // Redirect to a restricted page
      },
      interval: 1000, // Check for DevTools every second
    });
  }, []);

  return null; // This component doesn't render anything
}
