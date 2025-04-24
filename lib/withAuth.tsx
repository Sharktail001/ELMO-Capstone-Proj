"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import React from "react";

export default function withAuth<P extends React.PropsWithChildren<{}>>(Component: React.ComponentType<P>) {
  return function ProtectedPage(props: P) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (isAuthenticated) {
        setLoading(false);
      } else {
        router.push("/");
      }
    }, [isAuthenticated, router]);

    if (loading) return <p>Loading...</p>;

    return <Component {...props} />;
  };
}
