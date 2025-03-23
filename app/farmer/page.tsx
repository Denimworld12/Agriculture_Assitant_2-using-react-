"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Calendar, MapPin, Tractor, ShoppingBag, ArrowRight } from "lucide-react"

export default function FarmerPage() {
  const [cropImages, setCropImages] = useState<File[]>([])
  const [cropName, setCropName] = useState("")
  const [cropCategory, setCropCategory] = useState("")
  const [cropPrice, setCropPrice] = useState("")
  const [cropQuantity, setCropQuantity] = useState("")
  const [cropDescription, setCropDescription] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setCropImages((prev) => [...prev, ...filesArray])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to the server
    console.log({
      cropName,
      cropCategory,
      cropPrice,
      cropQuantity,
      cropDescription,
      cropImages,
    })

    // Reset form
    setCropName("")
    setCropCategory("")
    setCropPrice("")
    setCropQuantity("")
    setCropDescription("")
    setCropImages([])

    // Show success message or redirect
    alert("Crop listed successfully!")
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight">Start Your Farming Business</h1>
              <p className="text-lg text-green-100">
                List your crops, rent equipment, and access government schemes all in one place. Connect directly with
                consumers and get better prices for your produce.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#sell-crops">
                  <Button size="lg" className="bg-white text-green-800 hover:bg-green-100">
                    Sell Your Crops
                  </Button>
                </Link>
                <Link href="#rent-equipment">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Rent Equipment
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/crops5.jpg?height=400&width=600&text=Farmer"
                alt="Farmer with crops"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Dashboard Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="sell" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="sell">Sell Crops</TabsTrigger>
              <TabsTrigger value="equipment">Rent Equipment</TabsTrigger>
              <TabsTrigger value="schemes">Government Schemes</TabsTrigger>
            </TabsList>

            {/* Sell Crops Tab */}
            <TabsContent value="sell" id="sell-crops">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>List Your Crops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="crop-price">Price (₹)</Label>
                          <Input
                            id="crop-price"
                            type="number"
                            placeholder="Price per unit"
                            value={cropPrice}
                            onChange={(e) => setCropPrice(e.target.value)}
                            required
                          />
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
                        <Label>Upload Images</Label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                            id="crop-images"
                          />
                          <Label
                            htmlFor="crop-images"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm font-medium">Click to upload images</span>
                            <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
                          </Label>
                        </div>

                        {cropImages.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm mb-2">{cropImages.length} images selected</p>
                            <div className="flex flex-wrap gap-2">
                              {cropImages.map((file, index) => (
                                <div key={index} className="relative h-16 w-16 rounded-md overflow-hidden">
                                  <Image
                                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                                    alt={`Crop image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        List Crop for Sale
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tips for Selling</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-3">
                        <div className="bg-green-100 text-green-800 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">Add clear photos</h4>
                          <p className="text-sm text-muted-foreground">
                            Upload multiple high-quality images showing your crops from different angles.
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
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Listed Crops</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No crops listed yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your listed crops will appear here once you add them.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Rent Equipment Tab */}
            <TabsContent value="equipment" id="rent-equipment">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Tractor",
                    image: "/tractor.jpeg?height=200&width=300&text=Tractor",
                    price: "₹1,500/day",
                    location: "Mumbai, Maharashtra",
                    availability: "Available from Apr 20",
                  },
                  {
                    name: "Harvester",
                    image: "/harvester.jpg?height=200&width=300&text=Harvester",
                    price: "₹2,500/day",
                    location: "Pune, Maharashtra",
                    availability: "Available from Apr 15",
                  },
                  {
                    name: "Rotavator",
                    image: "/placeholder.svg?height=200&width=300&text=Rotavator",
                    price: "₹800/day",
                    location: "Nashik, Maharashtra",
                    availability: "Available now",
                  },
                  {
                    name: "Seed Drill",
                    image: "/placeholder.svg?height=200&width=300&text=Seed Drill",
                    price: "₹600/day",
                    location: "Thane, Maharashtra",
                    availability: "Available now",
                  },
                  {
                    name: "Water Pump",
                    image: "/placeholder.svg?height=200&width=300&text=Water Pump",
                    price: "₹300/day",
                    location: "Kolhapur, Maharashtra",
                    availability: "Available now",
                  },
                  {
                    name: "Sprayer",
                    image: "/fertilizer.jpg?height=200&width=300&text=Sprayer",
                    price: "₹200/day",
                    location: "Nagpur, Maharashtra",
                    availability: "Available from Apr 18",
                  },
                ].map((equipment, index) => (
                  <Card key={index} className="overflow-hidden">
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
                        <span className="font-bold text-lg">{equipment.price}</span>
                        <Button className="bg-green-700 hover:bg-green-800">Rent Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-xl font-bold mb-2">Need Different Equipment?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find what you're looking for? Request specific equipment and we'll help you find it.
                </p>
                <Link href="/farmer/request-equipment">
                  <Button className="bg-green-700 hover:bg-green-800">Request Equipment</Button>
                </Link>
              </div>
            </TabsContent>

            {/* Government Schemes Tab */}
            <TabsContent value="schemes" id="government-schemes">
              <div className="space-y-6">
                {[
                  {
                    id: 101,
                    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                    description:
                      "Income support scheme providing farmers with up to ₹6,000 per year in three equal installments.",
                    eligibility:
                      "All landholding farmers' families with cultivable land, subject to certain exclusions.",
                    deadline: "Ongoing",
                    image: "/placeholder.svg?height=200&width=300&text=PM-KISAN",
                  },
                  {
                    id: 102,
                    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                    description:
                      "Crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities.",
                    eligibility: "All farmers growing notified crops in notified areas.",
                    deadline: "Varies by crop season",
                    image: "/placeholder.svg?height=200&width=300&text=PMFBY",
                  },
                  {
                    id: 103,
                    title: "Kisan Credit Card (KCC)",
                    description: "Provides farmers with affordable credit for their agricultural needs.",
                    eligibility: "All farmers, sharecroppers, tenant farmers, and self-help groups.",
                    deadline: "Ongoing",
                    image: "/placeholder.svg?height=200&width=300&text=KCC",
                  },
                ].map((scheme) => (
                  <Card key={scheme.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative h-48 md:h-auto md:w-1/4 rounded-md overflow-hidden">
                          <Image
                            src={scheme.image || "/placeholder.svg"}
                            alt={scheme.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="text-xl font-bold mb-2">{scheme.title}</h3>
                          <p className="text-muted-foreground mb-4">{scheme.description}</p>

                          <div className="space-y-2 mb-4">
                            <div>
                              <span className="font-medium">Eligibility: </span>
                              <span className="text-muted-foreground">{scheme.eligibility}</span>
                            </div>
                            <div>
                              <span className="font-medium">Deadline: </span>
                              <span className="text-muted-foreground">{scheme.deadline}</span>
                            </div>
                          </div>

                          <Link href={`/schemes/${scheme.id}`}>
                            <Button className="bg-green-700 hover:bg-green-800">View Details & Apply</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/schemes">
                  <Button variant="outline" className="flex items-center">
                    View All Schemes <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-green-50 dark:bg-green-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits for Farmers</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of farmers already benefiting from our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 mb-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Direct Sales</h3>
                <p className="text-muted-foreground">
                  Sell your produce directly to consumers without middlemen, ensuring you get better prices for your
                  crops.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 mb-4">
                  <Tractor className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Equipment Access</h3>
                <p className="text-muted-foreground">
                  Rent farming equipment at affordable rates, reducing your capital investment and improving
                  productivity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Scheme Updates</h3>
                <p className="text-muted-foreground">
                  Stay updated with the latest government schemes and subsidies designed to support farmers like you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 rounded-xl text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
                <p className="text-green-100 mb-6">
                  Create your farmer account today and start selling your produce directly to consumers. It's free,
                  easy, and can significantly increase your profits.
                </p>
                <Link href="/farmer/register">
                  <Button size="lg" className="bg-white text-green-800 hover:bg-green-100">
                    Register as Farmer
                  </Button>
                </Link>
              </div>
              <div className="relative h-[250px] rounded-lg overflow-hidden">
                <Image
                  src="/crops2.jpg?height=250&width=400&text=Join Now"
                  alt="Farmer with crops"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

