"use client";

import React from 'react';
import AuthenticationPage from "./authentication/page";
import DashboardPage from "./dashboard/page";
import { AuthProvider, useAuth } from "../lib/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <DashboardPage /> : <AuthenticationPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}


// "use client";

// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import AuthenticationPage from "./authentication/page";
// // import DashboardPage from "./dashboard/page";
// import { AuthProvider, useAuth } from "../lib/AuthContext";

// const Home = () => {
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     console.log("auth is:", isAuthenticated);
//     if (isAuthenticated) {
//       router.push('/dashboard');
//     }
//   }, [isAuthenticated, router]);

//   return isAuthenticated ? <AuthenticationPage /> : null;
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <AuthenticationPage />
//     </AuthProvider>
//   );
// }
