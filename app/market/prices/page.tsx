"use client"

import { useState } from "react"
import MainLayout from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock price history data
const PRICE_HISTORY = {
  rice: [
    { month: "Jan", price: 40, avgPrice: 38 },
    { month: "Feb", price: 42, avgPrice: 39 },
    { month: "Mar", price: 44, avgPrice: 40 },
    { month: "Apr", price: 43, avgPrice: 41 },
    { month: "May", price: 41, avgPrice: 39 },
    { month: "Jun", price: 40, avgPrice: 38 },
    { month: "Jul", price: 39, avgPrice: 37 },
    { month: "Aug", price: 40, avgPrice: 38 },
    { month: "Sep", price: 42, avgPrice: 39 },
    { month: "Oct", price: 43, avgPrice: 40 },
    { month: "Nov", price: 45, avgPrice: 41 },
    { month: "Dec", price: 46, avgPrice: 42 },
  ],
  wheat: [
    { month: "Jan", price: 30, avgPrice: 28 },
    { month: "Feb", price: 31, avgPrice: 29 },
    { month: "Mar", price: 32, avgPrice: 30 },
    { month: "Apr", price: 33, avgPrice: 31 },
    { month: "May", price: 34, avgPrice: 32 },
    { month: "Jun", price: 33, avgPrice: 31 },
    { month: "Jul", price: 32, avgPrice: 30 },
    { month: "Aug", price: 31, avgPrice: 29 },
    { month: "Sep", price: 30, avgPrice: 28 },
    { month: "Oct", price: 29, avgPrice: 27 },
    { month: "Nov", price: 30, avgPrice: 28 },
    { month: "Dec", price: 31, avgPrice: 29 },
  ],
  potatoes: [
    { month: "Jan", price: 18, avgPrice: 16 },
    { month: "Feb", price: 19, avgPrice: 17 },
    { month: "Mar", price: 20, avgPrice: 18 },
    { month: "Apr", price: 22, avgPrice: 19 },
    { month: "May", price: 23, avgPrice: 20 },
    { month: "Jun", price: 22, avgPrice: 19 },
    { month: "Jul", price: 20, avgPrice: 18 },
    { month: "Aug", price: 19, avgPrice: 17 },
    { month: "Sep", price: 18, avgPrice: 16 },
    { month: "Oct", price: 17, avgPrice: 15 },
    { month: "Nov", price: 18, avgPrice: 16 },
    { month: "Dec", price: 19, avgPrice: 17 },
  ],
  tomatoes: [
    { month: "Jan", price: 30, avgPrice: 28 },
    { month: "Feb", price: 32, avgPrice: 29 },
    { month: "Mar", price: 35, avgPrice: 31 },
    { month: "Apr", price: 38, avgPrice: 34 },
    { month: "May", price: 40, avgPrice: 36 },
    { month: "Jun", price: 42, avgPrice: 38 },
    { month: "Jul", price: 40, avgPrice: 36 },
    { month: "Aug", price: 38, avgPrice: 34 },
    { month: "Sep", price: 35, avgPrice: 31 },
    { month: "Oct", price: 32, avgPrice: 29 },
    { month: "Nov", price: 30, avgPrice: 27 },
    { month: "Dec", price: 28, avgPrice: 25 },
  ],
  onions: [
    { month: "Jan", price: 22, avgPrice: 20 },
    { month: "Feb", price: 24, avgPrice: 21 },
    { month: "Mar", price: 26, avgPrice: 23 },
    { month: "Apr", price: 28, avgPrice: 24 },
    { month: "May", price: 30, avgPrice: 26 },
    { month: "Jun", price: 32, avgPrice: 28 },
    { month: "Jul", price: 30, avgPrice: 26 },
    { month: "Aug", price: 28, avgPrice: 24 },
    { month: "Sep", price: 26, avgPrice: 23 },
    { month: "Oct", price: 24, avgPrice: 21 },
    { month: "Nov", price: 22, avgPrice: 20 },
    { month: "Dec", price: 24, avgPrice: 21 },
  ],
};

type CropType = keyof typeof PRICE_HISTORY;
type TimeRangeType = "3months" | "6months" | "year";

