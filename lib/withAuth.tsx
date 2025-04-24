"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import React from "react";

export default function withAuth<P extends React.PropsWithChildren<{}>>(Component: React.ComponentType<P>) {
  return function ProtectedPage(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/"); // Redirect to the main page if not authenticated
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return <p>Loading...</p>; // Show a loading indicator while checking auth state
    }

    return <Component {...props} />;
  };
}
