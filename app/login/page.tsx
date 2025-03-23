"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("user")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Show login prompt after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginPrompt(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Mock login - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store auth token in localStorage
      localStorage.setItem("auth-token", "mock-token-12345")
      localStorage.setItem("user-type", userType)

      // Redirect based on user type
      if (userType === "farmer") {
        router.push("/farmer/dashboard")
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">Login to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="user" onValueChange={setUserType}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="user">Consumer</TabsTrigger>
                  <TabsTrigger value="farmer">Farmer</TabsTrigger>
                </TabsList>

                <form onSubmit={handleLogin}>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-sm text-green-700 hover:text-green-800">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-700 hover:text-green-800 font-medium">
                  Sign up
                </Link>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                By logging in, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Login to Continue</h3>
            <p className="text-muted-foreground mb-4">
              Create an account or login to access all features of Agriculture Assistant.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1 bg-green-700 hover:bg-green-800" onClick={() => setShowLoginPrompt(false)}>
                Login Now
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowLoginPrompt(false)
                  router.push("/signup")
                }}
              >
                Sign Up
              </Button>
            </div>
            <Button variant="ghost" className="w-full mt-2" onClick={() => setShowLoginPrompt(false)}>
              Continue as Guest
            </Button>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

