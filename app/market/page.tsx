"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, ShoppingCart, MapPin, Phone, Mail, Filter, SlidersHorizontal, X, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for crops
const CROPS = [
  {
    id: 1,
    name: "Organic Rice",
    category: "Grains",
    price: 45,
    unit: "kg",
    location: "Thane, Maharashtra",
    quantity: 500,
    image: "https://pramoda.co.in/wp-content/uploads/2018/12/rice_banner.jpg?height=300&width=300&text=Rice",
    description:
      "Premium quality organic rice grown without pesticides. Rich in nutrients and perfect for daily consumption.",
    farmer: {
      id: 101,
      name: "Rajesh Patel",
      rating: 4.8,
      phone: "+91 98765 43210",
      email: "rajesh@example.com",
      address: "123 Farm Road, Thane, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=RP",
    },
    bulkDiscount: [
      { quantity: 10, price: 43 },
      { quantity: 50, price: 40 },
      { quantity: 100, price: 38 },
    ],
  },
  {
    id: 2,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 30,
    unit: "kg",
    location: "Pune, Maharashtra",
    quantity: 200,
    image: "https://5.imimg.com/data5/SELLER/Default/2022/3/RV/WK/TD/119138440/fresh-tomato-1000x1000.jpeg?height=300&width=300&text=Tomatoes",
    description: "Juicy and ripe tomatoes freshly harvested from our farm. Perfect for salads and cooking.",
    farmer: {
      id: 102,
      name: "Anita Sharma",
      rating: 4.6,
      phone: "+91 87654 32109",
      email: "anita@example.com",
      address: "456 Vegetable Farm, Pune, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=AS",
    },
    bulkDiscount: [
      { quantity: 5, price: 28 },
      { quantity: 20, price: 25 },
      { quantity: 50, price: 22 },
    ],
  },
  {
    id: 3,
    name: "Hafu's Mangoes",
    category: "Fruits",
    price: 400,
    unit: "dozen",
    location: "Ratnagiri, Maharashtra",
    quantity: 100,
    image: "https://5.imimg.com/data5/SELLER/Default/2021/3/YG/IF/PY/77590722/hapus-mango-plant-contract-farming-service-500x500.jpg?height=300&width=300&text=Mangoes",
    description: "Premium Alphonso mangoes known for their sweetness and aroma. Directly from Ratnagiri farms.",
    farmer: {
      id: 103,
      name: "Suresh Desai",
      rating: 4.9,
      phone: "+91 76543 21098",
      email: "suresh@example.com",
      address: "789 Mango Orchard, Ratnagiri, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=SD",
    },
    bulkDiscount: [
      { quantity: 2, price: 380 },
      { quantity: 5, price: 350 },
      { quantity: 10, price: 320 },
    ],
  },
  {
    id: 4,
    name: "Organic Wheat",
    category: "Grains",
    price: 35,
    unit: "kg",
    location: "Nashik, Maharashtra",
    quantity: 1000,
    image: "https://5.imimg.com/data5/SELLER/Default/2021/4/MM/NU/OC/119588724/new-product-500x500.jpeg?height=300&width=300&text=Wheat",
    description: "High-quality organic wheat, perfect for making chapatis, bread, and other baked goods.",
    farmer: {
      id: 104,
      name: "Prakash Joshi",
      rating: 4.7,
      phone: "+91 65432 10987",
      email: "prakash@example.com",
      address: "101 Wheat Fields, Nashik, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=PJ",
    },
    bulkDiscount: [
      { quantity: 10, price: 33 },
      { quantity: 50, price: 30 },
      { quantity: 100, price: 28 },
    ],
  },
  {
    id: 5,
    name: "Fresh Potatoes",
    category: "Vegetables",
    price: 20,
    unit: "kg",
    location: "Kolhapur, Maharashtra",
    quantity: 300,
    image: "https://tiimg.tistatic.com/fp/1/006/410/indian-origin-fresh-potato-799.jpg?height=300&width=300&text=Potatoes",
    description: "Fresh and clean potatoes, perfect for various dishes. Grown using sustainable farming practices.",
    farmer: {
      id: 105,
      name: "Meena Patil",
      rating: 4.5,
      phone: "+91 54321 09876",
      email: "meena@example.com",
      address: "202 Vegetable Garden, Kolhapur, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=MP",
    },
    bulkDiscount: [
      { quantity: 5, price: 19 },
      { quantity: 20, price: 18 },
      { quantity: 50, price: 16 },
    ],
  },
  {
    id: 6,
    name: "Organic Bananas",
    category: "Fruits",
    price: 60,
    unit: "dozen",
    location: "Solapur, Maharashtra",
    quantity: 150,
    image: "https://ychef.files.bbci.co.uk/976x549/p08xcsy8.jpg?height=300&width=300&text=Bananas",
    description: "Organically grown bananas, rich in potassium and other nutrients. Perfect for a healthy snack.",
    farmer: {
      id: 106,
      name: "Ramesh Kulkarni",
      rating: 4.4,
      phone: "+91 43210 98765",
      email: "ramesh@example.com",
      address: "303 Banana Plantation, Solapur, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=RK",
    },
    bulkDiscount: [
      { quantity: 3, price: 55 },
      { quantity: 10, price: 50 },
      { quantity: 20, price: 45 },
    ],
  },
  {
    id: 7,
    name: "Fresh Onions",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    location: "Nashik, Maharashtra",
    quantity: 400,
    image: "https://5.imimg.com/data5/UR/XH/JN/SELLER-6048321/fb-img-1584446791988.jpg?height=300&width=300&text=Onions",
    description: "Fresh red onions with a strong flavor, perfect for adding taste to your dishes.",
    farmer: {
      id: 107,
      name: "Vijay Patil",
      rating: 4.6,
      phone: "+91 32109 87654",
      email: "vijay@example.com",
      address: "404 Onion Farm, Nashik, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=VP",
    },
    bulkDiscount: [
      { quantity: 5, price: 23 },
      { quantity: 20, price: 21 },
      { quantity: 50, price: 19 },
    ],
  },
  {
    id: 8,
    name: "Organic Apples",
    category: "Fruits",
    price: 120,
    unit: "kg",
    location: "Shimla, Himachal Pradesh",
    quantity: 100,
    image: "https://5.imimg.com/data5/VI/NC/MY-34355602/fresh-apples-500x500.png?height=300&width=300&text=Apples",
    description: "Fresh and juicy apples from the hills of Himachal Pradesh. Rich in fiber and antioxidants.",
    farmer: {
      id: 108,
      name: "Ravi Kumar",
      rating: 4.8,
      phone: "+91 21098 76543",
      email: "ravi@example.com",
      address: "505 Apple Orchard, Shimla, Himachal Pradesh",
      image: "/placeholder.svg?height=100&width=100&text=RK",
    },
    bulkDiscount: [
      { quantity: 3, price: 115 },
      { quantity: 10, price: 110 },
      { quantity: 20, price: 105 },
    ],
  },
  {
    id: 9,
    name: "Organic Turmeric",
    category: "Spices",
    price: 150,
    unit: "kg",
    location: "Sangli, Maharashtra",
    quantity: 50,
    image: "https://www.csp.indica.in/wp-content/uploads/2021/04/Photo-from-Aparna-M-Sridhar-4.jpg?height=300&width=300&text=Turmeric",
    description: "High-quality organic turmeric with rich color and aroma. Perfect for cooking and medicinal purposes.",
    farmer: {
      id: 109,
      name: "Lakshmi Devi",
      rating: 4.9,
      phone: "+91 10987 65432",
      email: "lakshmi@example.com",
      address: "606 Spice Farm, Sangli, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=LD",
    },
    bulkDiscount: [
      { quantity: 2, price: 145 },
      { quantity: 5, price: 140 },
      { quantity: 10, price: 135 },
    ],
  },
  {
    id: 10,
    name: "Fresh Coconuts",
    category: "Fruits",
    price: 40,
    unit: "piece",
    location: "Ratnagiri, Maharashtra",
    quantity: 200,
    image: "https://5.imimg.com/data5/XE/IU/MY-35376720/coconut-500x500.jpg?height=300&width=300&text=Coconuts",
    description: "Fresh coconuts with sweet water and tender meat. Directly from coastal farms.",
    farmer: {
      id: 110,
      name: "Ganesh Sawant",
      rating: 4.7,
      phone: "+91 09876 54321",
      email: "ganesh@example.com",
      address: "707 Coconut Grove, Ratnagiri, Maharashtra",
      image: "/placeholder.svg?height=100&width=100&text=GS",
    },
    bulkDiscount: [
      { quantity: 5, price: 38 },
      { quantity: 20, price: 35 },
      { quantity: 50, price: 32 },
    ],
  },
]

