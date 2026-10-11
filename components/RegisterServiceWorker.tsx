"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((r) => r.unregister())),
        )
        .catch(() => {
          // Registration cleanup is best-effort; ignore and reload.
        });

      if ("caches" in window) {
        void caches
          .keys()
          .then((keys) =>
            Promise.all(
              keys
                .filter((key) => key.startsWith("serwist-"))
                .map((key) => caches.delete(key)),
            ),
          )
          .catch(() => {
            // Cache cleanup is best-effort too.
          });
      }

      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
  }, []);

  return null;
}
