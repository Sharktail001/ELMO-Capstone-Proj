"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/AuthContext";
import AuthenticationPage from "./authentication/page";
import ExistingUserLanding from "./onboarding/page"; // Or wherever your post-login page is
import { AuthProvider, useAuth } from "../lib/AuthContext";

export default function HomePage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading && isAuthenticated) {
      // Redirect to a user-specific page once authenticated
      router.push("/explore"); // Change this to whatever page you want after login
    }
  }, [loading, isAuthenticated, router]);

  return isAuthenticated ? (
    // You could also render a loading indicator while redirecting.
    null // This is an empty render during the redirect
  ) : (
    <AuthenticationPage />
    // <AuthProvider>
    //   <AuthenticationPage />
    // </AuthProvider>
  );
}

// "use client";

// import React from 'react';
// import AuthenticationPage from "./authentication/page";
// // import DashboardPage from "./dashboard/page";
// import Explore from "./explore/page";
// import { AuthProvider, useAuth } from "../lib/AuthContext";

// const Home = () => {
//   const { isAuthenticated } = useAuth();

//   return isAuthenticated ? <Explore /> : <AuthenticationPage />;
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <Home />
//     </AuthProvider>
//   );
// }