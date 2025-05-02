"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      router.replace(`/login?redirect=${pathname}`);
    } else {
      setIsAuth(true);
      setIsReady(true);
    }
  }, [router, pathname]);

  if (!isReady) return <div>Loading...</div>;

  return isAuth ? <>{children}</> : null;
}
