import { useState } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/amplifyConfig";

export function SignupForm({
  className,
  onSusChange,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { onSusChange?: (status: boolean) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [Sus, setSus] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const user = await signUpUser(fullName, password, { email });
      if (user) {
        setSus(true);
        if (onSusChange) {
          onSusChange(true);
        }
      }
      console.log("User signed up successfully:", user);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create a new account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to create a new account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
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
        </Button>
      </div>
    </form>
  );
}
