"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function useAuthGuard() {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");

    if (!storedToken) {
      // Not authenticated: redirect to login with current path
      router.replace(`/login?redirect=${pathname}`);
    } else {
      setToken(storedToken);
      setIsReady(true); // Allow page to render
    }
  }, [router, pathname]);

  return { isReady, token };
}
