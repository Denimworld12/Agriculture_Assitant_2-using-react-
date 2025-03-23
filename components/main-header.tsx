"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Search, ShoppingCart, User, Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function MainHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [notifications, setNotifications] = useState([])

  // Check if user is logged in (mock implementation)
  useEffect(() => {
    // This would be replaced with actual auth check
    const checkAuth = () => {
      const token = localStorage.getItem("auth-token")
      setIsLoggedIn(!!token)

      // Get user data if logged in
      if (token) {
        const userData = JSON.parse(localStorage.getItem("user-data") || '{"name":"Guest"}')
        setUserName(userData.name)

        // Get notifications
        const notifs = JSON.parse(localStorage.getItem("notifications") || "[]")
        setNotifications(notifs)
      }
    }

    checkAuth()
  }, [])

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "News", href: "/news" },
    { name: "Marketplace", href: "/market" },
    { name: "Market Price Trends", href: "/market/prices" },
    { name: "Your Cart", href: "/cart" },
    { name: "Track Order", href: "/track-order" },
  ]

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm",
      isScrolled && "shadow-md"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-700 dark:text-green-500 no-underline">
              <Image 
                src="/assitant_logo.webp" 
                alt="Agriculture Logo" 
                width={40} 
                height={40}
                className="object-contain" 
              />
              Agriculture Assistant
            </Link>

            {/* Desktop Navigation */}
            <nav className="ml-10 hidden md:flex items-center h-16 space-x-1 overflow-visible">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "h-9 px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline flex items-center",
                    pathname === item.href
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                      : "text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/20",
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 h-9 px-3 py-2">
                    More <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-50">
                  <DropdownMenuItem asChild>
                    <Link href="/language" className="no-underline">Language</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about" className="no-underline">About Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/farmer" className="no-underline">Start Business</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/farmer/sell" className="no-underline">Sell Your Crops</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/farmer/equipment" className="no-underline">Rent Equipment</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Form */}
            <div className="hidden md:flex relative">
              <Input type="search" placeholder="Search" className="w-[200px] lg:w-[300px]" />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Notifications */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                        {notifications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2 border-b">
                    <h3 className="font-medium">Notifications</h3>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          localStorage.setItem("notifications", "[]")
                          setNotifications([])
                        }}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No new notifications</div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map((notif: {
                        link?: string;
                        title: string;
                        message: string;
                        time: string;
                      }, index) => (
                        <div key={index} className="p-3 border-b last:border-b-0 hover:bg-muted/50">
                          <Link href={notif.link || "#"} className="block">
                            <h4 className="font-medium text-sm">{notif.title}</h4>
                            <p className="text-xs text-muted-foreground">{notif.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="no-underline">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">Welcome, {userName}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="no-underline">See Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/track-order" className="no-underline">Track Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem("auth-token")
                        localStorage.removeItem("user-data")
                        window.location.href = "/"
                      }}
                    >
                      Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="no-underline">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="no-underline">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] max-w-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-700 dark:text-green-500 no-underline">
                      <Image 
                        src="/assitant_logo.webp" 
                        alt="Agriculture Logo" 
                        width={40} 
                        height={40} 
                        className="object-contain"
                      />
                      Agriculture Assistant
                    </Link>
                  </div>

                  <div className="relative mb-6">
                    <Input type="search" placeholder="Search" className="w-full pr-8" />
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>

                  <nav className="flex flex-col space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline flex items-center",
                          pathname === item.href
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                            : "text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/20",
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/language"
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/20 no-underline flex items-center"
                    >
                      Language
                    </Link>
                    <Link
                      href="/about"
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/20 no-underline flex items-center"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/farmer"
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/20 no-underline flex items-center"
                    >
                      Start Business
                    </Link>
                    <Link
                      href="/farmer/sell"
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/20 no-underline flex items-center"
                    >
                      Sell Your Crops
                    </Link>
                    <Link
                      href="/farmer/equipment"
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-green-50 dark:text-gray-200 dark:hover:bg-green-900/20 no-underline flex items-center"
                    >
                      Rent Equipment
                    </Link>
                  </nav>

                  <div className="mt-auto">
                    {isLoggedIn ? (
                      <div className="space-y-2">
                        <Link href="/profile" className="block w-full no-underline">
                          <Button variant="outline" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            See Profile
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            localStorage.removeItem("auth-token")
                            localStorage.removeItem("user-data")
                            window.location.href = "/"
                          }}
                        >
                          Log Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/login" className="block w-full no-underline">
                          <Button variant="default" className="w-full">
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup" className="block w-full no-underline">
                          <Button variant="outline" className="w-full">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

