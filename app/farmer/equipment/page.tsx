"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar, MapPin, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Equipment, User } from "@/types"

interface EquipmentOwner extends Omit<User, 'id'> {
  image: string;
}

interface EquipmentItem {
  id: number;
  name: string;
  image: string;
  price: number;
  unit: string;
  location: string;
  availability: string;
  description: string;
  owner: EquipmentOwner;
}

interface Rental {
  id: number;
  equipment: EquipmentItem;
  startDate: string;
  days: number;
  totalPrice: number;
  status: string;
  date: string;
}

// Mock equipment data
const EQUIPMENT: EquipmentItem[] = [
  {
    id: 1,
    name: "Tractor",
    image: "/placeholder.svg?height=200&width=300&text=Tractor",
    price: 1500,
    unit: "day",
    location: "Mumbai, Maharashtra",
    availability: "Available from Apr 20",
    description: "Modern tractor with 50 HP engine, suitable for all types of farming operations.",
    owner: {
      name: "Rajesh Patel",
      phone: "+91 98765 43210",
      email: "rajesh@example.com",
      address: "123 Farm Road, Mumbai, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=RP",
    },
  },
  {
    id: 2,
    name: "Harvester",
    image: "/placeholder.svg?height=200&width=300&text=Harvester",
    price: 2500,
    unit: "day",
    location: "Pune, Maharashtra",
    availability: "Available from Apr 15",
    description: "Combine harvester suitable for wheat, rice, and other grain crops.",
    owner: {
      name: "Anita Sharma",
      phone: "+91 87654 32109",
      email: "anita@example.com",
      address: "456 Vegetable Farm, Pune, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=AS",
    },
  },
  {
    id: 3,
    name: "Rotavator",
    image: "/placeholder.svg?height=200&width=300&text=Rotavator",
    price: 800,
    unit: "day",
    location: "Nashik, Maharashtra",
    availability: "Available now",
    description: "Rotavator for soil preparation, suitable for all soil types.",
    owner: {
      name: "Suresh Desai",
      phone: "+91 76543 21098",
      email: "suresh@example.com",
      address: "789 Mango Orchard, Nashik, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=SD",
    },
  },
  {
    id: 4,
    name: "Seed Drill",
    image: "/placeholder.svg?height=200&width=300&text=Seed Drill",
    price: 600,
    unit: "day",
    location: "Thane, Maharashtra",
    availability: "Available now",
    description: "Precision seed drill for accurate seed placement and spacing.",
    owner: {
      name: "Prakash Joshi",
      phone: "+91 65432 10987",
      email: "prakash@example.com",
      address: "101 Wheat Fields, Thane, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=PJ",
    },
  },
  {
    id: 5,
    name: "Water Pump",
    image: "/placeholder.svg?height=200&width=300&text=Water Pump",
    price: 300,
    unit: "day",
    location: "Kolhapur, Maharashtra",
    availability: "Available now",
    description: "High-capacity water pump for irrigation, with fuel-efficient engine.",
    owner: {
      name: "Meena Patil",
      phone: "+91 54321 09876",
      email: "meena@example.com",
      address: "202 Vegetable Garden, Kolhapur, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=MP",
    },
  },
  {
    id: 6,
    name: "Sprayer",
    image: "/placeholder.svg?height=200&width=300&text=Sprayer",
    price: 200,
    unit: "day",
    location: "Nagpur, Maharashtra",
    availability: "Available from Apr 18",
    description: "Motorized sprayer for pesticides and fertilizers, with adjustable nozzle.",
    owner: {
      name: "Ramesh Kulkarni",
      phone: "+91 43210 98765",
      email: "ramesh@example.com",
      address: "303 Banana Plantation, Nagpur, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=RK",
    },
  },
]

