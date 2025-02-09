"use client";

import { useEffect } from "react";
import DisableDevtool from "disable-devtool";

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
