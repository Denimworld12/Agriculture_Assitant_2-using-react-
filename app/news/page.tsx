"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, ChevronRight } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  image: string
  category: string
  source: string
}

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Fetch news data from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)

        // Get API key from environment variable
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
        
        // Make the real API call
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=agriculture+farming+crops&apiKey=${apiKey}&page=${page}&pageSize=10&language=en`
        )
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }
        
        const data = await response.json()
        
        // Transform API response to match our NewsItem interface
        const transformedData: NewsItem[] = data.articles.map((article: any, i: number) => ({
          id: `${page}-${i + 1}`,
          title: article.title || `Agricultural News Article ${page * 10 + i + 1}`,
          excerpt: article.description || "No description available",
          content: article.content || "No content available",
          date: article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          image: article.urlToImage || `/placeholder.svg?height=400&width=600&text=News ${page * 10 + i + 1}`,
          category: article.source?.name || "Agriculture",
          source: article.source?.name || "NewsAPI",
        }))

        if (page === 1) {
          setNewsData(transformedData)
        } else {
          setNewsData((prev) => [...prev, ...transformedData])
        }

        // Set hasMore based on total results from API
        if (data.articles.length < 10 || page * 10 >= data.totalResults) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }

        setError("")
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Failed to fetch news. Please try again later.")
        
        // Fallback to mock data if API fails
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData: NewsItem[] = Array.from({ length: 10 }, (_, i) => ({
          id: `${page}-${i + 1}`,
          title: `Agricultural News Article ${page * 10 + i + 1}`,
          excerpt:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
          image: `/placeholder.svg?height=400&width=600&text=News ${page * 10 + i + 1}`,
          category: ["Agriculture", "Climate", "Technology", "Policy", "Market"][Math.floor(Math.random() * 5)],
          source: ["NewsAPI", "AgriNews", "FarmToday", "ClimateWatch", "TechFarm"][Math.floor(Math.random() * 5)],
        }))

        if (page === 1) {
          setNewsData(mockData)
        } else {
          setNewsData((prev) => [...prev, ...mockData])
        }

        // Set hasMore to false after page 3 (for demo purposes)
        if (page >= 3) {
          setHasMore(false)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [page])

  // Filter news based on search
  const filteredNews = newsData.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Agricultural News</h1>
            <p className="text-muted-foreground">Stay updated with the latest agricultural and climate news</p>
          </div>

          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-[300px]"
              />
            </div>
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
            <p className="mt-4">Loading news...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => setPage(1)}>
              Try Again
            </Button>
          </div>
        ) : filteredNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((news) => (
                <Card key={news.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image 
                      src={news.image || "/placeholder.svg"} 
                      alt={news.title} 
                      fill 
                      className="object-cover"
                      onError={(e) => {
                        // On image error, replace with placeholder
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite error loop
                        target.src = `/placeholder.svg?height=400&width=600&text=News`;
                      }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{news.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {news.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                    <p className="text-muted-foreground mb-4">{news.excerpt}</p>

                    <Link href={`/news/${news.id}`}>
                      <Button variant="link" className="p-0 h-auto text-green-700 hover:text-green-800">
                        Read More <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} disabled={loading} className="bg-green-700 hover:bg-green-800">
                  {loading ? "Loading..." : "Load More News"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No news found</h3>
            <p className="text-muted-foreground mb-4">No news articles match your search criteria.</p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