export default function MarketPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCrop, setSelectedCrop] = useState<any>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [userData, setUserData] = useState<any>(null)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    setIsLoggedIn(!!token)

    if (token) {
      // Get user data
      const data = JSON.parse(localStorage.getItem("user-data") || '{"name":"Guest"}')
      setUserData(data)
    }
  }, [])

  // Filter crops based on search, category, and price
  const filteredCrops = CROPS.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || crop.category === selectedCategory

    const matchesPrice = crop.price >= priceRange[0] && crop.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesPrice
  })

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    // Mock adding to cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === selectedCrop.id)

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      cart.push({
        id: selectedCrop.id,
        name: selectedCrop.name,
        price: selectedCrop.price,
        quantity: quantity,
        image: selectedCrop.image,
        farmer: selectedCrop.farmer.name,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    // Show success dialog
    setShowSuccessDialog(true)

    // Close dialog and reset quantity after a delay
    setTimeout(() => {
      setSelectedCrop(null)
      setQuantity(1)
      setShowSuccessDialog(false)

      // Add notification
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
      notifications.unshift({
        title: "Item Added to Cart",
        message: `${quantity} ${selectedCrop.name} added to your cart`,
        time: new Date().toLocaleString(),
        link: "/cart",
      })
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }, 2000)
  }

  // Calculate price based on quantity (bulk discount)
  const calculatePrice = () => {
    if (!selectedCrop) return 0

    // Find applicable bulk discount
    const discount = selectedCrop.bulkDiscount
      .slice()
      .reverse()
      .find((d: { quantity: number, price: number }) => quantity >= d.quantity)

    return discount ? discount.price * quantity : selectedCrop.price * quantity
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Browse and buy fresh produce directly from farmers</p>
          </div>

          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops, categories, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block space-y-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4 flex items-center text-green-800">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="category" className="mb-2 block">
                      Category
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Grains">Grains</SelectItem>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Fruits">Fruits</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                        <SelectItem value="Spices">Spices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Price Range (₹)</Label>
                    <div className="pt-4">
                      <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange([0, 500])
                      setSearchTerm("")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">Popular Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {["Grains", "Vegetables", "Fruits", "Dairy", "Spices"].map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 bg-background z-40 p-4 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="mobile-category" className="mb-2 block">
                    Category
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="mobile-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Grains">Grains</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Fruits">Fruits</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Spices">Spices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Price Range (₹)</Label>
                  <div className="pt-4">
                    <Slider
                      defaultValue={[0, 500]}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange([0, 500])
                      setSearchTerm("")
                    }}
                  >
                    Reset
                  </Button>
                  <Button className="flex-1 bg-green-700 hover:bg-green-800" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Crop Listings */}
          <div className="md:col-span-3">
            <Tabs defaultValue="grid" className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Showing {filteredCrops.length} results</span>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCrops.map((crop) => (
                    <Card key={crop.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image src={crop.image || "/placeholder.svg"} alt={crop.name} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{crop.name}</h3>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {crop.location}
                            </div>
                          </div>
                          <Badge variant="outline">{crop.category}</Badge>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <span className="font-bold text-lg">₹{crop.price}</span>
                            <span className="text-sm text-muted-foreground">/{crop.unit}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-green-700 hover:bg-green-800"
                            onClick={() => setSelectedCrop(crop)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <div className="space-y-4">
                  {filteredCrops.map((crop) => (
                    <Card key={crop.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0">
                            <Image
                              src={crop.image || "/placeholder.svg"}
                              alt={crop.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{crop.name}</h3>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {crop.location}
                                </div>
                              </div>
                              <Badge variant="outline">{crop.category}</Badge>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div>
                                <span className="font-bold text-lg">₹{crop.price}</span>
                                <span className="text-sm text-muted-foreground">/{crop.unit}</span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-green-700 hover:bg-green-800"
                                onClick={() => setSelectedCrop(crop)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {filteredCrops.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No crops found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all")
                    setPriceRange([0, 500])
                    setSearchTerm("")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crop Details Dialog */}
      {selectedCrop && (
        <Dialog
          open={!!selectedCrop}
          onOpenChange={() => {
            setSelectedCrop(null)
            setQuantity(1)
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedCrop.name}</DialogTitle>
              <DialogDescription>
                Sold by {selectedCrop.farmer.name} from {selectedCrop.location}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 md:h-full rounded-md overflow-hidden">
                <Image
                  src={selectedCrop.image || "/placeholder.svg"}
                  alt={selectedCrop.name}
                  width={500}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Product Details</h3>
                  <p className="text-sm mb-4">{selectedCrop.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Category:</div>
                    <div>{selectedCrop.category}</div>
                    <div className="text-muted-foreground">Available Quantity:</div>
                    <div>
                      {selectedCrop.quantity} {selectedCrop.unit}
                    </div>
                    <div className="text-muted-foreground">Base Price:</div>
                    <div>
                      ₹{selectedCrop.price}/{selectedCrop.unit}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Bulk Discounts</h3>
                  <div className="space-y-1 text-sm">
                    {selectedCrop.bulkDiscount.map((discount: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          Buy {discount.quantity}+ {selectedCrop.unit}
                        </span>
                        <span>
                          ₹{discount.price}/{selectedCrop.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Farmer Information</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={selectedCrop.farmer.image || "/placeholder.svg"}
                        alt={selectedCrop.farmer.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{selectedCrop.farmer.name}</div>
                      <div className="text-sm text-muted-foreground">Rating: {selectedCrop.farmer.rating}/5</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedCrop.farmer.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedCrop.farmer.email}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      {selectedCrop.farmer.address}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity" className="mb-2 block">
                    Quantity ({selectedCrop.unit})
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      -
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedCrop.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(selectedCrop.quantity, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <div className="text-lg font-bold">Total: ₹{calculatePrice()}</div>
              <Button className="bg-green-700 hover:bg-green-800" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>You need to be logged in to add items to your cart.</DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => {
                setShowLoginDialog(false)
                router.push("/login?redirect=/market")
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
            <DialogTitle>Item Added to Cart</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center py-4">
            <div className="bg-green-100 text-green-800 rounded-full p-3">
              <Check className="h-8 w-8" />
            </div>
          </div>

          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              {quantity} {selectedCrop?.name} has been added to your cart successfully!
            </AlertDescription>
          </Alert>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false)
                setSelectedCrop(null)
                setQuantity(1)
              }}
            >
              Continue Shopping
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/cart")
              }}
            >
              Go to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}

