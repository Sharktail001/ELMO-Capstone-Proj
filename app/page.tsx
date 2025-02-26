
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/test.html"); // Redirect to test.html
  }, []);

  return <p>Redirecting...</p>;
}
