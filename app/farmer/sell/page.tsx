"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Upload, TrendingUp, Info, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock last price data
const LAST_PRICES = {
  Rice: { current: 45, last: 42, trend: "up" },
  Wheat: { current: 35, last: 37, trend: "down" },
  Potatoes: { current: 20, last: 18, trend: "up" },
  Tomatoes: { current: 30, last: 35, trend: "down" },
  Onions: { current: 25, last: 20, trend: "up" },
  Mangoes: { current: 400, last: 380, trend: "up" },
  Bananas: { current: 60, last: 55, trend: "up" },
  Apples: { current: 120, last: 110, trend: "up" },
  Oranges: { current: 80, last: 85, trend: "down" },
  Grapes: { current: 90, last: 95, trend: "down" },
  Corn: { current: 30, last: 28, trend: "up" },
  Soybeans: { current: 50, last: 48, trend: "up" },
  Sugarcane: { current: 35, last: 32, trend: "up" },
  Cotton: { current: 70, last: 65, trend: "up" },
  Pulses: { current: 85, last: 80, trend: "up" },
}

export default function SellCropsPage() {
  const router = useRouter()
  const [cropName, setCropName] = useState("")
  const [cropCategory, setCropCategory] = useState("")
  const [cropPrice, setCropPrice] = useState("")
  const [cropUnit, setCropUnit] = useState("kg")
  const [cropQuantity, setCropQuantity] = useState("")
  const [cropDescription, setCropDescription] = useState("")
  const [cropImage, setCropImage] = useState<File | null>(null)
  const [cropImagePreview, setCropImagePreview] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [bulkDiscounts, setBulkDiscounts] = useState([{ quantity: "", price: "" }])
  const [showLastPrice, setShowLastPrice] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [myListings, setMyListings] = useState<any[]>([])

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/login?redirect=/farmer/sell")
    }

    // Load mock listings
    const mockListings = JSON.parse(localStorage.getItem("my-listings") || "[]")
    setMyListings(mockListings)
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setCropImage(file)
      setCropImagePreview(URL.createObjectURL(file))
    }
  }

  const addBulkDiscount = () => {
    setBulkDiscounts([...bulkDiscounts, { quantity: "", price: "" }])
  }

  const removeBulkDiscount = (index: number) => {
    const newDiscounts = [...bulkDiscounts]
    newDiscounts.splice(index, 1)
    setBulkDiscounts(newDiscounts)
  }

  const updateBulkDiscount = (index: number, field: string, value: string) => {
    const newDiscounts = [...bulkDiscounts]
    newDiscounts[index] = { ...newDiscounts[index], [field]: value }
    setBulkDiscounts(newDiscounts)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!cropName || !cropCategory || !cropPrice || !cropQuantity || !location) {
      setError("Please fill all required fields")
      return
    }

    if (!cropImage) {
      setError("Please upload an image of your crop")
      return
    }

    setIsLoading(true)

    try {
      // Mock API call to list crop
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create new listing
      const newListing = {
        id: Date.now(),
        name: cropName,
        category: cropCategory,
        price: Number.parseFloat(cropPrice),
        unit: cropUnit,
        quantity: Number.parseInt(cropQuantity),
        description: cropDescription,
        image: cropImagePreview,
        location: location,
        bulkDiscounts: bulkDiscounts
          .filter((d) => d.quantity && d.price)
          .map((d) => ({
            quantity: Number.parseInt(d.quantity),
            price: Number.parseFloat(d.price),
          })),
        date: new Date().toISOString(),
      }

      // Add to mock listings
      const updatedListings = [...myListings, newListing]
      setMyListings(updatedListings)
      localStorage.setItem("my-listings", JSON.stringify(updatedListings))

      // Add to marketplace
      const marketItems = JSON.parse(localStorage.getItem("marketplace-items") || "[]")
      marketItems.push({
        ...newListing,
        farmer: {
          id: 101,
          name: "Your Name",
          rating: 4.8,
          phone: "+91 98765 43210",
          email: "your@email.com",
          address: "Your Address, Your City, Your State",
          image: "/placeholder.svg?height=100&width=100&text=YN",
        },
      })
      localStorage.setItem("marketplace-items", JSON.stringify(marketItems))

      // Show success message
      setSuccess(true)

      // Reset form
      setCropName("")
      setCropCategory("")
      setCropPrice("")
      setCropUnit("kg")
      setCropQuantity("")
      setCropDescription("")
      setCropImage(null)
      setCropImagePreview(null)
      setLocation("")
      setBulkDiscounts([{ quantity: "", price: "" }])
      setError("")
    } catch (err) {
      setError("Failed to list your crop. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Sell Your Crops</h1>
        <p className="text-muted-foreground mb-8">
          List your produce directly to consumers and get better prices without middlemen
        </p>

        <Tabs defaultValue="list">
          <TabsList className="mb-6">
            <TabsTrigger value="list">List New Crop</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {success && (
                        <Alert className="bg-green-50 text-green-800 border-green-200">
                          <Check className="h-4 w-4" />
                          <AlertDescription>
                            Your crop has been listed successfully! It will now appear in the marketplace.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="crop-name">Crop Name</Label>
                          <Input
                            id="crop-name"
                            placeholder="e.g., Organic Rice"
                            value={cropName}
                            onChange={(e) => setCropName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="crop-category">Category</Label>
                          <Select value={cropCategory} onValueChange={setCropCategory} required>
                            <SelectTrigger id="crop-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Grains">Grains</SelectItem>
                              <SelectItem value="Vegetables">Vegetables</SelectItem>
                              <SelectItem value="Fruits">Fruits</SelectItem>
                              <SelectItem value="Dairy">Dairy</SelectItem>
                              <SelectItem value="Spices">Spices</SelectItem>
                              <SelectItem value="Pulses">Pulses</SelectItem>
                              <SelectItem value="Oilseeds">Oilseeds</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="crop-price">Price (₹)</Label>
                          <div className="relative">
                            <Input
                              id="crop-price"
                              type="number"
                              placeholder="Price per unit"
                              value={cropPrice}
                              onChange={(e) => setCropPrice(e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full text-green-700"
                              onClick={() => setShowLastPrice(true)}
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Last Price
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="crop-unit">Unit</Label>
                          <Select value={cropUnit} onValueChange={setCropUnit}>
                            <SelectTrigger id="crop-unit">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">Kilogram (kg)</SelectItem>
                              <SelectItem value="quintal">Quintal</SelectItem>
                              <SelectItem value="ton">Ton</SelectItem>
                              <SelectItem value="dozen">Dozen</SelectItem>
                              <SelectItem value="piece">Piece</SelectItem>
                              <SelectItem value="liter">Liter</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="crop-quantity">Quantity</Label>
                          <Input
                            id="crop-quantity"
                            type="number"
                            placeholder="Available quantity"
                            value={cropQuantity}
                            onChange={(e) => setCropQuantity(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Thane, Maharashtra"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="crop-description">Description</Label>
                        <Textarea
                          id="crop-description"
                          placeholder="Describe your crop, quality, harvesting date, etc."
                          value={cropDescription}
                          onChange={(e) => setCropDescription(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Bulk Discounts (Optional)</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Offer discounts for bulk purchases to attract more buyers
                        </p>

                        {bulkDiscounts.map((discount, index) => (
                          <div key={index} className="flex gap-2 items-center mb-2">
                            <div className="flex-1">
                              <Input
                                type="number"
                                placeholder="Min. Quantity"
                                value={discount.quantity}
                                onChange={(e) => updateBulkDiscount(index, "quantity", e.target.value)}
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                type="number"
                                placeholder="Price per unit"
                                value={discount.price}
                                onChange={(e) => updateBulkDiscount(index, "price", e.target.value)}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeBulkDiscount(index)}
                              disabled={bulkDiscounts.length === 1}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}

                        <Button type="button" variant="outline" size="sm" onClick={addBulkDiscount}>
                          + Add Bulk Discount
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Crop Image</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="crop-image"
                          />
                          <Label
                            htmlFor="crop-image"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            {cropImagePreview ? (
                              <div className="relative w-full h-48 mb-2">
                                <Image
                                  src={cropImagePreview || "/placeholder.svg"}
                                  alt="Crop preview"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <>
                                <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                                <span className="text-sm font-medium">Click to upload image</span>
                                <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                              </>
                            )}
                          </Label>
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isLoading}>
                        {isLoading ? "Listing Crop..." : "List Crop for Sale"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Selling Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-green-100 text-green-800 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Add clear photos</h4>
                        <p className="text-sm text-muted-foreground">
                          Upload high-quality images showing your crops clearly to attract more buyers.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-green-100 text-green-800 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Set competitive prices</h4>
                        <p className="text-sm text-muted-foreground">
                          Check current market rates and set your prices accordingly to attract buyers.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-green-100 text-green-800 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Provide detailed descriptions</h4>
                        <p className="text-sm text-muted-foreground">
                          Include information about cultivation methods, harvesting date, and quality.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-green-100 text-green-800 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Offer bulk discounts</h4>
                        <p className="text-sm text-muted-foreground">
                          Encourage larger purchases by offering discounts for bulk orders.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-green-100 text-green-800 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                        5
                      </div>
                      <div>
                        <h4 className="font-medium">Respond quickly</h4>
                        <p className="text-sm text-muted-foreground">
                          Reply to buyer inquiries promptly to increase your chances of making a sale.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you have any questions about selling your crops on our platform, our support team is here to
                      help.
                    </p>
                    <Button className="w-full bg-green-700 hover:bg-green-800">Contact Support</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-listings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My Listed Crops</h2>

              {myListings.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-4">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No crops listed yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't listed any crops for sale yet. Start selling by listing your first crop.
                  </p>
                  <Button
                    onClick={() => (document.querySelector('[data-value="list"]') as HTMLElement)?.click()}
                    className="bg-green-700 hover:bg-green-800"
                  >
                    List Your First Crop
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((listing) => (
                    <Card key={listing.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{listing.name}</h3>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            {listing.category}
                          </span>
                        </div>

                        <div className="text-sm text-muted-foreground mb-3">
                          {listing.location} • Listed on {new Date(listing.date).toLocaleDateString()}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="font-bold text-lg">₹{listing.price}</span>
                            <span className="text-sm text-muted-foreground">/{listing.unit}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Quantity: {listing.quantity} {listing.unit}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Last Price Dialog */}
      <Dialog open={showLastPrice} onOpenChange={setShowLastPrice}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Last Market Prices</DialogTitle>
            <DialogDescription>
              Check the current market prices to set competitive rates for your crops
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-3 bg-green-100 dark:bg-green-900/30 p-3 font-medium">
              <div>Crop</div>
              <div>Current Price (₹)</div>
              <div>Trend</div>
            </div>

            {Object.entries(LAST_PRICES).map(([crop, data], index) => (
              <div key={index} className="grid grid-cols-3 p-3 border-b last:border-b-0 dark:border-gray-700">
                <div>{crop}</div>
                <div>
                  ₹{data.current}/{crop === "Mangoes" ? "dozen" : "kg"}
                </div>
                <div>
                  {data.trend === "up" ? (
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" /> +{data.current - data.last}
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 rotate-180" /> {data.current - data.last}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowLastPrice(false)} className="bg-green-700 hover:bg-green-800">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

