"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const [userType, setUserType] = useState("user")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [farmSize, setFarmSize] = useState("")
  const [primaryCrops, setPrimaryCrops] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const sendOTP = async () => {
    if (!mobile) {
      setError("Please enter a valid mobile number")
      return
    }

    setIsLoading(true)

    try {
      // Mock OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setOtpSent(true)
      setError("")
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      // Mock OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setOtpVerified(true)
      setError("")
    } catch (err) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      // Validate first step
      if (!fullName || !email || !mobile || !otpVerified || !password || !confirmPassword) {
        setError("Please fill all required fields and verify your mobile number")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      setError("")
      setStep(2)
    } else if (step === 2 && userType === "farmer") {
      // Validate second step for farmers
      if (!address || !city || !state || !pincode || !businessType || !farmSize || !primaryCrops) {
        setError("Please fill all required fields")
        return
      }

      setError("")
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (userType === "farmer" && !termsAccepted) {
      setError("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      // Prepare user data
      const userData = {
        name: fullName,
        email: email,
        password: password,
        phone: mobile,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        // Use standard database roles that likely match the ENUM in database
        role: userType === "farmer" ? "farmer" : "consumer" 
      }

      // Add farmer specific data if applicable
      if (userType === "farmer") {
        // Convert farmSize to a number for database
        const numericFarmSize = parseFloat(farmSize) || 0;
        
        Object.assign(userData, {
          farm_name: fullName + "'s Farm",
          farm_size: numericFarmSize, // Send as number instead of string
          farm_location: city + ", " + state,
          farm_description: "Primary crops: " + primaryCrops + ". Business type: " + businessType,
          farmDetails: {
            size: farmSize + " acres",
            crops: primaryCrops,
            location: city + ", " + state
          }
        })
      }

      // Save basic data in localStorage for use across the app
      localStorage.setItem("fullName", fullName)
      localStorage.setItem("email", email)
      localStorage.setItem("mobile", mobile)
      localStorage.setItem("userType", userType)
      
      // Save full user data
      localStorage.setItem("user-data", JSON.stringify({
        name: fullName,
        email: email,
        phone: mobile,
        address: address ? `${address}, ${city}, ${state}, ${pincode}` : "",
        role: userType,
        farmDetails: userType === "farmer" ? {
          size: farmSize + " acres",
          crops: primaryCrops,
          location: city + ", " + state
        } : null
      }))

      // Send registration request to the server
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Registration successful
      // Redirect to profile page regardless of user type
      router.push("/profile")
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Join our platform to access agricultural resources and connect with farmers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="user" value={userType} onValueChange={setUserType}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="user">Consumer</TabsTrigger>
                  <TabsTrigger value="farmer">Farmer</TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Step 1: Basic Information */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <div className="flex gap-2">
                          <Input
                            id="mobile"
                            placeholder="Enter 10-digit mobile number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            disabled={otpSent}
                            required
                          />
                          <Button
                            type="button"
                            variant={otpVerified ? "outline" : "default"}
                            className={
                              otpVerified
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-green-700 hover:bg-green-800"
                            }
                            onClick={sendOTP}
                            disabled={isLoading || otpVerified || !mobile}
                          >
                            {isLoading && !otpVerified ? (
                              "Sending..."
                            ) : otpVerified ? (
                              <Check className="h-4 w-4 mr-1" />
                            ) : (
                              "Send OTP"
                            )}
                          </Button>
                        </div>
                      </div>

                      {otpSent && !otpVerified && (
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter OTP</Label>
                          <div className="flex gap-2">
                            <Input
                              id="otp"
                              placeholder="Enter 6-digit OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              className="bg-green-700 hover:bg-green-800"
                              onClick={verifyOTP}
                              disabled={isLoading || !otp}
                            >
                              {isLoading ? "Verifying..." : "Verify OTP"}
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            OTP sent to {mobile}.
                            <Button
                              type="button"
                              variant="link"
                              className="p-0 h-auto text-green-700"
                              onClick={sendOTP}
                              disabled={isLoading}
                            >
                              Resend OTP
                            </Button>
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="w-full bg-green-700 hover:bg-green-800"
                        onClick={handleNextStep}
                        disabled={isLoading}
                      >
                        Next Step
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Additional Information */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter your address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Select value={state} onValueChange={setState}>
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="gujarat">Gujarat</SelectItem>
                              <SelectItem value="karnataka">Karnataka</SelectItem>
                              <SelectItem value="punjab">Punjab</SelectItem>
                              <SelectItem value="haryana">Haryana</SelectItem>
                              <SelectItem value="up">Uttar Pradesh</SelectItem>
                              <SelectItem value="mp">Madhya Pradesh</SelectItem>
                              <SelectItem value="rajasthan">Rajasthan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          placeholder="6-digit PIN code"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          required
                        />
                      </div>

                      {userType === "farmer" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="businessType">I want to start</Label>
                            <Select value={businessType} onValueChange={setBusinessType}>
                              <SelectTrigger id="businessType">
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="crop_selling">Selling Crops</SelectItem>
                                <SelectItem value="dairy">Dairy Business</SelectItem>
                                <SelectItem value="poultry">Poultry Farming</SelectItem>
                                <SelectItem value="organic">Organic Farming</SelectItem>
                                <SelectItem value="equipment_rental">Equipment Rental</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="farmSize">Farm Size (in acres)</Label>
                            <Input
                              id="farmSize"
                              placeholder="Enter farm size"
                              value={farmSize}
                              onChange={(e) => setFarmSize(e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="primaryCrops">Primary Crops/Products</Label>
                            <Textarea
                              id="primaryCrops"
                              placeholder="List your main crops or products"
                              value={primaryCrops}
                              onChange={(e) => setPrimaryCrops(e.target.value)}
                              required
                            />
                          </div>
                        </>
                      )}

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                          Back
                        </Button>

                        {userType === "user" ? (
                          <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Create Account"}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            className="bg-green-700 hover:bg-green-800"
                            onClick={handleNextStep}
                            disabled={isLoading}
                          >
                            Next Step
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Terms and Conditions (Farmers only) */}
                  {step === 3 && userType === "farmer" && (
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <h3 className="font-medium mb-2">Terms and Conditions for Farmers</h3>
                        <div className="text-sm text-muted-foreground h-48 overflow-y-auto p-2">
                          <p className="mb-2">
                            By registering as a farmer on Agriculture Assistant, you agree to the following terms and
                            conditions:
                          </p>
                          <ol className="list-decimal pl-5 space-y-2">
                            <li>
                              You confirm that all information provided during registration is accurate and complete.
                            </li>
                            <li>
                              You agree to list only genuine agricultural products that you have produced or have the
                              right to sell.
                            </li>
                            <li>
                              You are responsible for the quality of products listed and sold through our platform.
                            </li>
                            <li>
                              You agree to comply with all applicable laws and regulations related to agricultural
                              practices and commerce.
                            </li>
                            <li>
                              You understand that Agriculture Assistant charges a service fee of 2% on all successful
                              transactions.
                            </li>
                            <li>
                              You agree to respond to buyer inquiries within 24 hours and maintain professional
                              communication.
                            </li>
                            <li>You agree to honor all confirmed orders and deliver products as described.</li>
                            <li>
                              You understand that repeated cancellations or quality issues may result in account
                              suspension.
                            </li>
                            <li>
                              You grant Agriculture Assistant permission to use your farm and product information for
                              promotional purposes.
                            </li>
                            <li>
                              You agree to receive notifications related to orders, inquiries, and platform updates.
                            </li>
                          </ol>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I accept the terms and conditions
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                          Back
                        </Button>

                        <Button
                          type="submit"
                          className="bg-green-700 hover:bg-green-800"
                          disabled={isLoading || !termsAccepted}
                        >
                          {isLoading ? "Creating Account..." : "Create Farmer Account"}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-green-700 hover:text-green-800 font-medium">
                  Login
                </Link>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

