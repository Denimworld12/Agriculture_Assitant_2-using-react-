import MainHeader from "@/components/main-header"
import HomeSidebar from "@/components/home-sidebar"
import Footer from "@/components/footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <div className="flex-1 flex">
        <HomeSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}