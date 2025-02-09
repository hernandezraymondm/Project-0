"use client";

import DisableDevtool from "disable-devtool";
import { useEffect } from "react";

export default function useDisableDevTools() {
  useEffect(() => {
    DisableDevtool({
      ondevtoolopen: () => {
        alert("DevTools are disabled.");
        window.location.href = "/restricted"; // Redirect to a restricted page
      },
      interval: 1000, // Check for DevTools every second
    });
  }, []);
}
