"use client";

import { Newspaper } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { useState } from "react";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [Sus, setSus] = useState(false);

  const handleSusChange = (status: boolean) => {
    setSus(status);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 md:p-10">
        <div className="flex justify-center mb-6">
          <a href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            ELMO
          </a>
        </div>

        {isLogin ? (
          <>
            <LoginForm />
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="underline underline-offset-4"
              >
                Sign up
              </button>
            </div>
          </>
        ) : (
          <>
            <SignupForm onSusChange={handleSusChange} />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="underline underline-offset-4"
              >
                Login
              </button>
            </div>
          </>
        )}

        <a
          href="/"
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded text-center block"
        >
          Admin Login
        </a>
      </div>
    </div>
  );
}
