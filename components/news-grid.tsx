import Image from "next/image"

export function NewsGrid() {
  // Create more news items to demonstrate scrolling
  const newsItems = Array(12).fill({
    title: "RFK is confirmed as Health and Human Services Secretary",
    image: "placeholder.svg",
  })

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {newsItems.map((item, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="aspect-video relative">
            <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-medium">{item.title}</h2>
          </div>
        </div>
      ))}
    </div>
  )
}

