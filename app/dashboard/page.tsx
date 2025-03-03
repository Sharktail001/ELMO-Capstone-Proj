"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center bg-light gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-grow container w-full px-4 py-8 mx-auto bg-light">
          {/* Search input integrated into main content */}
          <div className="mb-12">
            <div className="relative max-w-3xl mx-auto">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10 pr-12 py-6 text-lg rounded-xl border-gray-300 shadow-sm bg-white focus:border-[#FF7E77] focus:ring focus:ring-[#FF7E77] focus:ring-opacity-20"
                placeholder="What would you like to learn about today?"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <ArrowRight
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 transition-all duration-200 ease-in-out cursor-pointer ${
                  inputValue
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ color: "#FF7E77" }}
              />
            </div>
          </div>

          {/* Latest Articles section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Latest Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Article 1 */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="AI and Machine Learning"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    AI and Machine Learning Fundamentals
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Learn the basics of artificial intelligence and how machine
                    learning is transforming industries.
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">5 min read</span>
                  <button
                    className="text-sm hover:text-[#FF5951] transition-colors"
                    style={{ color: "#FF7E77" }}
                  >
                    Read more
                  </button>
                </CardFooter>
              </Card>

              {/* Article 2 */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="Data Science"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    Data Science for Beginners
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover how to analyze and interpret complex data sets to
                    drive business decisions.
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">8 min read</span>
                  <button
                    className="text-sm hover:text-[#FF5951] transition-colors"
                    style={{ color: "#FF7E77" }}
                  >
                    Read more
                  </button>
                </CardFooter>
              </Card>

              {/* Article 3 */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="Natural Language Processing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    Natural Language Processing
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Explore how computers understand and generate human language
                    through NLP techniques.
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">6 min read</span>
                  <button
                    className="text-sm hover:text-[#FF5951] transition-colors"
                    style={{ color: "#FF7E77" }}
                  >
                    Read more
                  </button>
                </CardFooter>
              </Card>

              {/* Article 4 */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="Computer Vision"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    Computer Vision Applications
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Learn how machines interpret visual information and the
                    real-world applications.
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">7 min read</span>
                  <button
                    className="text-sm hover:text-[#FF5951] transition-colors"
                    style={{ color: "#FF7E77" }}
                  >
                    Read more
                  </button>
                </CardFooter>
              </Card>

              {/* Article 5 */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="Reinforcement Learning"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    Reinforcement Learning Explained
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Understand how AI agents learn to make decisions through
                    trial and error.
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">10 min read</span>
                  <button
                    className="text-sm hover:text-[#FF5951] transition-colors"
                    style={{ color: "#FF7E77" }}
                  >
                    Read more
                  </button>
                </CardFooter>
              </Card>

              {/* Article 6 */}
              <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="/placeholder.svg?height=192&width=384"
                    alt="AI Ethics"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-gray-900">
                    Ethics in Artificial Intelligence
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Explore the ethical considerations and challenges in
                    developing responsible AI systems.
                  </p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-gray-500">9 min read</span>
                  <button
                    className="text-sm hover:text-[#FF5951] transition-colors"
                    style={{ color: "#FF7E77" }}
                  >
                    Read more
                  </button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
