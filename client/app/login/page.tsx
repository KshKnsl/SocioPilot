"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleNotch } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("sp_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleAuth = async (type: "login" | "register") => {
    setLoading(true);
    try {
      const data = type === "login" 
        ? await login({ email, password }) 
        : await register({ email, password });
      
      localStorage.setItem("sp_token", data.token);
      toast.success(`${type === "login" ? "Login" : "Registration"} Successful!`);
      router.push("/dashboard");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to SocioPilot</CardTitle>
          <CardDescription>Sign in to manage your brands and generate content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <TabsContent value="login" className="mt-4">
              <Button 
                className="w-full" 
                onClick={() => handleAuth("login")} 
                disabled={loading || !email || !password}
              >
                {loading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              <Button 
                className="w-full" 
                onClick={() => handleAuth("register")} 
                disabled={loading || !email || !password}
              >
                {loading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
