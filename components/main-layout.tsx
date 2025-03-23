import type React from "react"
import MainHeader from "@/components/main-header"
import Footer from "@/components/footer"
import HomeSidebar from "@/components/home-sidebar"

export default function MainLayout({
  children,
  hideSidebar = false,
}: {
  children: React.ReactNode
  hideSidebar?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      {!hideSidebar && <HomeSidebar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

