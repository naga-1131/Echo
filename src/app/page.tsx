
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EchoSyncLogo } from "@/components/icons";
import { mockUsers } from "@/lib/mock-data";
import Link from "next/link";
import { useUser } from "./dashboard/components/user-provider";

export default function LoginPage() {
  const [email, setEmail] = useState("jane.doe@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = () => {
    const userToLogin = mockUsers.find(u => u.email === email);
    if (userToLogin) {
      login(userToLogin.id);
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <EchoSyncLogo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome to EchoSync</CardTitle>
          <CardDescription>The Eco-Social Network with AI & Maps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="button" className="w-full" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="outline" type="button" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
