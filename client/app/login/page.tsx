"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { AuthAction } from "@/lib/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleAuth = async (type: AuthAction) => {
    setLoading(true);
    try {
      if (type === "login")
        await login(email, password);
      else
        await register(email, password);
      toast.success(`${type === "login" ? "Login" : "Registration"} Successful!`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-8">
      <div className="w-full max-w-lg border-2 border-black bg-background p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold">Welcome to SocioPilot</h3>
          <p className="text-muted-foreground">Sign in to manage your brands and generate content.</p>
        </div>
        <div className="p-0">
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
                {loading && <CircleNotchIcon className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </TabsContent>
            <TabsContent value="register" className="mt-4">
              <Button 
                className="w-full" 
                onClick={() => handleAuth("register")} 
                disabled={loading || !email || !password}
              >
                {loading && <CircleNotchIcon className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
