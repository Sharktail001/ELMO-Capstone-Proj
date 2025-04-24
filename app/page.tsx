"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import AuthenticationPage from "./authentication/page";
import ExistingUserLanding from "./onboarding/page"; // Or wherever your post-login page is

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to a user-specific page once authenticated
      router.push("/explore"); // Change this to whatever page you want after login
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? (
    // You could also render a loading indicator while redirecting.
    null // This is an empty render during the redirect
  ) : (
    <AuthenticationPage />
  );
}
