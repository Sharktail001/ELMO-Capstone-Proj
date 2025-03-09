import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signOut } from "@aws-amplify/auth";
import type { AuthUser } from "@aws-amplify/auth"; // Import AuthUser type

// Define the AuthContext type
interface AuthContextType {
  user: AuthUser | null;
  logout: () => Promise<void>;
}

// Create context with proper type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function checkUser() {
      try {
        const authUser = await getCurrentUser();
        setUser(authUser);
      } catch {
        setUser(null);
      }
    }
    checkUser();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
