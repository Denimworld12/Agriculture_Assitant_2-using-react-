"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, ShoppingBag, ArrowRight, Phone, Mail, MapPin, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock farmer data
const FARMERS = {
  "Rajesh Patel": {
    id: 101,
    name: "Rajesh Patel",
    phone: "+91 98765 43210",
    email: "rajesh@example.com",
    address: "123 Farm Road, Thane, Maharashtra",
    image: "/placeholder.svg?height=100&width=100&text=RP",
  },
  "Anita Sharma": {
    id: 102,
    name: "Anita Sharma",
    phone: "+91 87654 32109",
    email: "anita@example.com",
    address: "456 Vegetable Farm, Pune, Maharashtra",
    image: "/placeholder.svg?height=100&width=100&text=AS",
  },
  "Suresh Desai": {
    id: 103,
    name: "Suresh Desai",
    phone: "+91 76543 21098",
    email: "suresh@example.com",
    address: "789 Mango Orchard, Ratnagiri, Maharashtra",
    image: "/placeholder.svg?height=100&width=100&text=SD",
  },
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [checkoutFarmers, setCheckoutFarmers] = useState<any[]>([])
  const [orderId, setOrderId] = useState("")

  // Check if user is logged in and load cart items
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    setIsLoggedIn(!!token)

    if (token) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartItems(cart)

      // Get user data
      const data = JSON.parse(localStorage.getItem("user-data") || '{"name":"Guest"}')
      setUserData(data)
    }
  }, [])

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Update item quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Remove item from cart
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Handle checkout
  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    // Get unique farmers from cart items
    const farmers = [...new Set(cartItems.map((item) => item.farmer))].map((farmerName) => {
      // @ts-ignore
      return FARMERS[farmerName]
    })

    setCheckoutFarmers(farmers)
    setShowCheckoutDialog(true)
  }

  // Complete order
  const completeOrder = () => {
    // Generate order ID
    const newOrderId = "ORD" + Date.now().toString().slice(-6)
    setOrderId(newOrderId)

    // Create order object
    const order = {
      id: newOrderId,
      date: new Date().toISOString(),
      items: cartItems,
      total: calculateTotal(),
      status: "Order Placed",
      trackingSteps: [
        {
          status: "Order Placed",
          date: new Date().toLocaleString(),
          completed: true,
          description: "Your order has been placed successfully.",
        },
        {
          status: "Order Confirmed",
          date: "",
          completed: false,
          description: "Your order will be confirmed by the farmer.",
        },
        {
          status: "Preparing for Delivery",
          date: "",
          completed: false,
          description: "The farmer will prepare your order for delivery.",
        },
        {
          status: "Out for Delivery",
          date: "",
          completed: false,
          description: "Your order will be out for delivery.",
        },
        {
          status: "Delivered",
          date: "",
          completed: false,
          description: "Your order will be delivered to you.",
        },
      ],
      farmers: checkoutFarmers,
    }

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    orders.push(order)
    localStorage.setItem("orders", JSON.stringify(orders))

    // Clear cart
    localStorage.setItem("cart", "[]")
    setCartItems([])
    setShowCheckoutDialog(false)

    // Show success dialog
    setShowSuccessDialog(true)

    // Add notification
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    notifications.unshift({
      title: "Order Placed Successfully",
      message: `Your order #${newOrderId} has been placed successfully`,
      time: new Date().toLocaleString(),
      link: `/track-order/${newOrderId}`,
    })
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">Sold by {item.farmer}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                                className="w-16 h-7 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <div className="font-medium">₹{item.price * item.quantity}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 px-6 py-4">
                  <Button variant="outline" onClick={() => router.push("/market")}>
                    Continue Shopping
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      localStorage.setItem("cart", "[]")
                      setCartItems([])
                    }}
                  >
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>Contact Farmer</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        * Delivery arrangements to be made directly with the farmer
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-green-700 hover:bg-green-800" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/market">
              <Button className="bg-green-700 hover:bg-green-800">Browse Marketplace</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Farmer Contact Information</DialogTitle>
            <DialogDescription>Contact the following farmers to arrange delivery of your items.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-4">
            {checkoutFarmers.map((farmer) => (
              <div key={farmer.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image src={farmer.image || "/placeholder.svg"} alt={farmer.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">{farmer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {cartItems.filter((item) => item.farmer === farmer.name).length} items in your cart
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {farmer.phone}
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {farmer.email}
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    {farmer.address}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button className="w-full bg-green-700 hover:bg-green-800" onClick={completeOrder}>
              Complete Order <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>You need to be logged in to proceed with checkout.</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => {
                setShowLoginDialog(false)
                router.push("/login?redirect=/cart")
              }}
            >
              Login Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Placed Successfully!</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            <div className="bg-green-100 text-green-800 rounded-full p-3">
              <Check className="h-8 w-8" />
            </div>
          </div>

          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Your order #{orderId} has been placed successfully. You can track your order status in the order tracking
              page.
            </AlertDescription>
          </Alert>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/market")
              }}
            >
              Continue Shopping
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => {
                setShowSuccessDialog(false)
                router.push(`/track-order/${orderId}`)
              }}
            >
              Track Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

