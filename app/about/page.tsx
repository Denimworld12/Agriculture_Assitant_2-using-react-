import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Tractor, ShoppingBag, BarChart4, Globe, Languages } from "lucide-react"

// Team members data
const TEAM_MEMBERS = [
  {
    name: "Shivam Gupta",
    role: "Computer Science Engineer",
    image: "/shivam.jpg",
    bio: "I am eager to collaborate on projects that challenge my skills and allow me to work with cutting-edge technologies, turning theoretical knowledge into practical applications.",
    email: "shivamramkarangupta@gmail.com",
    linkedin: "https://www.linkedin.com/in/shivam-gupta-b7603530b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "#",
  },
  {
    name: "Nikhil Gupta",
    role: "Computer Science Engineer",
    image: "/nikhil.jpg",
    bio: "As a fast learner, I adapt quickly to new concepts and environments, which enables me to effectively tackle complex problems and continuously improve my skill set.",
    email: "nikhilrakeshg@gmail.com",
    linkedin: "https://www.linkedin.com/in/nikhil-gupta-5b7350282/",
    github: "https://github.com/Denimworld12",
  },
  {
    name: "Umed Indulkar",
    role: "Computer Science Engineer",
    image: "/umed.jpg",
    bio: "Driven by an insatiable curiosity, I constantly seek to explore new technologies and understand the underlying principles that drive innovation in the field of computer science.",
    email: "umedindulkar24@gmail.com",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Abhishek Jaiswar",
    role: "Computer Science Engineer",
    image: "/abhishek.jpg",
    bio: "My academic journey reflects a strong dedication to excellence, consistently achieving high grades and a deep understanding of computer science principles.",
    email: "abhishekjaiswar224@gmail.com",
    linkedin: "https://www.linkedin.com/in/shivam-gupta-b7603530b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    github: "#",
  },
]

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Agriculture Assistant</h1>
            <p className="text-lg md:text-xl text-green-100 mb-8">
              Our mission is to empower farmers and connect them directly with consumers, creating a sustainable
              agricultural ecosystem that benefits everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/market">
                <Button size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  Explore Marketplace
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4">
                <p>
                  Agriculture Assistant was born from a simple observation: farmers weren&apos;t getting fair prices for
                  their produce, while consumers were paying high prices due to multiple intermediaries in the supply
                  chain.
                </p>
                <p>
                  Founded in 2023, our platform aims to bridge this gap by connecting farmers directly with consumers,
                  eliminating middlemen, and ensuring better returns for farmers and fair prices for consumers.
                </p>
                <p>
                  What started as a small project has grown into a comprehensive platform that not only facilitates
                  direct buying and selling but also provides valuable agricultural information, equipment rental
                  services, and access to government schemes.
                </p>
                <p>
                  Today, we&apos;re proud to serve thousands of farmers and consumers across Maharashtra, with plans to
                  expand our services nationwide.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/crops4.jpg?height=400&width=600&text=Our Story"
                alt="Farmers in field"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision Section */}
      <section className="py-16 bg-green-50 dark:bg-green-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-lg text-muted-foreground">
              We&apos;re committed to transforming agricultural commerce and empowering farming communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="mb-6">
                  To create a transparent, efficient, and sustainable agricultural marketplace that empowers farmers,
                  provides consumers with access to fresh produce, and promotes environmentally responsible farming
                  practices.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Eliminate intermediaries in the agricultural supply chain
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Ensure fair prices for both farmers and consumers
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Provide access to modern farming resources and information
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Support sustainable and environmentally friendly farming
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="mb-6">
                  To become India&apos;s leading agricultural platform that transforms the way farming communities operate,
                  making agriculture more profitable, sustainable, and accessible for everyone involved.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Create a nationwide network of farmers and consumers
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Integrate advanced technology into traditional farming
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Develop rural economies through agricultural innovation
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                    Promote food security and sustainable consumption
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-lg text-muted-foreground">
              Our platform offers unique features designed specifically for the agricultural community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Direct Connection</h3>
              <p className="text-muted-foreground">
                Our platform eliminates middlemen, allowing farmers to connect directly with consumers and receive
                better prices for their produce.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Tractor className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Equipment Access</h3>
              <p className="text-muted-foreground">
                Farmers can rent necessary equipment and tools, reducing capital investment and improving productivity
                without major upfront costs.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Transparent Marketplace</h3>
              <p className="text-muted-foreground">
                Our marketplace provides complete transparency with detailed information about crops, prices, and
                farmers for informed purchasing decisions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <BarChart4 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Price Insights</h3>
              <p className="text-muted-foreground">
                Track historical crop prices and receive alerts for the best buying and selling opportunities based on
                market trends.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Government Scheme Access</h3>
              <p className="text-muted-foreground">
                Easy access to information about agricultural schemes, subsidies, and programs offered by the government
                to support farmers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 w-fit mb-4">
                <Languages className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-medium mb-2">Multilingual Support</h3>
              <p className="text-muted-foreground">
                Our platform is available in multiple languages including English, Hindi, and Marathi to ensure
                accessibility for all users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-16 bg-green-50 dark:bg-green-900/20">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
      <p className="text-lg text-muted-foreground">
        The passionate individuals behind Agriculture Assistant working to transform agricultural commerce in
        India.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {TEAM_MEMBERS.map((member, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-64">
            <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
            <p className="text-green-700 dark:text-green-400 mb-2">{member.role}</p>
            <p className="text-muted-foreground mb-4">
              {member.bio.split(" ").slice(0, 12).join(" ")}...
            </p>
            <div className="flex justify-center space-x-4">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-600"
                >
                  <i className="fab fa-github"></i> GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-700 rounded-xl text-white">
            <div className="max-w-3xl mx-auto text-center px-4 py-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Agricultural Revolution</h2>
              <p className="text-lg text-green-100 mb-8">
                Whether you&apos;re a farmer looking to sell your produce or a consumer seeking fresh, locally-grown food,
                Agriculture Assistant is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-green-800 hover:bg-green-100">
                    Create Account
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}

