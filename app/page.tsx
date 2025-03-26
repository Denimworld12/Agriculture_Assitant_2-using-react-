"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, ShoppingBag, Tractor, Newspaper, Users, BarChart4, ChevronRight } from "lucide-react"
import Script from "next/script"

export default function Home() {
  // Add this state at the top of the component
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    setIsLoggedIn(!!token)
  }, [])

  // Add a login prompt after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("auth-token")
      if (!token) {
        setShowLoginPrompt(true)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  // Custom style to override any text decoration
  const linkStyle = {
    textDecoration: 'none'
  }

  return (
    <MainLayout>
      <style jsx global>{`
        a {
          text-decoration: none !important;
        }
      `}</style>

      {/* Bootstrap Scripts */}
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      {/* Carousel Section */}
      <section className="mb-12">
        <div className="container mx-auto px-4 py-4">
          <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div className="carousel-inner rounded-lg overflow-hidden">
              <div className="carousel-item active">
                <Image
                  src="/Rabi_Abhiyan_21102024.jpg"
                  className="d-block w-100"
                  alt="National Conference on Agriculture - Rabi Campaign 2024"
                  width={500}
                  height={300}
                />
                <div className="carousel-caption d-none d-md-block">
                  {/* Caption content can be added here if needed */}
                </div>
              </div>
              <div className="carousel-item">
                <Image
                  src="/Krishi_DSS_2_0.jpg"
                  className="d-block w-100"
                  alt="Krishi DSS 2.0"
                  width={500}
                  height={300}
                />
                <div className="carousel-caption d-none d-md-block">
                  {/* Caption content can be added here if needed */}
                </div>
              </div>
              <div className="carousel-item">
                <Image
                  src="/Krishi_Nivesh_0.jpg"
                  className="d-block w-100"
                  alt="Krishi Nivesh Portal Launch"
                  width={500}
                  height={300}
                />
                <div className="carousel-caption d-none d-md-block">
                  {/* Caption content can be added here if needed */}
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* User/Farmer Tabs Section */}
      <section className="py-16 bg-green-50/90 dark:bg-green-900/20 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Choose Your Path</h2>

          <Tabs defaultValue="user" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="user">I'm a Consumer</TabsTrigger>
              <TabsTrigger value="farmer">I'm a Farmer</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-700">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium">Buy Fresh Produce</h3>
                      <p className="text-muted-foreground">
                        Purchase crops directly from farmers at competitive prices
                      </p>
                      <Link href="/market" className="text-green-700 flex items-center" style={linkStyle}>
                        Browse Marketplace <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-700">
                        <TrendingUp className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium">Market Prices</h3>
                      <p className="text-muted-foreground">
                        Check current and historical crop prices to make informed decisions
                      </p>
                      <Link href="/market/prices" className="text-green-700 flex items-center" style={linkStyle}>
                        View Price Trends <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-700">
                        <Newspaper className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium">Farming Insights</h3>
                      <p className="text-muted-foreground">
                        Access agricultural news and government scheme information
                      </p>
                      <Link href="/news" className="text-green-700 flex items-center" style={linkStyle}>
                        Read Latest News <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Link href="/signup" style={linkStyle}>
                  <Button size="lg" className="bg-green-700 hover:bg-green-800">
                    Create Consumer Account
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="farmer" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-700">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium">Sell Your Crops</h3>
                      <p className="text-muted-foreground">List your produce directly to consumers without middlemen</p>
                      <Link href="/farmer/sell" className="text-green-700 flex items-center" style={linkStyle}>
                        Start Selling <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-700">
                        <Tractor className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium">Rent Equipment</h3>
                      <p className="text-muted-foreground">
                        Access farming tools, tractors, and equipment at affordable rates
                      </p>
                      <Link href="/farmer/equipment" className="text-green-700 flex items-center" style={linkStyle}>
                        View Equipment <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-green-100 text-green-700">
                        <Newspaper className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium">Market Price Trends</h3>
                      <p className="text-muted-foreground">Stay updated with agricultural prices and market trends</p>
                      <Link href="/market/prices" className="text-green-700 flex items-center" style={linkStyle}>
                        View Trends <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Link href="/farmer/register" style={linkStyle}>
                  <Button size="lg" className="bg-green-700 hover:bg-green-800">
                    Register as Farmer
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-green-50/90 dark:bg-green-900/20 mb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Agriculture Assistant?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers unique benefits for both farmers and consumers, creating a sustainable agricultural
              ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Direct Connection</h3>
              <p className="text-muted-foreground">
                Connect farmers directly with consumers, eliminating middlemen and ensuring better prices for both
                parties.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Newspaper className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Latest Information</h3>
              <p className="text-muted-foreground">
                Access up-to-date agricultural news, government schemes, and market trends to make informed decisions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Tractor className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Equipment Access</h3>
              <p className="text-muted-foreground">
                Farmers can rent necessary equipment and tools, reducing capital investment and improving productivity.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Transparent Marketplace</h3>
              <p className="text-muted-foreground">
                Our marketplace provides complete transparency with detailed information about crops, prices, and
                farmers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <BarChart4 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Price Insights</h3>
              <p className="text-muted-foreground">
                Track historical crop prices and receive alerts for the best buying and selling opportunities.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Multilingual Support</h3>
              <p className="text-muted-foreground">
                Access the platform in multiple languages including English, Hindi, and Marathi for wider accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Market Prices Preview */}
      <section className="py-16 bg-green-50/90 dark:bg-green-900/20 mb-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* News Preview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Agricultural News</h2>
                <Link href="/news" className="text-green-700 hover:text-green-800 flex items-center" style={linkStyle}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={`/soilsch1.jpg?height=96&width=96&text=News ${item}`}
                        alt={`News ${item}`}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">New Irrigation Scheme Announced for Maharashtra Farmers</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        The government has launched a new subsidy program for drip irrigation systems...
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>March 15, 2025</span>
                        <span className="mx-2">•</span>
                        <Link href={`/news/${item}`} className="text-green-700 hover:text-green-800" style={linkStyle}>
                          Read More 
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Prices Preview */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Current Market Prices</h2>
                <Link href="/market/prices" className="text-green-700 hover:text-green-800 flex items-center" style={linkStyle}>
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-4 bg-green-100 dark:bg-green-900/30 p-3">
                  <div className="font-medium">Crop</div>
                  <div className="font-medium">Min Price</div>
                  <div className="font-medium">Max Price</div>
                  <div className="font-medium">Trend</div>
                </div>

                {[
                  { crop: "Rice", min: "₹2,100", max: "₹2,400", trend: "up" },
                  { crop: "Wheat", min: "₹1,800", max: "₹2,200", trend: "down" },
                  { crop: "Soybean", min: "₹3,600", max: "₹4,100", trend: "up" },
                  { crop: "Cotton", min: "₹5,200", max: "₹5,800", trend: "stable" },
                  { crop: "Sugarcane", min: "₹280", max: "₹320", trend: "up" },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-4 p-3 border-b last:border-b-0 dark:border-gray-700">
                    <div>{item.crop}</div>
                    <div>{item.min}</div>
                    <div>{item.max}</div>
                    <div>
                      {item.trend === "up" && (
                        <span className="text-green-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" /> Rising
                        </span>
                      )}
                      {item.trend === "down" && (
                        <span className="text-red-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 rotate-180" /> Falling
                        </span>
                      )}
                      {item.trend === "stable" && (
                        <span className="text-gray-600 flex items-center">
                          <span className="h-4 w-4 mr-1">→</span> Stable
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white mb-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Agricultural Experience?</h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto mb-8">
            Join thousands of farmers and consumers already benefiting from our platform. Start buying, selling, and
            accessing valuable agricultural resources today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" style={linkStyle}>
              <Button size="lg" className="bg-white text-green-800 hover:bg-green-100">
                Create Account
              </Button>
            </Link>
            <Link href="/about" style={linkStyle}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Add this dialog at the bottom of the component, before the closing MainLayout tag */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Login to Continue</h3>
            <p className="text-muted-foreground mb-4">
              Create an account or login to access all features of Agriculture Assistant.
            </p>
            <div className="flex gap-3">
              <Link href="/login" style={linkStyle}>
                <Button className="flex-1 bg-green-700 hover:bg-green-800">Login Now</Button>
              </Link>
              <Link href="/signup" style={linkStyle}>
                <Button variant="outline" className="flex-1">
                  Sign Up
                </Button>
              </Link>
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

