"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ShoppingBag, Package, Truck, Check } from "lucide-react"

export default function TrackOrderPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Check if user is logged in and load orders
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    setIsLoggedIn(!!token)

    if (token) {
      // Load orders from localStorage
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      setOrders(savedOrders)
    }

    setLoading(false)
  }, [])

  // Filter orders based on search
  const filteredOrders = orders.filter((order) => order.id.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      router.push(`/track-order/${searchTerm.trim()}`)
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
        return <ShoppingBag className="h-5 w-5" />
      case "Order Confirmed":
        return <Check className="h-5 w-5" />
      case "Preparing for Delivery":
        return <Package className="h-5 w-5" />
      case "Out for Delivery":
        return <Truck className="h-5 w-5" />
      case "Delivered":
        return <Check className="h-5 w-5" />
      default:
        return <ShoppingBag className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Orders...</h1>
        </div>
      </MainLayout>
    )
  }

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your orders.</p>
          <Link href="/login?redirect=/track-order">
            <Button className="bg-green-700 hover:bg-green-800">Login Now</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Track Your Orders</h1>
        <p className="text-muted-foreground mb-8">View and track the status of your orders</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Find Order</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter order number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                    Track Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Your Orders</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start shopping to see your order history.
                </p>
                <Link href="/market">
                  <Button className="bg-green-700 hover:bg-green-800">Browse Marketplace</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-2/3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`text-sm px-2 py-1 rounded ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "Order Placed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <div className="space-y-1 mb-4">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Items:</span> {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Total:</span> ₹{order.total}
                            </div>
                          </div>

                          <Link href={`/track-order/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>

                        <div className="bg-muted/20 p-4 md:w-1/3 flex items-center">
                          <div className="w-full">
                            <h4 className="text-sm font-medium mb-2">Order Status</h4>
                            <div className="relative">
                              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                              {order.trackingSteps.slice(0, 3).map((step: { completed: boolean, status: string }, index: number) => (
                                <div key={index} className="relative pl-8 pb-4 last:pb-0">
                                  <div
                                    className={`absolute left-0 top-0 h-5 w-5 rounded-full flex items-center justify-center ${
                                      step.completed
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                                    }`}
                                  >
                                    {step.completed ? <Check className="h-3 w-3" /> : getStatusIcon(step.status)}
                                  </div>

                                  <div className="text-xs">
                                    <p className={step.completed ? "font-medium" : "text-muted-foreground"}>
                                      {step.status}
                                    </p>
                                  </div>
                                </div>
                              ))}

                              {order.trackingSteps.length > 3 && (
                                <div className="text-xs text-center text-muted-foreground">
                                  <Link href={`/track-order/${order.id}`}>View more</Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

