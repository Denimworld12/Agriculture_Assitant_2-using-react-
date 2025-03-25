"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, MapPin, Mail, Phone, Edit, Check, User } from "lucide-react"

export default function PortfolioPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Try to get user data from localStorage (this is temporary until API is fully connected)
    const storedUserData = localStorage.getItem("user-data")
    
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData))
      } catch (err) {
        console.error("Failed to parse user data", err)
      }
    } else {
      // For testing purposes - normally you would redirect to login
      // In production, this would be:
      // router.push("/login?redirect=/portfolio")
      
      // For testing, create dummy data
      const dummyData = {
        name: localStorage.getItem("fullName") || "New User",
        email: localStorage.getItem("email") || "user@example.com",
        phone: localStorage.getItem("mobile") || "Not provided",
        role: localStorage.getItem("userType") || "user"
      }
      
      setUserData(dummyData)
    }
    
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Portfolio...</h1>
        </div>
      </MainLayout>
    )
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="mb-6">You need to login to view your portfolio</p>
          <Link href="/login?redirect=/portfolio">
            <Button className="bg-green-700 hover:bg-green-800">Login</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
        <p className="text-muted-foreground mb-8">Welcome to Agriculture Assistant</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4 bg-green-100">
                    {userData.profileImage ? (
                      <Image
                        src={userData.profileImage}
                        alt={userData.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <User className="h-16 w-16 text-green-700" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.role === "farmer" ? "Farmer" : "Consumer"}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{userData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{userData.email}</p>
                    </div>
                  </div>

                  {userData.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{userData.address}</p>
                      </div>
                    </div>
                  )}

                  {userData.role === "farmer" && userData.farmDetails && (
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Farm Details</h3>

                      <div className="space-y-2">
                        {userData.farmDetails.size && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Farm Size:</span>
                            <span>{userData.farmDetails.size}</span>
                          </div>
                        )}
                        {userData.farmDetails.crops && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Main Crops:</span>
                            <span>{userData.farmDetails.crops}</span>
                          </div>
                        )}
                        {userData.farmDetails.location && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{userData.farmDetails.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button variant="outline" className="w-full" onClick={() => router.push("/profile")}>
                      Complete Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Welcome to Agriculture Assistant</CardTitle>
                <CardDescription>
                  Your account has been created successfully! Here's what you can do now:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.role === "farmer" ? (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Farmer Features</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>List your agricultural products for sale</li>
                          <li>Rent farming equipment at affordable rates</li>
                          <li>Connect directly with consumers</li>
                          <li>Access government schemes and subsidies</li>
                          <li>Track market prices for better planning</li>
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Link href="/farmer/dashboard">
                          <Button className="bg-green-700 hover:bg-green-800">Go to Farmer Dashboard</Button>
                        </Link>
                        <Link href="/market">
                          <Button variant="outline">Explore Marketplace</Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Consumer Features</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Purchase fresh produce directly from farmers</li>
                          <li>Track your orders and deliveries</li>
                          <li>Save favorite products and farmers</li>
                          <li>Access agricultural news and resources</li>
                          <li>Support local farmers and sustainable agriculture</li>
                        </ul>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <Link href="/market">
                          <Button className="bg-green-700 hover:bg-green-800">Browse Marketplace</Button>
                        </Link>
                        <Link href="/news">
                          <Button variant="outline">Agricultural News</Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Complete Your Profile</h3>
                    <p className="text-muted-foreground mb-4">
                      Add more details to your profile to make the most of our platform.
                    </p>
                    <Link href="/profile">
                      <Button variant="outline" size="sm">Update Profile</Button>
                    </Link>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Explore the Platform</h3>
                    <p className="text-muted-foreground mb-4">
                      Discover all the features and services available on Agriculture Assistant.
                    </p>
                    <Link href="/">
                      <Button variant="outline" size="sm">Go to Homepage</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 