export default function PricesPage() {
  const [selectedCrop, setSelectedCrop] = useState<CropType>("rice");
  const [timeRange, setTimeRange] = useState<TimeRangeType>("year");
  
  // Function to filter data based on selected time range
  const getFilteredData = () => {
    const data = PRICE_HISTORY[selectedCrop];
    
    if (timeRange === "3months") {
      return data.slice(-3);
    } else if (timeRange === "6months") {
      return data.slice(-6);
    }
    
    return data; // Return full year data
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Market Price Trends</h1>
        <p className="text-muted-foreground mb-8">
          Track historical crop prices to make informed buying and selling decisions
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle>Price Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crop">Select Crop</Label>
                  <Select value={selectedCrop} onValueChange={(value: CropType) => setSelectedCrop(value)}>
                    <SelectTrigger id="crop">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="potatoes">Potatoes</SelectItem>
                      <SelectItem value="tomatoes">Tomatoes</SelectItem>
                      <SelectItem value="onions">Onions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeRange">Time Range</Label>
                  <Select value={timeRange} onValueChange={(value: TimeRangeType) => setTimeRange(value)}>
                    <SelectTrigger id="timeRange">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Current Price</h3>
                  <div className="bg-white p-4 rounded-md">
                    <div className="text-3xl font-bold text-green-700">
                      ₹{PRICE_HISTORY[selectedCrop][PRICE_HISTORY[selectedCrop].length - 1].price}/kg
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average: ₹{PRICE_HISTORY[selectedCrop][PRICE_HISTORY[selectedCrop].length - 1].avgPrice}/kg
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">Price Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest (12 months):</span>
                      <span className="font-medium">
                        ₹{Math.max(...PRICE_HISTORY[selectedCrop].map((d) => d.price))}/kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowest (12 months):</span>
                      <span className="font-medium">
                        ₹{Math.min(...PRICE_HISTORY[selectedCrop].map((d) => d.price))}/kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average (12 months):</span>
                      <span className="font-medium">
                        ₹
                        {(
                          PRICE_HISTORY[selectedCrop].reduce((acc, curr) => acc + curr.price, 0) /
                          PRICE_HISTORY[selectedCrop].length
                        ).toFixed(2)}
                        /kg
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Price Chart</TabsTrigger>
                <TabsTrigger value="table">Price Table</TabsTrigger>
              </TabsList>

              <TabsContent value="chart">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Price Trends
                      {timeRange === "3months" && " (Last 3 Months)"}
                      {timeRange === "6months" && " (Last 6 Months)"}
                      {timeRange === "year" && " (Last 12 Months)"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ChartContainer
                        config={{
                          price: {
                            label: "Market Price",
                            color: "hsl(142, 76%, 36%)",
                          },
                          avgPrice: {
                            label: "Average Price",
                            color: "hsl(220, 70%, 50%)",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getFilteredData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis
                              label={{ value: "Price (₹/kg)", angle: -90, position: "insideLeft" }}
                              domain={["dataMin - 5", "dataMax + 5"]}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="var(--color-price)"
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              name="Market Price"
                            />
                            <Line
                              type="monotone"
                              dataKey="avgPrice"
                              stroke="var(--color-avgPrice)"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              name="Average Price"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="table">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Price History
                      {timeRange === "3months" && " (Last 3 Months)"}
                      {timeRange === "6months" && " (Last 6 Months)"}
                      {timeRange === "year" && " (Last 12 Months)"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-green-100 dark:bg-green-900/30">
                            <th className="p-3 text-left font-medium">Month</th>
                            <th className="p-3 text-left font-medium">Market Price (₹/kg)</th>
                            <th className="p-3 text-left font-medium">Average Price (₹/kg)</th>
                            <th className="p-3 text-left font-medium">Difference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredData().map((data, index) => (
                            <tr key={index} className="border-b dark:border-gray-700">
                              <td className="p-3">{data.month}</td>
                              <td className="p-3">₹{data.price}</td>
                              <td className="p-3">₹{data.avgPrice}</td>
                              <td className="p-3">
                                <span className={data.price > data.avgPrice ? "text-green-600" : "text-red-600"}>
                                  {data.price > data.avgPrice ? "+" : ""}
                                  {(data.price - data.avgPrice).toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

