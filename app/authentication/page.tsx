"use client";

import { GalleryVerticalEnd } from "lucide-react";
// import Image from "next/image";
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            ELMO Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
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
              href="/dashboard"
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded text-center block"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {/* <Image
          src="/placeholder.svg"
          alt="Image"
          width={500}
          height={500}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          layout="responsive"
        /> */}
      </div>
    </div>
  );
}
