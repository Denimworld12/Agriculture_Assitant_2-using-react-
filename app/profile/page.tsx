"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, MapPin, Phone, Mail, Edit, Check, ShoppingBag, Tractor } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState("")
  const [profile, setProfile] = useState({
    name: "nikhil",
    email: "nikhil@gmail.com",
    phone: "+91 69871 43210",
    address: "123 samay street, Mumbai, Maharashtra",
    pincode: "400001",
    profileImage: "/nikhil.jpg?height=200&width=200&text=JD",
    bio: "I'm a farmer with 10 years of experience in organic farming. I specialize in growing vegetables and fruits using sustainable farming practices.",
    farmDetails: {
      size: "5 acres",
      crops: "Rice, Wheat, Vegetables",
      location: "Thane, Maharashtra",
    },
  })

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editField, setEditField] = useState("")
  const [editValue, setEditValue] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock order history
  const [orders, setOrders] = useState([
    {
      id: "ORD12345",
      date: "2023-04-10",
      items: [
        { name: "Organic Rice", quantity: 10, price: 45 },
        { name: "Fresh Tomatoes", quantity: 5, price: 30 },
      ],
      total: 600,
      status: "Delivered",
    },
    {
      id: "ORD12346",
      date: "2023-03-25",
      items: [{ name: "Alphonso Mangoes", quantity: 2, price: 400 }],
      total: 800,
      status: "Delivered",
    },
  ])

  // Mock equipment rentals
  const [rentals, setRentals] = useState([
    {
      id: "RNT5678",
      equipment: "Tractor",
      startDate: "2023-04-15",
      days: 2,
      totalPrice: 3000,
      status: "Confirmed",
    },
    {
      id: "RNT5679",
      equipment: "Seed Drill",
      startDate: "2023-03-20",
      days: 1,
      totalPrice: 600,
      status: "Completed",
    },
  ])

  // Mock crop listings
  const [listings, setListings] = useState([
    {
      id: 1,
      name: "Organic Rice",
      category: "Grains",
      price: 45,
      unit: "kg",
      quantity: 500,
      location: "Thane, Maharashtra",
      date: "2023-04-01",
      status: "Active",
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      category: "Vegetables",
      price: 30,
      unit: "kg",
      quantity: 200,
      location: "Thane, Maharashtra",
      date: "2023-03-15",
      status: "Sold Out",
    },
  ])

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const type = localStorage.getItem("user-type")

    if (!token) {
      router.push("/login?redirect=/profile")
    } else {
      setIsLoggedIn(true)
      setUserType(type || "user")
    }
  }, [router])

  const handleEditClick = (field: string, value: string) => {
    setEditField(field)
    setEditValue(value)
    setShowEditDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!editValue) {
      setError("Please enter a value")
      return
    }

    setIsLoading(true)

    try {
      // Mock API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update profile
      setProfile({
        ...profile,
        [editField]: editValue,
      })

      setSuccess(true)
      setError("")

      // Close dialog after a delay
      setTimeout(() => {
        setShowEditDialog(false)
        setSuccess(false)
      }, 1500)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading Profile...</h1>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">View and manage your profile, orders, and listings</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
                    <Image
                      src={profile.profileImage || "/placeholder.svg"}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{userType === "farmer" ? "Farmer" : "Consumer"}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{profile.phone}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick("phone", profile.phone)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{profile.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick("email", profile.email)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p>{profile.address}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick("address", profile.address)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  {userType === "farmer" && (
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Farm Details</h3>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Farm Size:</span>
                          <span>{profile.farmDetails.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Main Crops:</span>
                          <span>{profile.farmDetails.crops}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{profile.farmDetails.location}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button variant="outline" className="w-full" onClick={() => handleEditClick("bio", profile.bio)}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="orders">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Order History</TabsTrigger>
                {userType === "farmer" && <TabsTrigger value="listings">My Listings</TabsTrigger>}
                <TabsTrigger value="rentals">Equipment Rentals</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't placed any orders yet. Start shopping to see your order history.
                        </p>
                        <Link href="/market">
                          <Button className="bg-green-700 hover:bg-green-800">Browse Marketplace</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
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
                                    : order.status === "Processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>

                            <div className="space-y-2 mb-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span>₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between font-bold pt-2 border-t">
                              <span>Total</span>
                              <span>₹{order.total}</span>
                            </div>

                            <div className="mt-4 flex justify-end">
                              <Link href={`/track-order/${order.id}`}>
                                <Button variant="outline" size="sm">
                                  Track Order
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {userType === "farmer" && (
                <TabsContent value="listings">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Crop Listings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {listings.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                          <p className="text-muted-foreground mb-4">
                            You haven't listed any crops for sale yet. Start selling by listing your first crop.
                          </p>
                          <Link href="/farmer/sell">
                            <Button className="bg-green-700 hover:bg-green-800">List Your First Crop</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {listings.map((listing) => (
                            <div key={listing.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">{listing.name}</h3>
                                <span
                                  className={`text-sm px-2 py-1 rounded ${
                                    listing.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {listing.status}
                                </span>
                              </div>

                              <div className="text-sm text-muted-foreground mb-3">
                                {listing.location} • Listed on {new Date(listing.date).toLocaleDateString()}
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                                <div>
                                  <span className="text-muted-foreground">Category:</span> {listing.category}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Price:</span> ₹{listing.price}/{listing.unit}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Quantity:</span> {listing.quantity}{" "}
                                  {listing.unit}
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <Link href={`/farmer/sell?edit=${listing.id}`}>
                                  <Button variant="outline" size="sm">
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="rentals">
                <Card>
                  <CardHeader>
                    <CardTitle>Equipment Rentals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {rentals.length === 0 ? (
                      <div className="text-center py-8">
                        <Tractor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No equipment rentals</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't rented any equipment yet. Browse available equipment to get started.
                        </p>
                        <Link href="/farmer/equipment">
                          <Button className="bg-green-700 hover:bg-green-800">Browse Equipment</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {rentals.map((rental) => (
                          <div key={rental.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{rental.equipment}</h3>
                                <p className="text-sm text-muted-foreground">Rental #{rental.id}</p>
                              </div>
                              <span
                                className={`text-sm px-2 py-1 rounded ${
                                  rental.status === "Confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : rental.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {rental.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <span className="text-muted-foreground">Start Date:</span>{" "}
                                {new Date(rental.startDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span> {rental.days}{" "}
                                {rental.days === 1 ? "day" : "days"}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total Amount:</span> ₹{rental.totalPrice}
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}</DialogTitle>
            <DialogDescription>Update your profile information</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {editField === "bio" ? (
              <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={5} />
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                type={editField === "email" ? "email" : "text"}
              />
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={handleSaveEdit}
              disabled={isLoading || success}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

