"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function withAuth(Component: React.FC) {
  return function ProtectedPage(props: any) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log("auth is:", isAuthenticated);
      if (isAuthenticated) {
        setLoading(false);
      } else {
        // console.log("Redirecting to /");
        router.push("/");
      }
    }, [isAuthenticated, router]);

    if (loading) return <p>Loading...</p>;

    return <Component {...props} />;
  };
}   