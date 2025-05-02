"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/lib/amplifyConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Hub } from '@aws-amplify/core';
import { signInWithRedirect, getCurrentUser, AuthUser } from "aws-amplify/auth";
// import { googleSignIn } from '../lib/amplifyConfig'; // Adjust the import path as necessary

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const { login } = useAuth();

  const router = useRouter();

  // useEffect(() => {
  //   const listener = ({ payload }: { payload: { event: string } }) => {
  //     if (payload.event === 'signIn') {
  //       login();
  //       router.push('/explore');
  //     }
  //   };

  //   Hub.listen('auth', listener);
  //   const unsubscribe = Hub.listen('auth', listener);
  //   return () => unsubscribe();
  // }, []);

  Hub.listen("auth", async ({ payload }) => {
    switch (payload.event) {
      case "signInWithRedirect":
        const user = await getCurrentUser();
        console.log(user.username);
        break;
      case "signInWithRedirect_failure":
        // handle sign in failure
        break;
      case "customOAuthState":
        const state = payload.data; // this will be customState provided on signInWithRedirect function
        console.log(state);
        break;
    }
  });

  const handleSignInClick = async(customState: string) => {
    signInWithRedirect({
      provider: "Google",
      customState
    });
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Reset error state
  
    try {
      const user = await signInUser(username, password);
      if (user) {
        login();
        router.push("/explore");
      } else {
        throw new Error("Login failed. No user session found.");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred.";
      setError(errorMessage);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleLogin}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const errorElement = document.getElementById("email-error");
              const inputElement = e.target;
              if (errorElement) {
                if (!emailRegex.test(e.target.value)) {
                  errorElement.textContent =
                    "Please enter a valid email address";
                  inputElement.classList.add("border-red-500");
                } else {
                  errorElement.textContent = "";
                  inputElement.classList.remove("border-red-500");
                }
              }
            }}
            required
            className="border"
          />
          <div id="email-error" className="text-red-500 text-sm"></div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10 border"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {error === "Incorrect username or password." && (
            <div className="text-red-500 text-sm">{error}</div>
          )}{" "}
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        {/* <Button variant="outline" className="w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.9 0 6.6 1.6 8.1 2.9l6-6C34.8 3.5 29.9 1 24 1 14.8 1 7.1 6.6 3.9 14.4l7.1 5.5C12.8 14.1 17.9 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.2-2.5 5.9-5.3 7.7l7.1 5.5c4.1-3.8 6.5-9.4 6.5-15.7z"
            />
            <path
              fill="#FBBC05"
              d="M10.9 28.9c-1-3.2-1-6.6 0-9.8l-7.1-5.5C1.1 17.1 0 20.5 0 24s1.1 6.9 3.8 10.4l7.1-5.5z"
            />
            <path
              fill="#34A853"
              d="M24 47c5.9 0 10.8-1.9 14.4-5.1l-7.1-5.5c-2 1.4-4.5 2.2-7.3 2.2-6.1 0-11.2-4.1-13-9.7l-7.1 5.5C7.1 41.4 14.8 47 24 47z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Login with Google
        </Button> */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSignInClick("customState")}
          // onClick={async () => {googleSignIn();}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
            className="mr-2"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.9 0 6.6 1.6 8.1 2.9l6-6C34.8 3.5 29.9 1 24 1 14.8 1 7.1 6.6 3.9 14.4l7.1 5.5C12.8 14.1 17.9 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.2-2.5 5.9-5.3 7.7l7.1 5.5c4.1-3.8 6.5-9.4 6.5-15.7z"
            />
            <path
              fill="#FBBC05"
              d="M10.9 28.9c-1-3.2-1-6.6 0-9.8l-7.1-5.5C1.1 17.1 0 20.5 0 24s1.1 6.9 3.8 10.4l7.1-5.5z"
            />
            <path
              fill="#34A853"
              d="M24 47c5.9 0 10.8-1.9 14.4-5.1l-7.1-5.5c-2 1.4-4.5 2.2-7.3 2.2-6.1 0-11.2-4.1-13-9.7l-7.1 5.5C7.1 41.4 14.8 47 24 47z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Login with Google
        </Button>
      </div>
    </form>
  );
}
