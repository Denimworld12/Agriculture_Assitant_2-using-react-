"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  ShoppingBag,
  Newspaper,
  TrendingUp,
  Tractor,
  User,
  ShoppingCart,
  Info,
  Truck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

export default function HomeSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-40 left-0 top-20 bg-green-700 text-white p-2 rounded-r-lg shadow-md hover:bg-green-600 transition-all duration-300"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-screen bg-white dark:bg-gray-900 shadow-lg z-30 w-64 transition-all duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full">
          <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 overflow-y-auto">
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-muted-foreground mb-2 px-2">MAIN MENU</h3>

              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>

              <Link href="/market">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Marketplace
                </Button>
              </Link>

              <Link href="/news">
                <Button variant="ghost" className="w-full justify-start">
                  <Newspaper className="mr-2 h-4 w-4" />
                  News
                </Button>
              </Link>

              <Link href="/market/prices">
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Market Price Trends
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Your Cart
                </Button>
              </Link>

              <Link href="/track-order">
                <Button variant="ghost" className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Track Order
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-sm text-muted-foreground mb-2 px-2">FOR FARMERS</h3>

              <Link href="/farmer">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Farmer Dashboard
                </Button>
              </Link>

              <Link href="/farmer/sell">
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Sell Your Crops
                </Button>
              </Link>

              <Link href="/farmer/equipment">
                <Button variant="ghost" className="w-full justify-start">
                  <Tractor className="mr-2 h-4 w-4" />
                  Rent Equipment
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-sm text-muted-foreground mb-2 px-2">ACCOUNT</h3>

              <Link href="/profile">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
              </Link>

              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start">
                  <Info className="mr-2 h-4 w-4" />
                  About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

