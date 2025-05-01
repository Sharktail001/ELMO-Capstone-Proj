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
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-6 w-6 border-4 border-gray-300 border-t-[#FF7E77] rounded-full animate-spin" />
          </div>
        </div>
      );
    }
    
    

    return <Component {...props} />;
  };
}
