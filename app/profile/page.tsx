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
import { AlertCircle, MapPin, Phone, Mail, Edit, Check, ShoppingBag, Tractor, Heart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define types for better TypeScript support
interface OrderItem {
  id: number
  product_id: number
  order_id: number
  quantity: number
  price_per_unit: number
  total_price: number
  status: string
  created_at: string
}

interface Order {
  id: number
  user_id: number
  total_amount: number
  order_status: string
  payment_status: string
  created_at: string
  item_count: number
}

interface Product {
  id: number
  name: string
  price_per_unit: number
  unit: string
  available_quantity: number
  status: string
  category_name: string
  created_at: string
  harvest_date: string | null
}

interface Equipment {
  id: number
  equipment_name: string
  daily_rate: number
  booking_date: string
  start_date: string
  end_date: string
  status: string
}

interface WishlistItem {
  id: number
  product_id: number
  product_name: string
  price: number
  unit: string
  product_image: string
  farm_name: string
  added_date: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState("")
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    profileImage: "",
    bio: "",
    farmDetails: {
      id: "",
      farm_name: "",
      size: "",
      crops: "",
      location: "",
      verification_status: ""
    },
  })

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editField, setEditField] = useState("")
  const [editValue, setEditValue] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // User data from API with proper types
  const [orders, setOrders] = useState<Order[]>([])
  const [rentals, setRentals] = useState<Equipment[]>([])
  const [listings, setListings] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Fetch user profile and related data from API
  const fetchUserData = async () => {
    const token = localStorage.getItem("auth-token")
    
    if (!token) {
      router.push("/login?redirect=/profile")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Fetch comprehensive profile data
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }
      
      const data = await response.json()
      console.log('Profile data received:', data) // Debugging
      
      // Set user type and login state
      setUserType(data.user.role)
      setIsLoggedIn(true)
      
      // Set profile data
      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
        city: data.user.city || "",
        state: data.user.state || "",
        pincode: data.user.pincode || "",
        profileImage: data.user.avatar || "/placeholder.svg",
        bio: data.user.bio || "",
        farmDetails: data.farmer ? {
          id: data.farmer.id || "",
          farm_name: data.farmer.farm_name || "",
          size: data.farmer.farm_size || "",
          crops: data.farmer.farm_description ? data.farmer.farm_description.split("Primary crops:")[1]?.split(".")[0]?.trim() || "" : "",
          location: data.farmer.farm_location || "",
          verification_status: data.farmer.verification_status || ""
        } : {
          id: "",
          farm_name: "",
          size: "",
          crops: "",
          location: "",
          verification_status: ""
        },
      })
      
      // Set orders with proper type assertion
      if (data.recentOrders && data.recentOrders.length > 0) {
        setOrders(data.recentOrders as Order[])
      }
      
      // Set listings for farmers
      if (data.user.role === 'farmer' && data.products && data.products.length > 0) {
        setListings(data.products as Product[])
      }
      
      // Set equipment rentals
      if (data.equipmentRentals && data.equipmentRentals.length > 0) {
        setRentals(data.equipmentRentals as Equipment[])
      }
      
      // Set cart items
      if (data.cartItems && data.cartItems.length > 0) {
        setCartItems(data.cartItems)
      }
      
      // Set wishlist items if available
      if (data.wishlistItems && data.wishlistItems.length > 0) {
        setWishlistItems(data.wishlistItems as WishlistItem[])
      }
      
      // Update local storage with latest data for other components to use
      localStorage.setItem('user-data', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address ? `${data.user.address}, ${data.user.city}, ${data.user.state}` : "",
        role: data.user.role,
        avatar: data.user.avatar,
        farmDetails: data.farmer ? {
          id: data.farmer.id,
          farm_name: data.farmer.farm_name,
          size: data.farmer.farm_size,
          crops: data.farmer.farm_description ? data.farmer.farm_description.split("Primary crops:")[1]?.split(".")[0]?.trim() || "" : "",
          location: data.farmer.farm_location,
          verification_status: data.farmer.verification_status
        } : null,
        cart: data.cartItems || [],
        wishlist: data.wishlistItems || [],
        recentOrders: data.recentOrders || []
      }))
      
      // Update last data refresh timestamp
      localStorage.setItem('last-data-refresh', new Date().toISOString())
      
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError("Failed to load profile data. Please try again.")
      
      // Check if we have fallback data
      const storedUserData = localStorage.getItem("user-data")
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData)
          setUserType(userData.role || "user")
          setIsLoggedIn(true)
          
          setProfile({
            ...profile,
            name: userData.name || profile.name,
            email: userData.email || profile.email,
            phone: userData.phone || profile.phone,
            address: userData.address || profile.address,
            farmDetails: userData.farmDetails || profile.farmDetails
          })
          
          // Set cart items from localStorage if available
          if (userData.cart) {
            setCartItems(userData.cart)
          }
          
          // Set wishlist items from localStorage if available
          if (userData.wishlist) {
            setWishlistItems(userData.wishlist as WishlistItem[])
          }
          
          // Set orders from localStorage if available
          if (userData.recentOrders) {
            setOrders(userData.recentOrders as Order[])
          }
        } catch (err) {
          console.error("Failed to parse user data", err)
        }
      } else {
        // No token and no stored data, redirect to login
        router.push("/login?redirect=/profile")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Check if user is logged in and load user data
  useEffect(() => {
    fetchUserData()
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
      const token = localStorage.getItem("auth-token")
      
      // Make API call to update profile
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          [editField]: editValue
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setSuccess(true)
      setError("")

      // Reload user data to get the latest updates
      fetchUserData()

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

  if (isLoading) {
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
                      <p>{profile.address ? `${profile.address}, ${profile.city}, ${profile.state}, ${profile.pincode}` : "No address provided"}</p>
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
                          <span className="text-muted-foreground">Farm Name:</span>
                          <span>{profile.farmDetails.farm_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Farm Size:</span>
                          <span>{profile.farmDetails.size} acres</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Main Crops:</span>
                          <span>{profile.farmDetails.crops}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{profile.farmDetails.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`${
                            profile.farmDetails.verification_status === 'verified' 
                              ? 'text-green-600' 
                              : profile.farmDetails.verification_status === 'pending' 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }`}>
                            {profile.farmDetails.verification_status === 'verified' 
                              ? 'Verified' 
                              : profile.farmDetails.verification_status === 'pending' 
                              ? 'Pending Verification' 
                              : 'Not Verified'}
                          </span>
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
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
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
                                  Placed on {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`text-sm px-2 py-1 rounded ${
                                  order.order_status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.order_status === "processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                              </span>
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-muted-foreground">{order.item_count} items</p>
                            </div>

                            <div className="flex justify-between font-bold pt-2 border-t">
                              <span>Total</span>
                              <span>₹{order.total_amount}</span>
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
                                    listing.status === "available"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                </span>
                              </div>

                              <div className="text-sm text-muted-foreground mb-3">
                                Category: {listing.category_name} • Listed on {new Date(listing.created_at).toLocaleDateString()}
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                                <div>
                                  <span className="text-muted-foreground">Price:</span> ₹{listing.price_per_unit}/{listing.unit}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Quantity:</span> {listing.available_quantity} {listing.unit}
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Harvest:</span> {listing.harvest_date ? new Date(listing.harvest_date).toLocaleDateString() : 'N/A'}
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
                                <h3 className="font-medium">{rental.equipment_name}</h3>
                                <p className="text-sm text-muted-foreground">Rental #{rental.id}</p>
                              </div>
                              <span
                                className={`text-sm px-2 py-1 rounded ${
                                  rental.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : rental.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <span className="text-muted-foreground">Booking Date:</span>{" "}
                                {new Date(rental.booking_date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Start Date:</span>{" "}
                                {new Date(rental.start_date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="text-muted-foreground">End Date:</span>{" "}
                                {new Date(rental.end_date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Daily Rate:</span> ₹{rental.daily_rate}
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

              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-4">
                          Save items you're interested in by adding them to your wishlist.
                        </p>
                        <Link href="/market">
                          <Button className="bg-green-700 hover:bg-green-800">Browse Marketplace</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <div className="relative h-16 w-16 overflow-hidden rounded">
                                {item.product_image ? (
                                  <Image
                                    src={item.product_image}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{item.product_name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.farm_name} • Added on {new Date(item.added_date).toLocaleDateString()}
                                </p>
                                <p className="font-medium mt-1">₹{item.price}/{item.unit}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm">
                                  Add to Cart
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              </div>
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

