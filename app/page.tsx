"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock, Newspaper, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/explore")
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loading, isAuthenticated, router])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tighter">ELMO</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/authentication">
              <Button variant="outline" className="rounded-full">
                Sign In
              </Button>
            </Link>
            <Link href="/authentication">
              <Button className="rounded-full bg-[#FF7E77] hover:bg-[#FF5951] text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f5f5f0] -z-10" />
        <div className="absolute top-1/2 right-[10%] transform -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FF7E77] blur-3xl opacity-30 -z-10" />

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Big stories.
              <br />
              Little details.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Stay informed your way. Elmo delivers personalized news with flexible reading modes that adapt to your
              schedule and interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/authentication">
                <Button className="rounded-full bg-[#FF7E77] hover:bg-[#FF5951] text-white px-8 py-6">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="rounded-full px-8 py-6">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7E77]/10 to-[#FF7E77]/30 z-10 rounded-xl" />
            <Image src="/magnifying.gif?height=500&width=400" alt="Elmo News App" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">News that adapts to your life</h2>
            <p className="text-lg text-gray-600">
              Elmo brings you the stories that matter, in the format that works for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f5f5f0] p-8 rounded-xl">
              <div className="w-12 h-12 bg-[#FF7E77]/20 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-[#FF7E77]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Feed</h3>
              <p className="text-gray-600">News tailored to your interests, preferences, and reading habits.</p>
            </div>

            <div className="bg-[#f5f5f0] p-8 rounded-xl">
              <div className="w-12 h-12 bg-[#FF7E77]/20 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-[#FF7E77]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Time-Saving Formats</h3>
              <p className="text-gray-600">Choose how much detail you want, from quick summaries to deep dives.</p>
            </div>

            <div className="bg-[#f5f5f0] p-8 rounded-xl">
              <div className="w-12 h-12 bg-[#FF7E77]/20 rounded-full flex items-center justify-center mb-6">
                <Newspaper className="h-6 w-6 text-[#FF7E77]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Diverse Sources</h3>
              <p className="text-gray-600">Get a balanced perspective with news from multiple trusted sources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Modes Section */}
      <section id="reading-modes" className="py-20 bg-[#f5f5f0]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Read your way</h2>
            <p className="text-lg text-gray-600">Elmo adapts to your schedule with three flexible reading modes.</p>
          </div>

          <div className="grid gap-6 max-w-3xl mx-auto">
            <div className="bg-pink-100 p-6 rounded-xl border border-pink-200 transition-transform hover:scale-[1.01]">
              <h3 className="text-xl font-bold mb-2">Brief</h3>
              <p className="text-gray-700">Quick, easy-to-read summaries with key takeaways</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 transition-transform hover:scale-[1.01]">
              <h3 className="text-xl font-bold mb-2">Standard</h3>
              <p className="text-gray-700">Our standard news articles with essential details</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 transition-transform hover:scale-[1.01]">
              <h3 className="text-xl font-bold mb-2">Deep Dive</h3>
              <p className="text-gray-700">Comprehensive analysis and in-depth reporting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Explore by category</h2>
            <p className="text-lg text-gray-600">
              Discover news across a wide range of topics tailored to your interests.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Breaking News & Current Events */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-medium text-sm md:text-base">Breaking News & Current Events</h3>
            </div>

            {/* Technology & Innovation */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="font-medium text-sm md:text-base">Technology & Innovation</h3>
            </div>

            {/* Science */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-3">🧪</div>
              <h3 className="font-medium text-sm md:text-base">Science</h3>
            </div>

            {/* Health & Wellness */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-3">💊</div>
              <h3 className="font-medium text-sm md:text-base">Health & Wellness</h3>
            </div>

            {/* Entertainment & Media */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="font-medium text-sm md:text-base">Entertainment & Media</h3>
            </div>

            {/* Sports & Lifestyle */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <div className="text-4xl mb-3">🏈</div>
              <h3 className="font-medium text-sm md:text-base">Sports & Lifestyle</h3>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl shadow-gray-300">
                <Image
                  src="/puzzle.gif?height=600&width=400"
                  alt="Elmo App Interface"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">News that fits into your life</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FF7E77]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-[#FF7E77]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Save for later</h3>
                    <p className="text-gray-600">Bookmark articles to read when you have time.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FF7E77]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-[#FF7E77]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Discover new perspectives</h3>
                    <p className="text-gray-600">Explore topics outside your usual interests.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FF7E77]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-[#FF7E77]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Stay up to date</h3>
                    <p className="text-gray-600">Get timely updates on breaking news and developing stories.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/authentication">
                  <Button className="rounded-full bg-[#FF7E77] hover:bg-[#FF5951] text-white px-8 py-6">
                    Start Reading Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5f5f0]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">
            Ready to experience news differently?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of readers who get their news through Elmo. No information overload, just the stories that
            matter to you.
          </p>
          <Link href="/authentication">
            <Button className="rounded-full bg-[#FF7E77] hover:bg-[#FF5951] text-white px-8 py-6 text-lg">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ELMO</h3>
              <p className="text-gray-600">Big stories. Little details.</p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-600 hover:text-[#FF7E77]">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#reading-modes" className="text-gray-600 hover:text-[#FF7E77]">
                    Reading Modes
                  </Link>
                </li>
                <li>
                  <Link href="#categories" className="text-gray-600 hover:text-[#FF7E77]">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#FF7E77]">
                    Team
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#FF7E77]">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Elmo News. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 hover:text-[#FF7E77]">
                Twitter
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#FF7E77]">
                Instagram
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#FF7E77]">
                Facebook
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
