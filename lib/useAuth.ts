import { useEffect, useState } from "react";
import { getCurrentUser } from "@aws-amplify/auth";
import type { AuthUser } from "@aws-amplify/auth"; // Import AuthUser type

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const authUser = await getCurrentUser();
        setUser(authUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  return { user, loading };
};
