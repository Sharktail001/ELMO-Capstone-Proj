import { useEffect, useState } from "react";
import { getCurrentUser, signOut, fetchUserAttributes } from "@aws-amplify/auth";
import type { AuthUser } from "@aws-amplify/auth";

interface ExtendedUser extends AuthUser {
  name?: string;
  email?: string;
  avatar?: string; // Add more attributes if needed
}

export const useAuth = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const authUser = await getCurrentUser();
        const attributes = await fetchUserAttributes(); // Get user attributes
        setUser({
          ...authUser,
          name: attributes.name || "Unknown",
          email: attributes.email || "No email",
          avatar: attributes.picture || "", // Cognito can store a profile picture URL under "picture"
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const logout = async () => {
    try {
      await signOut();
      
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  return { user, loading, logout };
};