export default function EquipmentPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null)
  const [rentDays, setRentDays] = useState(1)
  const [startDate, setStartDate] = useState("")
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showRentDialog, setShowRentDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [myRentals, setMyRentals] = useState<Rental[]>([])

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    setIsLoggedIn(!!token)

    // Load mock rentals
    const mockRentals = JSON.parse(localStorage.getItem("my-rentals") || "[]")
    setMyRentals(mockRentals)
  }, [])

  // Filter equipment based on search, location, and price
  const filteredEquipment = EQUIPMENT.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = selectedLocation === "all" || item.location.includes(selectedLocation)

    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && item.price <= 500) ||
      (priceRange === "medium" && item.price > 500 && item.price <= 1000) ||
      (priceRange === "high" && item.price > 1000)

    return matchesSearch && matchesLocation && matchesPrice
  })

  const handleRentEquipment = (equipment: EquipmentItem) => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }
    setSelectedEquipment(equipment)
    setShowRentDialog(true)
  }

  const handleRentSubmit = async () => {
    if (!startDate || !selectedEquipment) {
      setError("Please select a start date")
      return
    }

    setIsLoading(true)

    try {
      // Mock API call to rent equipment
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create new rental
      const newRental: Rental = {
        id: Date.now(),
        equipment: selectedEquipment,
        startDate: startDate,
        days: rentDays,
        totalPrice: selectedEquipment.price * rentDays,
        status: "Pending",
        date: new Date().toISOString(),
      }

      // Add to mock rentals
      const updatedRentals = [...myRentals, newRental]
      setMyRentals(updatedRentals)
      localStorage.setItem("my-rentals", JSON.stringify(updatedRentals))

      // Show success message
      setSuccess(true)
      setError("")

      // Close dialog after a delay
      setTimeout(() => {
        setShowRentDialog(false)
        setSuccess(false)
        setRentDays(1)
        setStartDate("")
      }, 2000)
    } catch {
      console.error('Error occurred');
      setError("Failed to rent equipment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Rent Farming Equipment</h1>
        <p className="text-muted-foreground mb-8">Access farming tools, tractors, and equipment at affordable rates</p>

        <Tabs defaultValue="browse">
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse Equipment</TabsTrigger>
            <TabsTrigger value="my-rentals">My Rentals</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-64">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle>Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search equipment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Pune">Pune</SelectItem>
                          <SelectItem value="Nashik">Nashik</SelectItem>
                          <SelectItem value="Thane">Thane</SelectItem>
                          <SelectItem value="Kolhapur">Kolhapur</SelectItem>
                          <SelectItem value="Nagpur">Nagpur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price Range</Label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger id="price">
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="low">Low (₹0 - ₹500)</SelectItem>
                          <SelectItem value="medium">Medium (₹501 - ₹1000)</SelectItem>
                          <SelectItem value="high">High (₹1000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedLocation("all")
                        setPriceRange("all")
                      }}
                    >
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Can't find the equipment you need? Request specific equipment and we'll help you find it.
                    </p>
                    <Link href="/farmer/request-equipment">
                      <Button className="w-full bg-green-700 hover:bg-green-800">Request Equipment</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1">
                {filteredEquipment.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-2">No equipment found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search term to find what you're looking for.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedLocation("all")
                        setPriceRange("all")
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEquipment.map((equipment) => (
                      <Card key={equipment.id} className="overflow-hidden">
                        <div className="relative h-48">
                          <Image
                            src={equipment.image || "/placeholder.svg"}
                            alt={equipment.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-2">{equipment.name}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              {equipment.location}
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              {equipment.availability}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">
                              ₹{equipment.price}/{equipment.unit}
                            </span>
                            <Button
                              className="bg-green-700 hover:bg-green-800"
                              onClick={() => handleRentEquipment(equipment)}
                            >
                              Rent Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-rentals">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My Equipment Rentals</h2>

              {!isLoggedIn ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium mb-2">Please login to view your rentals</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to be logged in to view your equipment rental history.
                  </p>
                  <Link href="/login?redirect=/farmer/equipment">
                    <Button className="bg-green-700 hover:bg-green-800">Login Now</Button>
                  </Link>
                </div>
              ) : myRentals.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium mb-2">No rentals found</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't rented any equipment yet. Browse available equipment to get started.
                  </p>
                  <Button
                    onClick={() => (document.querySelector('[data-value="browse"]') as HTMLElement)?.click()}
                    className="bg-green-700 hover:bg-green-800"
                  >
                    Browse Equipment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRentals.map((rental) => (
                    <Card key={rental.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0">
                            <Image
                              src={rental.equipment.image || "/placeholder.svg"}
                              alt={rental.equipment.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{rental.equipment.name}</h3>
                                <div className="text-sm text-muted-foreground">{rental.equipment.location}</div>
                              </div>
                              <span
                                className={`text-sm px-2 py-1 rounded ${
                                  rental.status === "Confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : rental.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {rental.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                              <div>
                                <span className="text-muted-foreground">Start Date:</span>{" "}
                                {new Date(rental.startDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span> {rental.days}{" "}
                                {rental.days === 1 ? "day" : "days"}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Daily Rate:</span> ₹{rental.equipment.price}/
                                {rental.equipment.unit}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total:</span> ₹{rental.totalPrice}
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Contact Owner
                              </Button>
                              {rental.status === "Pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-sm text-muted-foreground mt-1">
          * Delivery arrangements to be made directly with the owner
        </p>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>You need to be logged in to rent equipment.</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => {
                setShowLoginDialog(false)
                router.push("/login?redirect=/farmer/equipment")
              }}
            >
              Login Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rent Dialog */}
      <Dialog open={showRentDialog} onOpenChange={setShowRentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rent {selectedEquipment?.name}</DialogTitle>
            <DialogDescription>Complete the form below to rent this equipment</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Equipment rental request submitted successfully! The owner will contact you shortly.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src={selectedEquipment?.image || "/placeholder.svg"}
                  alt={selectedEquipment?.name || "Equipment"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedEquipment?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedEquipment?.location}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Number of Days</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setRentDays(Math.max(1, rentDays - 1))}
                >
                  -
                </Button>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  value={rentDays}
                  onChange={(e) => setRentDays(Number.parseInt(e.target.value) || 1)}
                  className="text-center"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => setRentDays(rentDays + 1)}>
                  +
                </Button>
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded-md">
              <h4 className="font-medium mb-2">Owner Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <span className="font-medium w-24">Name:</span>
                  <span>{selectedEquipment?.owner.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Phone:</span>
                  <span>{selectedEquipment?.owner.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Email:</span>
                  <span>{selectedEquipment?.owner.email}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium w-24">Address:</span>
                  <span>{selectedEquipment?.owner.address}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Daily Rate:</span>
                <span>
                  ₹{selectedEquipment?.price}/{selectedEquipment?.unit}
                </span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg mt-2">
                <span>Total Amount:</span>
                <span>₹{selectedEquipment?.price * rentDays}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowRentDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={handleRentSubmit}
              disabled={isLoading || success}
            >
              {isLoading ? "Processing..." : "Confirm Rental"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

