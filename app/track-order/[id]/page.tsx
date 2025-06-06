"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Truck, Package, ShoppingBag, MapPin, Phone, Mail } from "lucide-react"

// Define types for our data
interface OrderItem {
  name: string
  quantity: number
  price: number
  image: string
}

interface TrackingStep {
  status: string
  date: string
  completed: boolean
  description: string
}

interface Farmer {
  id?: number
  name: string
  phone: string
  email: string
  address: string
  image: string
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
  status: string
  trackingSteps: TrackingStep[]
  farmer?: Farmer
  farmers?: Farmer[]
}

// Fallback mock order data if needed
const MOCK_ORDERS: Record<string, Order> = {
  ORD12345: {
    id: "ORD12345",
    date: "2023-04-10",
    items: [
      {
        name: "Organic Rice",
        quantity: 10,
        price: 45,
        image: "/placeholder.svg?height=100&width=100&text=Rice",
      },
      {
        name: "Fresh Tomatoes",
        quantity: 5,
        price: 30,
        image: "/placeholder.svg?height=100&width=100&text=Tomatoes",
      },
    ],
    total: 600,
    status: "Delivered",
    trackingSteps: [
      {
        status: "Order Placed",
        date: "2023-04-10 10:30 AM",
        completed: true,
        description: "Your order has been placed successfully.",
      },
      {
        status: "Order Confirmed",
        date: "2023-04-10 11:15 AM",
        completed: true,
        description: "Your order has been confirmed by the farmer.",
      },
      {
        status: "Preparing for Delivery",
        date: "2023-04-11 09:00 AM",
        completed: true,
        description: "The farmer is preparing your order for delivery.",
      },
      {
        status: "Out for Delivery",
        date: "2023-04-12 10:30 AM",
        completed: true,
        description: "Your order is out for delivery.",
      },
      {
        status: "Delivered",
        date: "2023-04-12 03:45 PM",
        completed: true,
        description: "Your order has been delivered successfully.",
      },
    ],
    farmer: {
      name: "Rajesh Patel",
      phone: "+91 98765 43210",
      email: "rajesh@example.com",
      address: "123 Farm Road, Thane, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=RP",
    },
  },
}

export default function TrackOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [primaryFarmer, setPrimaryFarmer] = useState<Farmer | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Add a small delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Get orders from localStorage
        const ordersData = localStorage.getItem("orders")
        let orders: Order[] = []

        if (ordersData) {
          orders = JSON.parse(ordersData)
        }

        // Find the order with the matching ID
        const foundOrder = orders.find((o) => o.id === orderId)

        if (foundOrder) {
          setOrder(foundOrder)
          
          // Handle farmer information
          if (foundOrder.farmer) {
            // Single farmer case
            setPrimaryFarmer(foundOrder.farmer)
          } else if (foundOrder.farmers && foundOrder.farmers.length > 0) {
            // Multiple farmers case - use the first one as primary
            setPrimaryFarmer(foundOrder.farmers[0])
          } else {
            // No farmer info available
            setPrimaryFarmer({
              name: "Unknown Farmer",
              phone: "Contact store",
              email: "info@farmmarket.com",
              address: "Farm Market HQ",
              image: "/placeholder.svg?height=100&width=100&text=?",
            })
          }
        } else {
          // Fallback to mock data if available
          if (MOCK_ORDERS[orderId]) {
            setOrder(MOCK_ORDERS[orderId])
            setPrimaryFarmer(MOCK_ORDERS[orderId].farmer || null)
          } else {
            setError("Order not found")
          }
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err)
        setError("Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Order Details...</h1>
        </div>
      </MainLayout>
    )
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Link href="/profile">
            <Button className="bg-green-700 hover:bg-green-800">Go to My Orders</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Track Order</h1>
            <p className="text-muted-foreground">
              Order #{order.id} • Placed on {new Date(order.date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/profile">
              <Button variant="outline">Back to My Orders</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                  <div className="space-y-8">
                    {order.trackingSteps.map((step: TrackingStep, index: number) => (
                      <div key={index} className="relative pl-10">
                        <div
                          className={`absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                          }`}
                        >
                          {step.completed ? (
                            <Check className="h-5 w-5" />
                          ) : index === 0 ? (
                            <ShoppingBag className="h-5 w-5" />
                          ) : index === 1 ? (
                            <Check className="h-5 w-5" />
                          ) : index === 2 ? (
                            <Package className="h-5 w-5" />
                          ) : index === 3 ? (
                            <Truck className="h-5 w-5" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-medium">{step.status}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{step.date || "Pending"}</p>
                          <p className="text-sm">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: OrderItem, index: number) => (
                    <div key={index} className="flex gap-4 py-2 border-b last:border-b-0">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={item.image || "/placeholder.svg"} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {primaryFarmer && (
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={primaryFarmer.image || "/placeholder.svg"}
                        alt={primaryFarmer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{primaryFarmer.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {primaryFarmer.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {primaryFarmer.email}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      {primaryFarmer.address}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full bg-green-700 hover:bg-green-800">Contact Farmer</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {order.farmers && order.farmers.length > 1 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Additional Farmers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.farmers.slice(1).map((farmer, index) => (
                      <div key={index} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={farmer.image || "/placeholder.svg"}
                            alt={farmer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{farmer.name}</h3>
                          <p className="text-xs text-muted-foreground">{farmer.phone}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Contact
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className={`${primaryFarmer ? "mt-6" : ""}`}>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your order, our support team is here to help.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}