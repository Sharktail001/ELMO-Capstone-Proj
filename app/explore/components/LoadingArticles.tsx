// src/app/explore/components/LoadingArticles.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingArticles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-md">
          <Skeleton className="h-40 w-full mb-4" />  
          <CardContent className="p-5">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter className="px-5 pb-5 pt-0">
            <Skeleton className="h-4 w-1/4" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}